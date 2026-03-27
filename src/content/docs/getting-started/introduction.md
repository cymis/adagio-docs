---
title: Introduction
description: What Adagio is and who it's for
---

Adagio is a platform for building and running bioinformatics data processing pipelines. It is designed for researchers and analysts who want to run complex analyses without writing code.

## What you can do with Adagio

- **Build pipelines visually** — connect analysis steps together on an interactive canvas in your browser. Each step is a plugin action that transforms data: importing sequences, denoising reads, classifying taxa, and so on.
- **Run pipelines from the browser** — submit a pipeline run, provide your input files, and monitor progress in real time.
- **Run pipelines from the command line** — save a pipeline and run it locally or on a server using the `adagio` CLI. Useful for automating runs or working on HPC infrastructure.
- **Share pipelines** — publish your pipelines to the community catalog so others can use and build on them.

## Core concepts

### Plugins

A plugin provides one or more analysis actions. Each action takes defined inputs and parameters, and produces defined outputs. Adagio comes with a library of QIIME2-based plugins covering common bioinformatics tasks.

### Pipelines

A pipeline is a graph of connected plugin actions. Data flows from one action to the next through connections you draw on the canvas. Pipelines are saved as `.adg` files that can be shared, versioned, and reused.

### Runs

A run is an execution of a pipeline with a specific set of input files and parameter values. Each task in the pipeline runs in its own isolated environment, and results are cached so unchanged steps can be skipped when you rerun.

## Who this documentation is for

These docs cover two groups of users:

1. **Pipeline users** — researchers building pipelines in the UI and running them from the browser or CLI. Start with [Quick Start](/getting-started/quick-start/).
2. **Plugin and pipeline developers** — developers building custom plugin actions and contributing pipelines to the community. See the [Contributing](/contributing/building-a-plugin/) section.
