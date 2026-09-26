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
`sacct` and `scancel` available. Accounting must provide allocation states and
exit codes. Adagio does not submit through SSH from your laptop. Run
`adagio capabilities` on the submit host to see which executors the CLI can use
there, and why one is unavailable; a Runtime Server reports the same to Adagio.

Use Apptainer with an existing `.sif` image or a shared Conda prefix. The worker
launch executable, environment, inputs, cache and shared work directory must be
available at the same paths on compute hosts. A submit-host path check cannot
prove compute-host visibility; every batch job checks its required paths again.
The shared work directory supports shared scratch. Node-local scratch and
Slurm with Docker are unsupported. Local Docker execution remains available.

Compute workers need no hosted Adagio credentials. The coordinator on the submit
host reports progress and results. Keep that coordinator running until completion.
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

Pending jobs stay queued; a task shows as running, with its scheduler job ID,
once Slurm starts it. Adagio polls every 2 seconds, backing off to every 30
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
Use **Cancel run**, Ctrl-C or SIGTERM for scoped cleanup. If the CLI is killed
before it can cancel its jobs, the Runtime Server runs `adagio cleanup` with the
run's record, which cancels exactly the jobs in that run's registry. From the
command line, pass `--run-record FILE` to `adagio runtime` and run
`adagio cleanup FILE` after an interrupted run. Inspect any **cleanup
incomplete** message: scheduler outages can prevent confirmation. Never use a
broad `scancel -u` to clean up an individual Adagio run.

An uncertain `sbatch` response is not retried. Reconcile the exact `adagio-…` job
name and job IDs in `submissions.json`; retain that directory until cleanup is
confirmed. There are no automatic retries, arrays, Slurm dependency chains,
MPI/multi-node jobs or GPU-specific controls.

Cache lookup happens inside submitted workers. A cached action can still consume
a scheduler job. Scientific parameters control cache identity; an automatically
chosen random seed can prevent reuse. Adagio preserves the scientific cache's
behavior and does not invent a separate Slurm cache identity.

The disposable single-node acceptance tests exercise real Slurm and scientific
outputs. A target cluster still needs validation of site policy, multi-host path
visibility, account/partition/QoS, cancellation and memory enforcement.
