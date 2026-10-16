---
title: Working with Nodes
description: Adding, configuring, and connecting nodes on the canvas
---

Nodes are the working units of a pipeline. Most nodes represent one plugin action.

## Adding a node

1. In the **action tray**, browse by plugin or search by name.
2. Click the action to place it on the canvas, or drag it to a specific position.

## Node anatomy

Each node has:

- **Name**: the action label shown on the canvas
- **Input ports**: typed values the action consumes
- **Output ports**: typed values the action produces
- **Parameters**: configuration values that are fixed on the node or read from a variable

Connected local-plugin nodes also show **Refresh `<plugin>` interface**. Refresh
is available only for a private local plugin backed by a usable Conda
environment. Starting it from one node refreshes every action and node from that
plugin.

## Connecting nodes

Drag from an **output port** to an **input port** to create a connection. Adagio enforces type compatibility, so a port only accepts compatible outputs.

If you want help discovering the next valid step, select a port first. The action tray will filter to compatible actions.

## Configuring parameters

Select a node to open it in the inspector.

You will usually see three kinds of parameter behavior:

- **Required with no default**: you must set a value on the node or use a variable
- **Optional with an action default**: you can keep the plugin's default, override it with a value on the node, or use a variable
- **Metadata column parameters**: these work with a metadata input plus a selected column name

Use these rules:

- Set a value on the node when it should always be fixed in the pipeline. This is also the quickest way to iterate in the editor.
- Leave **Use default** enabled when the plugin default is the right fixed behavior.
- Use a variable, with the variable button at the right of the parameter field, when several parameters should share one value or the runner should be able to change it.

See [Inputs, Parameters, and Defaults](/building/inputs-parameters-and-defaults/) for the full model.

## Metadata-aware actions

Some actions take metadata directly. Others take a metadata file plus a separate metadata-column parameter such as `MetadataColumn[Categorical]`.

In those cases, the connection carries the metadata object and the parameter identifies which column to use.

## Removing a node

Select the node and remove it. Deleting a node also removes:

- its edges
- any pipeline inputs that existed only to feed that node

Variables the node used stay in the **Variables** tab. Delete them there if nothing else needs them.
