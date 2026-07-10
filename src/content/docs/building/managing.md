---
title: Managing Pipelines
description: Saving, organizing, and sharing your pipelines
---

## Saving a pipeline

Click **Save** in the toolbar to save your current pipeline. Saved pipelines appear in the **My Pipelines** section of the home screen.

An exported pipeline file contains:

- pipeline metadata such as name and description
- the portable pipeline `spec`
- the visual `layout`
- an export timestamp

The CLI reads the pipeline `spec` from that file.

## Opening an existing pipeline

From the home screen, click any pipeline in **My Pipelines** to open it on the canvas. From there you can edit, run, or download it.

## Duplicating a pipeline

Use duplication when you want a new working copy without changing the original.

## Running a saved pipeline

From the home screen, click **Run** next to any pipeline, or open the pipeline on the canvas and click **Run** in the toolbar. See [Running from the UI](/running/from-ui/) for details.

## Downloading a pipeline

To get the `.adg` file for use with the CLI, download it from the editor.

Adagio blocks pipeline download until validation issues are cleared. In practice, that means:

- every required input must be satisfied or promoted
- every required parameter must be fixed or promoted
- promoted input, parameter, and output names must be unique

See [Running with the CLI](/running/cli/) for next steps after download.

## Exporting an arguments template

The run form can also export an arguments JSON file. This is useful as a starting point for CLI runs, but it is a template, not a fully portable execution record:

- promoted parameter values are exported directly
- input files are exported by current file name, not by an absolute local path

Before using that file with `adagio run`, replace the input values with real local paths.

## Community pipelines

Pipelines published by the community are available in the **Explore** section. You can open any community pipeline, run it directly, or fork it to your own workspace to customize it.

From the CLI, shared catalog pipelines can also be run by reference, such as `@adagio/microbial-diversity`. See [Catalog Pipelines](/running/pipeline-channels/).

To publish your own pipeline to the community, see [Submitting a Pipeline](/contributing/submitting-a-pipeline/).

## Archiving and organization

Archived pipelines are hidden from the default pipeline lists but can be restored later.

Use archiving for old working copies or superseded drafts. Use duplication when you want a new branch of work without changing the original pipeline.
