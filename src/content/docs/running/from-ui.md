---
title: Running from the UI
description: Submitting and monitoring pipeline runs in the browser
---

Use the UI when you want Adagio to manage uploads, compute-account selection, and run monitoring.

## Starting a run

From the home screen, click **Run** next to a saved pipeline. You can also run directly from the canvas by clicking **Run** in the toolbar.

The run flow has two steps.

## Step 1: Run arguments

The first step shows:

- **Required inputs**: files or data that must be provided before the run can start
- **Open parameters**: any parameters that were left configurable when the pipeline was built

Defaults on promoted parameters are prefilled. Promoted parameters with no default are required.

## Providing inputs

For each required input, upload the file the pipeline expects.

Common cases include:

- QIIME 2 artifacts such as `.qza`
- metadata tables such as `.tsv` or `.csv`

The semantic type of the input tells you what shape of data is expected.

## Exporting an arguments JSON template

From the run arguments step you can export a JSON template for CLI use.

Important: this export records the current input file names, not absolute local paths or Adagio upload tokens. Replace those file names with real local paths before running the pipeline with `adagio run`.

## Step 2: Run configuration

The second step captures the UI-specific execution settings:

- analysis name
- analysis description
- CPU
- RAM
- disk
- account

These settings are for the Adagio-managed run. They are not part of the exported `.adg` pipeline file.

## Submitting the run

After both steps are complete, submit the run. Adagio uploads the selected files, creates the analysis record, and starts execution against the selected account.

## Monitoring progress

The run view shows each pipeline step with a status indicator:

| Status | Meaning |
|--------|---------|
| Pending | Waiting to start |
| Running | Currently executing |
| Complete | Finished successfully |
| Failed | Encountered an error |

Click any step to see its log output. If a step fails, the log will include the error message to help diagnose the problem.

## Results

When the run completes, results are available in the run view. You can download individual artifacts from there.

## Reruns and caching

If you rerun a pipeline with the same inputs but different parameters, only the steps affected by the change re-execute. Upstream steps whose inputs have not changed are replayed from cache automatically.

To force a full rerun from scratch, choose **Rerun (no cache)** from the run menu.

## Downloading for CLI use

For CLI execution, export:

- the pipeline `.adg` file from the editor
- an arguments JSON template from the run arguments step

Then use [Running with the CLI](/running/cli/) and [Runtime Configuration](/running/cli-config/) to run the same workflow locally.
