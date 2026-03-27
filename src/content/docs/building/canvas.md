---
title: The Pipeline Canvas
description: Understanding the pipeline building interface
---

The pipeline canvas is the main workspace in Adagio. It is where you design pipelines by placing nodes and drawing connections between them.

## Layout

The canvas interface has three main areas:

- **Node panel (left)** — browse and search available plugin actions to add to your pipeline.
- **Canvas (center)** — your working area. Nodes live here and connections are drawn between them.
- **Inspector (right)** — shows details and configuration for the currently selected node or connection.

## Navigating the canvas

| Action | How |
|--------|-----|
| Pan | Click and drag on an empty area |
| Zoom | Scroll wheel, or pinch on trackpad |
| Select a node | Click it |
| Select multiple nodes | Click and drag a selection box, or Shift+click |
| Move a node | Click and drag the node |

## Pipeline inputs and outputs

Every pipeline has a set of top-level inputs — the files and parameters a user provides when running the pipeline. These appear as special **Input** nodes on the canvas. Connect their output ports to the inputs of your first analysis nodes.

Similarly, **Output** nodes define what the pipeline produces. Connect the outputs of your last analysis nodes to them.

## Saving and naming

Use the toolbar to name your pipeline and save your work. Adagio auto-saves while you work, but explicit saves create a versioned checkpoint you can return to.
