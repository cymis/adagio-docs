---
title: Runtime Configuration
description: Customizing task environments for Docker and Apptainer execution
---

By default, the CLI resolves each plugin action to a Docker image derived from the plugin name:

```text
ghcr.io/cymis/qiime2-plugin-<plugin-name>:2026.1
```

A runtime config file lets you override that resolution without editing the pipeline itself.

Use a runtime config when you need to:

- run a plugin from your own Docker image
- pin one plugin to a different tag
- use Apptainer or Singularity on HPC
- override one task in an otherwise standard pipeline

## Using a config file

Pass a TOML config file with `--config`:

```bash
adagio run \
  --pipeline pipeline.adg \
  --cache-dir /cache \
  --config runtime.toml
```

## Config file format

```toml
version = 1

[defaults]
platform = "linux/amd64"

[plugins]
dada2 = { image = "ghcr.io/cymis/qiime2-plugin-dada2:2026.1" }
demux = { image = "ghcr.io/cymis/qiime2-plugin-demux:2026.1" }

[tasks]
"dada2.denoise_single" = { image = "registry.internal/custom-dada2:1.0" }
```

Settings are resolved in this order, from highest to lowest priority:

1. `[tasks]` - overrides for a specific task
2. `[plugins]` - overrides for all tasks from a plugin
3. `[defaults]` - fallback for anything not explicitly set
4. built-in defaults

## Choosing keys

Use:

- plugin names in `[plugins]`
- `plugin.action` names in `[tasks]`

`plugin.action` is usually the most stable task key for exported pipelines.

## Common scenarios

### Pin a plugin to a specific image version

```toml
version = 1

[plugins]
dada2 = { image = "ghcr.io/cymis/qiime2-plugin-dada2:2025.4" }
```

### Use a user-built Docker image for a plugin that is not in the default image set

```toml
version = 1

[plugins]
my_plugin = { image = "registry.example.org/qiime2-plugin-my-plugin:dev" }
```

This is the main way to run a saved pipeline with a container you wrote yourself.

Important:

- the pipeline file still refers to the plugin by plugin name
- the runtime config tells Adagio which container to launch for that plugin
- this works even if the image is not part of Adagio's default GHCR set

If you also want to build pipelines with that plugin in the Adagio UI, you must register the plugin with Adagio through QAPI submission. See [Registering and Submitting a Plugin](/contributing/submitting-a-plugin/).

### Use a locally built image for one task only

```toml
version = 1

[tasks]
"dada2.denoise_single" = { image = "localhost/my-dada2-dev:latest" }
```

### Force a specific Docker platform

Useful on Apple Silicon when the published plugin image only has a `linux/amd64` manifest:

```toml
version = 1

[defaults]
kind = "docker"
platform = "linux/amd64"
```

Pass that file with `--config` when running the pipeline:

```bash
adagio run \
  --pipeline pipeline.adg \
  --cache-dir /cache \
  --config runtime.toml
```

You can check or pre-pull a plugin image with the same platform:

```bash
docker pull --platform linux/amd64 ghcr.io/cymis/qiime2-plugin-feature-table:2026.1
```

### Use Apptainer instead of Docker

For HPC environments where Docker is not available, Adagio can run tasks with Apptainer or Singularity using local `.sif` files:

```toml
version = 1

[plugins]
dada2 = { kind = "apptainer", image = "/shared/images/qiime2-plugin-dada2.sif" }
demux = { kind = "apptainer", image = "/shared/images/qiime2-plugin-demux.sif" }
```

Rules:

- `kind` can be `docker` or `apptainer`
- for `apptainer`, `image` must be a local `.sif` path
- Adagio prefers the `apptainer` executable and falls back to `singularity`

### Mix Docker and Apptainer

```toml
version = 1

[defaults]
kind = "docker"

[plugins]
dada2 = { image = "ghcr.io/cymis/qiime2-plugin-dada2:2026.1" }
my_plugin = { kind = "apptainer", image = "/shared/images/my-plugin.sif" }
```

## What runtime config does not do

Runtime config affects execution only. It does not:

- add a plugin to the Adagio UI
- change plugin visibility
- change the saved pipeline file
- publish anything to the shared catalogs

## Full config reference

| Key | Applies to | Values | Description |
|-----|-----------|--------|-------------|
| `kind` | defaults, plugins, tasks | `docker`, `apptainer` | task runner to use |
| `image` | defaults, plugins, tasks | image ref or `.sif` path | container image to use |
| `platform` | defaults, plugins, tasks | e.g. `linux/amd64` | Docker platform override |
