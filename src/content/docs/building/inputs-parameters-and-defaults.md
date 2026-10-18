---
title: Inputs, Parameters, and Defaults
description: How variables and defaults shape the pipeline interface
---

When you build a pipeline in Adagio, you decide which values are fixed in the graph and which values a runner can set when the pipeline runs.

That decision is made with **variables**. Variables replace the older **Promote** controls, which are deprecated.

## Set values on the node first

While you are building and iterating, set values directly on each node:

- type a parameter value into the node's parameter controls
- for an action input that is not connected to another node, select the input port and type a file path or URL into its **Path** field

You do not need a variable to try a pipeline in the editor.

## What a variable is for

A variable is a named value that nodes read instead of holding their own. Use one when either of these is true:

- **The same value is used in more than one place.** One variable can feed several parameters, even when the parameters have different names, such as the trim lengths of two denoisers you are comparing. One **Path or URL** variable can feed several input ports, such as one metadata file used by ten steps. Changing the variable changes every use at once.
- **The value should be set at run time** in a finished or shared pipeline.

If neither applies, leave the value on the node.

## What a runner can change

When a pipeline is run from the UI or the CLI, only parameters that read a variable are exposed. Every other parameter is fixed as configured on its node. As the pipeline author, you choose what a runner can change by choosing which parameters read a variable.

A variable's value is a run-time default:

- **Variable with a value**: the runner can keep it or override it in the run form or on the CLI.
- **Variable without a value**: the runner must provide one. The pipeline can still be downloaded, but a UI run stays blocked until it has a value, and `adagio run --help` lists it as required.

Variables that nothing uses are kept in the editor but do not add CLI arguments.

Action inputs that are not connected to another node are pipeline inputs: a runner supplies their files on the **Files** tab of the run form or with `--input-*` flags.

## Creating a variable

1. Open the **Variables** tab in the editor's left rail.
2. Click **+ Create Variable** and choose its type:
   - `Int`, `String`, `Float`, or `Bool`
   - `List of Int`, `List of String`, or `List of Float`
   - `Path or URL`
   - `Folder`, for output paths (see [Output paths](#output-paths))
3. Rename it from the generated `variable_1`, then optionally enter a value and a description.

The tab lists **Path or URL** variables under **Inputs**, **Folder** variables under **Outputs**, and every other type under **Parameters**. Path or URL variables have their own category only to make the editor easier to use; they behave like any other variable.

To delete a variable, click **×** on its row. Every node that used it is detached from it.

## Using a variable on a node

For a parameter:

1. Select the node.
2. Click the variable button at the right of the parameter field.
3. Choose a variable from the list. Variables whose type or value does not fit the parameter are disabled.

For an action input, select its unconnected input port and use the variable button on its **Path** field to choose a **Path or URL** variable.

The field then shows the variable's name and value. Typing a value of its own into the field detaches the node from the variable.

## Output paths

Select an output port and open its **Run** tab to set where its result is written after a successful run. The path is saved with the pipeline, so it travels in a downloaded `.adg` and in copies of the pipeline.

- A path ending in `/` is a **folder**. The output is written into it under its own name: `/data/run1/` writes `/data/run1/table.qza`, or `.qzv` for a visualization.
- A path without the trailing `/` is a **file**: `/data/run1` writes `/data/run1.qza`.

Adagio decides by the trailing `/` alone, never by whether the folder exists, because a shared pipeline runs on other machines. The line under the field shows the file that will be written, so a missing `/` is easy to spot. In Adagio Desktop, **Choose folder…** fills in a folder with its trailing `/`, and **Choose file…** picks a file.

Output names are unique within a pipeline, so outputs written to the same folder never collide. A later run into the same folder replaces files with the same names.

### One folder for many outputs

To send several outputs to one place, create a **Folder** variable, give it a value such as `/data/run1`, and choose it with the variable button on each output's path field. A Folder variable always names a folder, with or without a trailing `/`. Change the variable and every output that uses it moves.

You can also type the variable's name in braces as part of a path: `{results}/my-table.qza` writes `my-table.qza` inside the folder, and `{results}/views/` writes into a `views` folder inside it.

A Folder variable is a convenience of the editor. It is not exposed at run time on the CLI: a downloaded `.adg` carries the complete file path for each output, and `--output-dir` or a per-output `--output-*` flag overrides them as usual. Deleting a Folder variable keeps each output writing where it did.

## Fixed value vs action default vs variable value

These are different:

- **Fixed value on the node**: always stored in the pipeline and not exposed at run time
- **Action default**: the plugin's own default, used when **Use default** is enabled on an optional parameter, and also not exposed at run time
- **Variable value**: a default for a parameter the runner can change

## Metadata columns

Metadata column parameters are a special case.

An action may require:

- a metadata input connection
- plus a metadata-column name, set on the node or read from a `String` variable

That is normal. The metadata connection provides the table, and the parameter chooses which column to use.

## Choosing what to expose

Good candidates for fixed values on the node:

- values that almost never change for this workflow
- internal tuning choices you do not want every runner to touch

Good candidates for variables:

- one value that several steps must agree on
- thresholds you expect to vary by dataset
- trim and truncation settings
- choices a runner should see explicitly at run time

Give a variable a value when that value is usually right but still worth exposing.
