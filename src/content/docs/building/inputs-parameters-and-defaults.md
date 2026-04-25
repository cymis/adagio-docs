---
title: Inputs, Parameters, and Defaults
description: How promotion and defaults shape the pipeline interface
---

When you build a pipeline in Adagio, you decide which values are fixed in the graph and which values stay configurable at run time.

That decision happens through promotion and defaults.

## Promoting an input

If an action input is not fed by another node, you can promote it to a pipeline input.

Promoting an input does three things:

1. creates a root input node on the canvas
2. adds the input to the pipeline signature
3. makes the value appear in the UI run form and the CLI interface

Use this when the runner should supply a file or metadata table each time the pipeline runs.

## Promoting a parameter

If you enable **Promote** on a node parameter, that parameter stops being a fixed node value and becomes part of the pipeline signature.

Promoted parameters:

- appear in the UI run form
- appear in the CLI as `--param-*` flags
- can be stored in an arguments JSON file
- can be given a pipeline-level default

Use promotion for settings that should stay adjustable across runs.

## Fixed value vs action default vs pipeline default

These are different:

- **Fixed value on the node**: always stored in the pipeline
- **Action default**: the plugin's own default value
- **Pipeline default**: a default you assign to a promoted parameter

Think of them this way:

- If you type a literal value into the node and do not promote it, the pipeline is fixed to that value.
- If you leave **Use default** enabled on an optional node parameter, the pipeline uses the plugin's default and does not expose that setting at run time.
- If you promote a parameter and then assign a default in the pipeline summary, the parameter becomes optional at run time but still overrideable.

## What makes a parameter required at run time

A promoted parameter is required when it has no default.

That affects both the UI and CLI:

- the UI asks the user to fill it in
- `adagio run --help` lists it as required

## Grouping promoted parameters

Adagio lets you organize promoted parameters in the pipeline summary.

In practice, that means you can:

- rename a promoted parameter to something clearer for runners
- assign a pipeline-level default
- reuse one promoted parameter across multiple node parameters when that makes sense for the workflow

## Metadata columns

Metadata column parameters are a special case.

An action may require:

- a metadata input connection
- plus a promoted or fixed metadata-column name

That is normal. The metadata connection provides the table, and the parameter chooses which column to use.

## Good defaults

Good candidates for fixed values:

- values that almost never change for this workflow
- internal tuning choices you do not want every runner to touch

Good candidates for promoted parameters:

- thresholds you expect to vary by dataset
- trim and truncation settings
- choices a runner should see explicitly at run time

Good candidates for pipeline defaults:

- values that are usually right, but still worth exposing

## Avoiding confusion

In Adagio, "promote" can refer to two different ideas:

- promoting an input or parameter while designing a pipeline
- promoting a community plugin or pipeline to official status in the shared catalogs

This page is about the first meaning: shaping the run-time interface of a pipeline.
