---
title: Developer Workflow
description: The recommended loop for plugin owners building pipelines in Adagio
---

This is the recommended workflow when you own a plugin interface and want to use it in Adagio without waiting for a public release.

## 1. Build or change the plugin in its own repository

Adagio plugin development is standard QIIME 2 plugin development. Use the official QIIME 2 docs for the plugin code itself.

## 2. Install the plugin into the QIIME 2 environment you will use with Adagio

```bash
pip install -e /path/to/your-plugin
qiime dev refresh-cache
```

This environment is what `adagio qapi build` will inspect.

## 3. Connect the editable plugin in Adagio Desktop

Open **Plugin management** in Adagio Desktop, choose **Connect plugin**, and select
the Conda environment that contains the editable plugin. Adagio inspects the
environment, builds its QAPI metadata locally, and creates a private plugin entry.

The connected plugin remembers that Conda environment. Nodes from the plugin use
it by default when you run from the editor.

The CLI submission flow remains useful when you are not using the desktop app:

Create a QAPI submission token in the Adagio UI, then submit:

```bash
export ACTION_URL="https://adagio.run/api/v1"
export QAPI_SUBMISSION_TOKEN="paste-token-here"

adagio qapi build --plugin my-plugin --dry-run
adagio qapi build --plugin my-plugin
```

This gives you a private plugin entry in Adagio so you can use the plugin in the builder.

## 4. Build the pipeline in the Adagio UI

Now you can:

- add your plugin actions to the canvas
- connect them
- promote the inputs and parameters you want exposed at run time

## 5. Iterate on implementation code

Connected local-plugin actions always execute fresh. If you change library or
implementation code without changing the registered action interface, run the
node or pipeline again. You do not need to refresh its interface first.

Other nodes retain normal cache behavior. In an
official → local → official pipeline, the unchanged upstream official action can
be reused, the local action executes fresh, and the downstream official action
uses the normal cache-signature rules.

## 6. Refresh interface changes

When you add or remove an action, or change inputs, parameters, outputs, types,
or defaults:

1. Run `qiime dev refresh-cache` in the connected Conda environment.
2. In the editor, use **Refresh `<plugin>` interface** on any node from that
   plugin. You can also refresh it from **Plugin management**.
3. Review any compatibility warning shown after the editor reloads.

Refresh is plugin-wide even when you start it from one node: Adagio rebuilds
metadata for every action in that plugin, and every node from that plugin shows
the same loading state. Pending pipeline edits are saved before refresh.

If an action was removed or its ports changed, Adagio preserves the existing
nodes and connections and reports what needs attention. It does not silently
delete or rewire the pipeline.

Refresh is unavailable while an analysis is running. If the save or refresh
fails, the current editor remains open with an error.

## 7. Download and run locally

Export:

- the pipeline `.adg`
- an arguments JSON template

Then run locally with the CLI and a runtime config that points at your development image if needed:

```bash
adagio run \
  --pipeline my-pipeline.adg \
  --arguments my-arguments.json \
  --config runtime.toml \
  --cache-dir ./adagio-cache
```

## 8. Submit public artifacts when ready

When the workflow is ready for broader use:

- request community or official plugin visibility if appropriate
- submit the pipeline to `adagio-pipelines`

See:

- [Registering and Submitting a Plugin](/contributing/submitting-a-plugin/)
- [Submitting a Pipeline](/contributing/submitting-a-pipeline/)
