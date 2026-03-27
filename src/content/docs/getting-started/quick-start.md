---
title: Quick Start
description: Build and run your first pipeline
---

This guide walks you through building a simple pipeline in Adagio and running it.

## 1. Open Adagio

Navigate to your Adagio instance in the browser and log in.

## 2. Create a new pipeline

From the home screen, click **New Pipeline**. This opens the pipeline canvas — an empty workspace where you'll connect analysis steps.

## 3. Add nodes

Nodes represent individual analysis actions. To add one:

1. Open the node panel on the left sidebar.
2. Browse or search for the action you want (e.g., "Import", "Denoise", "Classify").
3. Click or drag the action onto the canvas.

Each node shows its input ports on the left and output ports on the right.

## 4. Connect nodes

To connect two nodes, click an output port on one node and drag to an input port on another. A connection is valid when the data types are compatible — Adagio will highlight which ports can accept the connection.

Repeat until your pipeline is complete.

## 5. Run the pipeline

Click **Run** in the toolbar. Adagio will prompt you to provide values for any required inputs and parameters that have no defaults. Once submitted, you can watch each step complete in the run view.

Results are written to the output directory you specify. Completed steps are cached — if you adjust parameters and rerun, only the affected steps re-execute.

## 6. Save the pipeline

Click **Save** to store the pipeline. Saved pipelines can be:

- Reopened and edited in the canvas
- Run again with different inputs
- Downloaded as a `.adg` file and run from the [CLI](/running/cli/)
- [Submitted to the community catalog](/contributing/submitting-a-pipeline/)
