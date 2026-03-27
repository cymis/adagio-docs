---
title: Building a Plugin
description: How to create a custom plugin action for Adagio
---

Adagio plugins are QIIME2 plugins. If you are familiar with QIIME2 plugin development, the process is the same — Adagio discovers and registers your plugin's actions through the standard QIIME2 interface.

## Prerequisites

- Python 3.10+
- A working QIIME2 development environment
- Familiarity with QIIME2 plugin development (see the [QIIME2 developer docs](https://develop.qiime2.org))

## Plugin structure

A QIIME2 plugin defines:

- **Actions** — functions that transform data, each with typed inputs, parameters, and outputs.
- **Semantic types** — the data types your actions consume and produce.
- **Formats** — how data is stored on disk.

Adagio uses this information to present your actions as nodes on the pipeline canvas, enforce type-compatible connections, and resolve the correct container image at run time.

## Creating a plugin

Follow the [QIIME2 plugin tutorial](https://develop.qiime2.org/en/latest/plugins/tutorials/create-from-scratch.html) to scaffold and implement your plugin. The key requirement for Adagio compatibility is that your plugin is a valid, installable QIIME2 plugin.

## Packaging for Adagio

Adagio runs each plugin action in its own Docker container. To integrate with the default image resolver, your plugin image should follow the naming convention:

```
ghcr.io/cymis/qiime2-plugin-<plugin-name>:<tag>
```

A Dockerfile for a plugin image typically looks like:

```dockerfile
FROM quay.io/qiime2/amplicon:2026.1
RUN pip install my-qiime2-plugin
RUN qiime dev refresh-cache
```

Build and test your image locally before submitting:

```bash
docker build . -t my-plugin:dev
```

Then test it with a local runtime config:

```toml
version = 1

[plugins]
my-plugin = { image = "my-plugin:dev" }
```

```bash
adagio run --pipeline test-pipeline.adg --cache-dir /tmp/cache --config runtime.toml
```

## Registering your plugin with Adagio

Once your plugin image is built and published, register it with your Adagio instance:

```bash
adagio build-qapi --action-url http://your-adagio-instance/api/v1
```

This reads the active QIIME2 environment (which must have your plugin installed) and submits the plugin's action metadata to Adagio. After registration, your plugin's actions appear in the node panel in Lattice.

For a dry run that writes the payload to disk without submitting:

```bash
adagio build-qapi --output qapi.json --dry-run
```

To register only specific plugins:

```bash
adagio build-qapi --action-url http://your-adagio-instance/api/v1 --plugin my-plugin
```
