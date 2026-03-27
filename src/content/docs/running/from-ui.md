---
title: Running from the UI
description: Submitting and monitoring pipeline runs in the browser
---

Pipelines can be run directly from the Adagio web interface without any additional setup.

## Starting a run

From the home screen, click **Run** next to a saved pipeline. You can also run directly from the canvas by clicking **Run** in the toolbar.

Adagio will open the run configuration panel, which shows:

- **Required inputs** — files or data that must be provided before the run can start.
- **Open parameters** — any parameters that were left configurable when the pipeline was built.
- **Output location** — where results will be written.

Fill in the required values and click **Submit**.

## Providing inputs

For each required input, you will be prompted to upload a file or select one you have previously uploaded. Adagio accepts QIIME2 artifact files (`.qza`) and metadata files (`.tsv`, `.csv`) depending on what the pipeline expects.

## Monitoring progress

After submitting, the run view shows each pipeline step with a status indicator:

| Status | Meaning |
|--------|---------|
| Pending | Waiting to start |
| Running | Currently executing |
| Complete | Finished successfully |
| Failed | Encountered an error |

Click any step to see its log output. If a step fails, the log will include the error message to help diagnose the problem.

## Results

When the run completes, results are available in the run view. You can download individual output files or the full output set.

## Reruns and caching

If you rerun a pipeline with the same inputs but different parameters, only the steps affected by the change re-execute. Upstream steps whose inputs have not changed are replayed from cache automatically.

To force a full rerun from scratch, choose **Rerun (no cache)** from the run menu.

## Downloading for CLI use

From the run configuration panel you can download an **arguments file** — a JSON file that captures the inputs and parameters you specified. This file can be passed directly to the `adagio` CLI to reproduce the same run outside the browser. See [Running with the CLI](/running/cli/).
