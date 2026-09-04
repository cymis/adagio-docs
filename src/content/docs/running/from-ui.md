---
title: Running from the UI
description: Configure, start, and monitor pipeline runs in Adagio
---

Use the UI when you want to configure a run, send it to a connected Runtime
Server, and monitor every pipeline step from Adagio.

## Select a Runtime Server

Open the pipeline in the editor and use the Runtime Server indicator in the
title bar to choose where it will run.

Adagio Desktop appears automatically when it is signed in and connected. A
self-hosted Linux machine must first be enrolled under **Settings → Runtime
Servers**. See [Runtime Servers](/running/runtime-servers/) for setup
instructions.

The selected server must be connected before a run can start. Changing servers
after a run has begun requires clearing that editor session's run state.

## Configure the run

Click **Run** in the toolbar. The run form groups settings into three areas:

- **Params** contains promoted pipeline parameters. Defaults are prefilled;
  promoted parameters without defaults are required.
- **Files** contains promoted pipeline inputs.
- **Environment** contains the run name and description, task environments,
  maximum parallel tasks, and cache reuse.

Adagio lists unresolved items above the **Start run** button. The run remains
blocked until every required input, parameter, and task environment is valid.

## Provide input paths

For Adagio Desktop, use the file picker to choose files on that computer.

For a self-hosted Runtime Server, enter a path that exists on the server. The
browser does not upload the file and cannot verify a path on another machine.
The Runtime Server's Linux user must be able to read it.

Common inputs include:

- QIIME 2 artifacts such as `.qza`
- metadata tables such as `.tsv` or `.csv`
- directories required by directory-based import formats

The input's semantic type tells you which kind of data the action expects.

## Choose task environments

Each action runs in the environment selected for that task:

- a Docker image
- a conda environment already installed on the Runtime Server
- an Apptainer or Singularity `.sif` image already present on the Runtime Server

Container names and filesystem paths are interpreted by the selected Runtime
Server. Resolve any missing environment before starting the run.

## Start and monitor the run

Choose **Start run** after the checklist is clear. Adagio creates the run and the
selected Runtime Server claims it.

The run view shows each pipeline step with a status indicator:

| Status | Meaning |
| --- | --- |
| Pending | Waiting to start |
| Running | Currently executing |
| Complete | Finished successfully |
| Failed | Encountered an error |

Select a step to inspect its logs. If the Runtime Server disconnects, Adagio
preserves the last reported state while it waits for the server to reconnect.

## Results

The Runtime Server reports output artifact paths to Adagio. For a self-hosted
server, those paths refer to the server's filesystem. Access them using the
filesystem and permissions available on that machine.

## Reruns and caching

When cache reuse is enabled, eligible steps whose inputs and settings match a
previous run can be skipped and their results reused. Connected local-plugin
actions always execute fresh so library-code changes are picked up immediately.

You can disable reuse for an individual eligible node or turn off **Reuse
cached results** for the entire run.

## Export for CLI use

You can export:

- the pipeline as an `.adg` file
- the current parameter configuration for a CLI run

Paths in the exported configuration are still paths from the machine used for
the UI run. Replace them when the CLI will run on another host.

See [Running with the CLI](/running/cli/) and [Runtime
Configuration](/running/cli-config/) for command-line execution.
