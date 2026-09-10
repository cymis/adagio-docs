---
title: Quick Start
description: Build and run your first pipeline
---

This guide walks through the shortest end-to-end Adagio workflow:

- add actions to the canvas
- connect them into a valid graph
- expose the right run-time inputs and parameters
- run the pipeline
- export the pipeline for CLI use

## 1. Open the pipeline editor

Sign in to your Adagio instance and create a new pipeline.

## 2. Create a new pipeline

The editor has three main areas:

- the action tray on the left
- the canvas in the middle
- the inspector on the right

## 3. Add actions

Each action is one plugin method or pipeline. To add one:

1. Browse or search in the action tray.
2. Add an action such as `demux`, `dada2`, or another plugin action relevant to your workflow.
3. Repeat until the core steps of your analysis are on the canvas.

## 4. Connect nodes

Connect an output port to a downstream input port.

Adagio only accepts type-compatible connections. If a port does not highlight as a valid target, the semantic types do not match. See [Connections and Semantic Types](/building/connections-and-types/).

## 5. Promote the run-time interface

For each required input that should come from the runner rather than another node:

1. Select the unconnected input port.
2. Click **Promote Input**.

For each parameter that should stay configurable at run time:

1. Select the node.
2. In the parameter controls, enable **Promote**.
3. Optionally assign a default later from the pipeline summary.

Anything you do not promote stays fixed in the pipeline.

## 6. Save and verify

Use the **To-do** tab to clear validation issues.

Adagio blocks pipeline download until the graph has no remaining required-input, required-parameter, or naming problems.

## 7. Run from the UI

Select a connected Runtime Server from the title bar, then click **Run** in the
toolbar. Adagio will prompt you to provide values for required inputs and
parameters that have no defaults.

The run form has three parts:

- **Params** for promoted parameters
- **Files** for paths interpreted by the selected Runtime Server
- **Environment** for the run details, task environments, concurrency, and cache reuse

Choose **Start run** after the checklist is clear. You can watch each step
complete in the run view.

Adagio Desktop is available as a Runtime Server when it is connected. To run on
a self-hosted Linux machine, follow [Runtime Server
setup](/running/runtime-servers/).

## 8. Export the pipeline

From the editor you can export:

- the pipeline itself as a `.adg` file
- an arguments JSON template for CLI runs

The arguments export captures the current parameter values and input file names. Before using it with the CLI, replace those file names with real local paths.

## 9. Run the same pipeline with the CLI

Typical flow:

```bash
adagio pipeline show my-pipeline.adg

adagio run \
  --pipeline my-pipeline.adg \
  --arguments my-arguments.json \
  --cache-dir ./adagio-cache
```

Next:

- [The Pipeline Canvas](/building/canvas/)
- [Inputs, Parameters, and Defaults](/building/inputs-parameters-and-defaults/)
- [Runtime Servers](/running/runtime-servers/)
- [Running with the CLI](/running/cli/)
