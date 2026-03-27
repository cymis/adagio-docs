---
title: Working with Nodes
description: Adding, configuring, and connecting nodes on the canvas
---

Nodes are the building blocks of a pipeline. Each node represents a single plugin action — a transformation that takes inputs and produces outputs.

## Adding a node

1. In the **node panel**, browse by category or use the search box to find an action.
2. Click the action to place it on the canvas, or drag it to a specific position.

## Node anatomy

Each node has:

- **Name** — the action name displayed at the top of the node.
- **Input ports** (left side) — data the node consumes. Required inputs are marked.
- **Output ports** (right side) — data the node produces, available to downstream nodes.
- **Parameters** — configuration values (e.g., trimming lengths, quality thresholds). Click a node to edit its parameters in the inspector panel.

## Connecting nodes

Drag from an **output port** to an **input port** to create a connection. Adagio enforces type compatibility — a port will only accept connections from outputs of a matching type.

To remove a connection, click it and press Delete, or right-click and choose **Remove connection**.

## Configuring parameters

Select a node to open it in the inspector panel on the right. Parameters with defaults are pre-filled. Required parameters with no default must be set either here (to bake a fixed value into the pipeline) or left open so the user can provide them at run time.

**Tip:** Leave parameters open when you want them to be configurable per-run. Set them on the node when the value should always be the same.

## Removing a node

Right-click a node and choose **Remove**, or select it and press Delete. Removing a node also removes all connections to and from it.
