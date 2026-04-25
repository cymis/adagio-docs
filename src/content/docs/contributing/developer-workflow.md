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

## 3. Build or update the execution image

Create the Docker image or `.sif` image that should actually run the plugin action.

Use the default GHCR naming convention if you want it to work with Adagio's built-in image resolver. Otherwise plan to supply a runtime config during local execution.

## 4. Register the plugin in Adagio

Create a QAPI submission token in the Adagio UI, then submit:

```bash
export ACTION_URL="https://adagio.run/api/v1"
export QAPI_SUBMISSION_TOKEN="paste-token-here"

adagio qapi build --plugin my-plugin --dry-run
adagio qapi build --plugin my-plugin
```

This gives you a private plugin entry in Adagio so you can use the plugin in the builder.

## 5. Build the pipeline in the Adagio UI

Now you can:

- add your plugin actions to the canvas
- connect them
- promote the inputs and parameters you want exposed at run time

## 6. Download and run locally

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

## 7. Iterate

You only need to resubmit QAPI when the interface changes.

Examples of interface changes:

- plugin or action name changed
- input, parameter, or output names changed
- semantic types changed
- defaults changed

If you changed implementation only, you usually just need to:

- rebuild or retag the image
- update the runtime config if the image reference changed
- rerun the pipeline locally

## 8. Submit public artifacts when ready

When the workflow is ready for broader use:

- request community or official plugin visibility if appropriate
- submit the pipeline to `adagio-pipelines`

See:

- [Registering and Submitting a Plugin](/contributing/submitting-a-plugin/)
- [Submitting a Pipeline](/contributing/submitting-a-pipeline/)
