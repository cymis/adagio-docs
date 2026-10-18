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

- **The same value is used in more than one place.** One variable can feed several parameters, even when the parameters have different names, such as the trim lengths of two denoisers you are comparing. One **File path or URL** variable can feed several input ports, such as one metadata file used by ten steps. Changing the variable changes every use at once.
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

The **Variables** tab in the editor's left rail has two sections, each with its own create button:

- **Paths**: click **+ Create path variable** and choose
  - **File path or URL**: one file or URL that becomes a pipeline input
  - **Directory**: a directory that input and output paths are built from (see [Directories in paths](#directories-in-paths))
- **Parameters**: click **+ Create parameter variable** and choose `Int`, `String`, `Float`, `Bool`, `List of Int`, `List of String`, or `List of Float`.

Rename the new variable from the generated `variable_1`, then optionally enter a value and a description.

To delete a variable, click **×** on its row. Every node that used it is detached from it.

## Using a variable on a node

For a parameter:

1. Select the node.
2. Click the variable button at the right of the parameter field.
3. Choose a variable from the list. Variables whose type or value does not fit the parameter are disabled.

For an action input, select its unconnected input port and use the variable button on its **Path** field. Choose a **File path or URL** variable to make it the input, or a **Directory** variable to build the input's path from it (see [Directories in paths](#directories-in-paths)). Path variables are not offered to parameters.

The field then shows the variable's name and value. Typing a value of its own into the field detaches the node from the variable.

## Output paths

Select an output port and open its **Run** tab to set where its result is written after a successful run. The path is saved with the pipeline, so it travels in a downloaded `.adg` and in copies of the pipeline.

- A path ending in `/` is a **directory**. The output is written into it under its own name: `/data/run1/` writes `/data/run1/table.qza`, or `.qzv` for a visualization.
- A path without the trailing `/` is a **file**: `/data/run1` writes `/data/run1.qza`.

Adagio decides by the trailing `/` alone, never by whether the directory exists, because a shared pipeline runs on other machines. The line under the field shows the file that will be written, so a missing `/` is easy to spot. In Adagio Desktop, **Choose directory…** fills in a directory with its trailing `/`, and **Choose file…** picks a file.

Output names are unique within a pipeline, so outputs written to the same directory never collide. A later run into the same directory replaces files with the same names.

## Directories in paths

A **Directory** variable names one directory that many paths share, such as the directory a run's data comes from or the one its results go to. Give it a value such as `/data/run1`, then use it on any input or output path:

- Choose it with the variable button on the path field. An output then writes into the directory under its own name; an input path becomes `{name}/` followed by the file name it had.
- Or type its name in braces as part of a path: `{data}/seqs.qza` reads `seqs.qza` inside the directory, `{results}/my-table.qza` writes `my-table.qza` there, and `{results}/views/` writes into a `views` directory inside it.

A Directory variable always names a directory, with or without a trailing `/`. Its value is a directory on the Runtime Server, never a URL; an input that comes from a URL uses a **File path or URL** variable or the URL typed on the input. The line under each path field shows the complete path, or why it cannot be built. Change the variable and every path that uses it moves.

A Directory variable is a convenience of the editor. It is not exposed at run time on the CLI: a downloaded `.adg` carries the complete path for each input and output, and `--input-*`, `--output-dir` or a per-output `--output-*` flag overrides them as usual. Deleting a Directory variable keeps each path pointing where it did.

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
