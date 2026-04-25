---
title: Introduction
description: What Adagio is and how its main pieces fit together
---

Adagio is a platform for building and running bioinformatics pipelines with the same workflow definition in the browser and on the command line.

You build pipelines visually in the Adagio app, export them as `.adg` files, and run those files with `adagio` locally or in other execution environments.

## What Adagio manages

- **Pipeline design** in the browser
- **Type-aware connections** between plugin actions
- **Run-time inputs and parameters** through promoted pipeline fields
- **Portable execution** through the `adagio` CLI
- **Reusable task results** through a shared QIIME cache
- **Catalogs** for plugins and shareable pipelines

## Core concepts

### Plugin actions

A plugin provides one or more actions. Each action has:

- typed inputs
- typed parameters
- typed outputs
- optional defaults

Adagio reads that interface metadata from a QIIME 2 environment and uses it to build the node library in the UI.

### Semantic types

Connections are controlled by semantic types such as `FeatureTable[Frequency]` or `SampleData[SequencesWithQuality]`.

Adagio allows a connection only when the upstream output type is compatible with the downstream input type. That is why some ports highlight as valid targets and others do not. See [Connections and Semantic Types](/building/connections-and-types/).

### Pipeline signature

A pipeline is more than a graph of nodes. It also has a public interface:

- **inputs** that the runner must supply
- **parameters** that stay configurable at run time
- **outputs** that are saved from the graph

In Adagio, that interface is created by promoting inputs and parameters while building. See [Inputs, Parameters, and Defaults](/building/inputs-parameters-and-defaults/).

### Defaults

There are two kinds of defaults that matter:

- an **action default** defined by the plugin itself
- a **pipeline default** defined when you promote a parameter and assign a default value

If a parameter is fixed on a node, it is baked into the pipeline and does not appear as a run-time setting.

### Runs

A run is one execution of a pipeline with a specific set of input files, parameter values, and runtime settings.

Adagio supports two main execution modes:

- **from the UI**, where Adagio manages uploads and a compute account
- **from the CLI**, where you provide local paths, a cache directory, and optional runtime overrides

### Runtime configuration

By default, the CLI resolves each plugin action to a Docker image in GHCR. You can override that per plugin or per task, and you can switch individual actions to Apptainer with local `.sif` images. See [Runtime Configuration](/running/cli-config/).

### Cache

The CLI uses an explicit shared QIIME cache directory. When reuse is enabled, unchanged tasks can be replayed from cache instead of rerun. See [Cache Behavior](/running/cache/).

### Catalog visibility

Adagio tracks plugin visibility and pipeline catalog state separately.

- **Plugins** can be `private`, `community`, or `official`.
- **Pipelines** are usually contributed to the `community` catalog first and may later be promoted to `official`.

## Who this documentation is for

These docs are organized around three common roles:

1. **Pipeline builders**: start with [Quick Start](/getting-started/quick-start/), then the pages under [Building Pipelines](/building/canvas/).
2. **Pipeline runners**: read the pages under [Running Pipelines](/running/from-ui/).
3. **Plugin and pipeline contributors**: read the pages under [Contributing](/contributing/building-a-plugin/).
