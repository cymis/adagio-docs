---
title: The Pipeline Canvas
description: Understanding the pipeline building interface
---

The pipeline canvas is where you build the graph that will later be saved as a portable `.adg` pipeline file.

## Layout

The editor has three working areas:

- **Action tray (left)**: browse actions, search plugins, and filter by plugin visibility
- **Canvas (center)**: place actions, arrange the graph, and draw connections
- **Inspector (right)**: edit the selected node or port, or manage the pipeline summary when nothing specific is selected

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

Pipeline inputs are not created automatically at the start.

Instead, you usually create them by selecting an unconnected action input and using **Promote Input**. That creates a root input node and adds a named input to the pipeline signature.

Pipeline outputs come from the graph outputs that remain exposed when you save the pipeline. Name them carefully, because those names become:

- the output names in the exported pipeline
- the output directory names used by the CLI
- the labels shown in the UI

## Inspector behavior

What you see on the right depends on the current selection:

- **node selected**: edit parameters and view action help
- **port selected**: inspect the port type, rename a promoted input or output, or promote an unconnected input
- **pipeline summary selected**: rename promoted parameters, group them, and assign pipeline-level defaults

## Validation and download

The **To-do** tab tracks problems such as:

- missing required arguments
- empty promoted parameters
- duplicate input, parameter, or output names
- an empty graph

Pipeline download stays disabled until those issues are cleared.

## Saving and naming

Use the toolbar to name your pipeline and save your work. Adagio auto-saves while you work, but explicit saves create a versioned checkpoint you can return to.
