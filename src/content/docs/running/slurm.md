---
title: Slurm execution and Run environments
description: Schedule whole pipeline actions on a cluster with shared storage
---

Slurm execution submits each plugin action as one batch job. Independent actions
can overlap; downstream actions wait until their inputs have been produced and
validated. Plugins are unchanged. CPU requests allocate cores; they do not change
plugin parameters such as `threads` or `n_jobs`.

This feature requires the coordinated Slurm release: `adagio-cli` 0.2.0,
`adagio-server` 0.2.0 and `adapter-schemas` 0.4.0, plus the application's Run
environment migration. These versions have not yet been published. Until
release, install the matching source checkouts together.

## Submit-host setup

Run the CLI or Runtime Server on a cluster submit host with `sbatch`, `squeue`,
`sacct` and `scancel` available. A Runtime Server's server home holds the job
cache, which compute hosts must reach at the same path, so for Slurm it is on
shared storage, and file locks must work there. Run one Runtime Server per
server home, on one host at a time: a second server on another host could
mistake the first one's running jobs for leftovers. Accounting must provide allocation states and
exit codes. Adagio does not submit through SSH from your laptop. Run
`adagio capabilities` on the submit host to see which executors the CLI can use
there, and why one is unavailable. A Runtime Server reports what its own
service can find, and a service does not see what your login shell adds to
`PATH`, such as `module load slurm` or `/etc/profile.d` scripts. If Slurm is
available in your shell but the server reports it missing, run
`systemctl --user edit adagio-server`, add `Environment=PATH=…` under
`[Service]` with your shell's `PATH`, then
`systemctl --user restart adagio-server`.

Use Apptainer with an existing `.sif` image or a shared Conda prefix. The worker
launch executable, environment, inputs, cache and shared work directory must be
available at the same paths on compute hosts. A submit-host path check cannot
prove compute-host visibility; every batch job checks its required paths again.
The shared work directory supports shared scratch. Node-local scratch and
Slurm with Docker are unsupported. Local Docker execution remains available.

Compute workers need no hosted Adagio credentials. The coordinator on the submit
host reports progress and results. Keep that coordinator running until completion:
a run started by a Runtime Server stops, cancelling its jobs, if that server stops.
There is no coordinator restart/resume or automatic resubmission in this release.

## Create a Run environment

Open **Settings → Run environments → New Run environment**. Enter a name,
choose an existing Runtime Server, and select **Local** or **Slurm**. For Slurm,
enter an absolute shared work directory. Partition/queue, account, memory, time
limit and QoS are optional; omission uses the applicable cluster default.
Default CPUs per task is **1**. **Maximum submitted jobs** defaults to **8** and
counts pending plus running jobs for each pipeline run. It is independent of
other pipeline runs and of the Runtime Server's submit-host CPU count.

**Advanced Slurm options** accepts separate option/value pairs. Supported options
are `--constraint`, `--reservation`, `--licenses`, `--prefer` and `--nice`.
Resource, job identity, logging, arrays, dependencies and requeue options are
managed by Adagio and cannot be overridden here. These fields are arguments,
not shell commands.

Run environments belong to your account and pair execution settings with one
Runtime Server. Select a **server - environment** entry from the server icon in
the pipeline title bar on the edit or run page. Each server also has a Local
option. Click a configured environment in Settings to edit it, or use its Delete
button. Task software environments remain configured per action. A Slurm run is
accepted only by a Runtime Server whose CLI reports Slurm as available; a
requested Slurm run never silently executes locally. The CLI checks the
settings themselves when the run starts, so a mistake such as a relative work
directory fails the run immediately with the CLI's explanation.

Each CPU and memory field resolves independently: task override, then Run
environment default, then one CPU or cluster-default memory. Memory is the total allocation
for one whole action, never multiplied by CPU count. Positive decimal and binary
units are accepted, for example `4 GB`, `4 GiB` or `512 MiB`; Slurm memory is
rounded upward to a whole MiB. Existing per-node resource controls set overrides.

Submission copies all settings into the run. Editing or deleting the Run
environment cannot change an existing run. **Re-run / duplicate** starts with its
saved settings; explicitly select a current Run environment to adopt later
changes. Run
**Configuration → Download saved run configuration** exports the saved JSON.
The editor's run-config download exports TOML with the selected snapshot.

## CLI configuration

JSON and TOML have equivalent semantics. A missing executor runs locally, one
task at a time (`kind = "local"`). Version must be the integer `1`. Unknown
keys, executors and unsupported versions fail validation.

```toml
version = 1

[defaults]
kind = "apptainer"
image = "/shared/images/plugin.sif"

[executor]
kind = "slurm"
work_dir = "/shared/adagio/work"
max_in_flight = 8

[executor.slurm]
partition = "general"
account = "my-lab"
time_limit = "02:00:00"
extra_args = ["--constraint=avx2"]

[resources.defaults]
cpus = 1
memory = "4 GiB"

[resources.tasks."actual-node-id"]
cpus = 8
memory = "32 GiB"
```

Replace paths, scheduler settings and node IDs with your cluster's values. For
Conda, use `kind = "conda"` and an absolute `prefix` instead of `image`. Set
`conda_executable` if needed. Environment overrides retain their existing
per-task → plugin → default resolution; resource overrides use stable node IDs.

```bash
adagio capabilities
adagio runtime --spec pipeline.adg --config runtime.toml --arguments arguments.json --cache-dir /shared/adagio/cache --plan-only
adagio runtime --spec pipeline.adg --config runtime.toml --arguments arguments.json --cache-dir /shared/adagio/cache --output-dir /shared/adagio/outputs
```

`adagio run --pipeline pipeline.adg --config runtime.toml --cache-dir /shared/adagio/cache --plan-only` also
supports plan inspection with that pipeline's input/parameter flags. Planning
validates the requested dependency closure and prints internal whole-action
nodes, environments and resources without executing scientific actions or
submitting jobs. The inspection output is not a new public scientific plan API.

## Progress, diagnostics and cancellation

Pending jobs stay queued; a task shows as running once Slurm starts it. Each
job's Slurm ID is recorded in the run's `submissions.json`, and the message for
a job that Slurm reports as failed names it. Adagio polls every 2 seconds, backing off to every 30
seconds while nothing changes. Each run works in its own `run-…` directory under
the shared work directory: one `attempt-…` directory per task (task spec, batch
script, log and result manifest) and the run's `submissions.json` registry.
Scheduler completion alone is insufficient: the worker must publish a current
complete result manifest and all declared output paths. After a successful run
Adagio saves its outputs and removes the run directory; a failed or interrupted
run keeps it for inspection and cleanup. Output paths, archived results and task
logs remain available through the normal run UI.

On a failure, Adagio stops submitting and cancels peers. A failed action, timeout,
out-of-memory termination, missing output or unknown scheduler state fails the
run. Temporary accounting delays are allowed; disappearance is never success.
A job Slurm stops accounting for fails its action but is still cancelled, since
it may still be running. While Slurm cannot be reached at all, for example
during a controller or accounting outage, Adagio keeps waiting on jobs already
submitted and fails the run only after 30 minutes without an answer. A
submission attempted during an outage is uncertain and stops the run; see
below.

Every job is named `adagio-…` after its task attempt, and Adagio looks jobs up
and cancels them by that name as well as their job ID. Slurm reuses job IDs, so
this guarantees a later job that received the same ID is never touched.

Use **Cancel run**, Ctrl-C, SIGTERM or SIGHUP (such as a closed SSH session) for
scoped cleanup. To keep a command-line run going after you log out, start it
with `nohup`, or inside `tmux` or `screen`. If the Runtime Server stops or
crashes, the CLI run it started stops its running tasks and cancels its own jobs. If the CLI is killed before it can cancel them, the
Runtime Server runs `adagio cleanup` with the run's record, which cancels
exactly the jobs in that run's registry; a restarted server does the same for
records its previous process left. From the command line, pass
`--run-record FILE` to `adagio runtime` and run `adagio cleanup FILE` after an
interrupted run; a run removes the record itself once none of its jobs can
still be running. Cleanup never acts while the run's own process is still alive:
it changes nothing and exits with status 75, so try again once that process has
stopped. Run cleanup on the same host as the run: other hosts may not see the
lock that tells a live run from a dead one. Adagio refuses to start a run whose record is on a filesystem where
it finds a second lock on the same file granted, but it cannot detect a lock
that other hosts, or the other side of a virtual machine such as Docker
Desktop's, do not see. Inspect any **cleanup incomplete** message: scheduler
outages can prevent confirmation. Never use a broad `scancel -u` to clean up an
individual Adagio run.

When Slurm refuses a submission outright, for example an invalid partition or
account, the run fails with Slurm's own message and nothing needs cleaning up.
An uncertain `sbatch` response, such as a timeout, is never retried: it is
recorded as unconfirmed in `submissions.json` until cancellation or cleanup
settles it. Stopping a run while `sbatch` is still answering waits for that
answer, at most 30 seconds, so a stop never makes a submission uncertain.
Cancellation and cleanup cancel any job with
its exact `adagio-…` name, and settle it once no such job has appeared for a
minute longer than the cluster's credential lifetime: Slurm still acts on a
request that reaches it until the request's credential expires. Adagio uses an
explicit positive `AuthInfo` `ttl` from `scontrol show config` for this bound.
If that value cannot be verified (including an unset or zero `ttl`), cleanup
reports incomplete and preserves unseen submissions and their run record for
a later attempt. It does not assume a default lifetime: authentication defaults
can vary between clusters. Jobs that appear can still be cancelled and confirmed
as ended. Once you have checked with `squeue --name=adagio-…`, using the names
in the message, that no such job exists, settle the submission with
`adagio cleanup --settle-unconfirmed FILE`; for a Runtime Server run, `FILE`
is `<server home>/jobs/<job id>/run-record.json`. Do not delete the record by
hand. Alternatively, ask the cluster administrator to set an explicit
credential lifetime, so such submissions settle by themselves. There are no automatic retries,
arrays, Slurm dependency chains, MPI/multi-node jobs or GPU-specific controls.

Cache lookup happens inside submitted workers. A cached action can still consume
a scheduler job. Scientific parameters control cache identity; an automatically
chosen random seed can prevent reuse. Adagio preserves the scientific cache's
behavior and does not invent a separate Slurm cache identity.

The disposable single-node acceptance tests exercise real Slurm and scientific
outputs. A target cluster still needs validation of site policy, multi-host path
visibility, account/partition/QoS, cancellation and memory enforcement.
