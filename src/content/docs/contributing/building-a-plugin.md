---
title: Plugin Development Resources
description: What Adagio expects from a QIIME 2 plugin
---

Adagio does not define a separate plugin authoring model. An Adagio plugin is a standard QIIME 2 plugin.

If you need to build or modify a plugin, use the official QIIME 2 developer documentation:

- [Developer documentation](https://develop.qiime2.org/en/stable/docs/developer-documentation.html)
- [Plugin tutorial](https://develop.qiime2.org/en/latest/plugins/tutorials/intro.html)
- [Plugin how-to guides](https://develop.qiime2.org/en/stable/plugins/how-to-guides/intro.html)

## What Adagio needs from a plugin

For a plugin to work well in Adagio, it must provide a clean QIIME 2 interface:

- clear action names
- accurate input, parameter, and output definitions
- semantic types that express connection compatibility correctly
- defaults that reflect how the action should appear in the builder
- metadata handling that works through standard QIIME 2 signatures

Adagio uses that information to:

- build the node catalog in the UI
- validate connections
- render parameter controls
- generate CLI flags for promoted parameters
- resolve runtime environments for execution

## Adagio-specific execution requirements

In addition to the plugin itself, you need a container image that can run it.

Adagio's default resolver expects Docker images named like:

```text
ghcr.io/cymis/qiime2-plugin-<plugin-name>:<tag>
```

If you are not using that default image set, you can still run the plugin by supplying a runtime config. See [Runtime Configuration](/running/cli-config/).

After installing or updating a plugin in a QIIME 2 environment, refresh the framework cache:

```bash
qiime dev refresh-cache
```

## When you need to resubmit QAPI

Resubmit your plugin metadata to Adagio when the interface changes in a way the builder or CLI must learn about.

Examples:

- plugin name changes
- action name changes
- inputs, parameters, or outputs are added, removed, or renamed
- semantic types change
- defaults change

If you only change implementation details inside the container and the interface stays the same, you usually do **not** need to resubmit QAPI. Rebuild or retag the container image instead.

## Next steps

- To make a plugin available in Adagio, read [Registering and Submitting a Plugin](/contributing/submitting-a-plugin/).
- To see the full development loop from plugin changes to local pipeline runs, read [Developer Workflow](/contributing/developer-workflow/).
