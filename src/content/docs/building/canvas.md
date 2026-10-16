---
title: The Pipeline Canvas
description: Understanding the pipeline building interface
---

The pipeline canvas is where you build the graph that will later be saved as a portable `.adg` pipeline file.

## Layout

The editor has three working areas:

- **Sidebar (left)**: a rail of tabs that switch the sidebar's contents. Collapse the sidebar to give the canvas more room.
- **Canvas (center)**: place actions, arrange the graph, and draw connections
- **Inspector (right)**: appears when a node or port is selected. Its **Parameters** tab edits the selection; other tabs, such as **Run Settings**, hold run options for it.

The sidebar tabs are:

| Tab | Use it to |
|-----|-----------|
| **Actions** | browse and search plugin and built-in actions to add to the canvas (the action tray) |
| **Run** | run the pipeline on the selected Runtime Server and follow its progress |
| **Variables** | create the variables that nodes read and that a runner can set at run time |
| **To Do** | see the problems that block download and runs |
| **Pipeline** | edit the pipeline description and see its inputs, outputs, and actions at a glance |

**Actions** and **Run** appear only on pipelines you own.

## Navigating the canvas

| Action | How |
|--------|-----|
| Pan | Click and drag on an empty area |
| Zoom | Scroll wheel, or pinch on trackpad |
| Select a node | Click it |
| Select multiple nodes | Click and drag a selection box, or Shift+click |
| Move a node | Click and drag the node |

## Action tray behavior

The action tray always shows:

- built-in actions
- plugin actions visible to you
- a search field
- plugin status filters for `official`, `community`, and `private` plugins

When you select a port on the canvas, the action tray becomes port-scoped and shows only compatible actions for that input or output. This is the fastest way to continue a pipeline without guessing which steps will connect.

## Built-in actions

Two built-ins are especially important:

- **Inputs** help create top-level pipeline inputs.
- **Ignore outputs** lets you drop outputs you do not want to keep as final pipeline outputs.

## Pipeline inputs and outputs

An action input that is not connected to another node is a pipeline input. Select its port to name it and type a file path or URL into its **Path** field. To share one path across several inputs, or to set it at run time, use a **Path or URL** variable. See [Inputs, Parameters, and Defaults](/building/inputs-parameters-and-defaults/).

Pipeline outputs come from the graph outputs that remain exposed when you save the pipeline. Name them carefully, because those names become:

- the output names in the exported pipeline
- the output directory names used by the CLI
- the labels shown in the UI

## Inspector behavior

What you see on the right depends on the current selection:

- **node selected**: edit parameters and view action help
- **port selected**: inspect the port type, rename a pipeline input or output, and set or choose a variable for an unconnected input's path

## Validation and download

The **To Do** tab tracks problems such as:

- missing required arguments
- duplicate input, parameter, or output names
- an empty graph

Pipeline download stays disabled until those issues are cleared.

## Saving and naming

Use the toolbar to name your pipeline and save your work. Adagio auto-saves while you work, but explicit saves create a versioned checkpoint you can return to.
