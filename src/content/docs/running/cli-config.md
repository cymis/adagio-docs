---
title: CLI Configuration
description: Customizing how the CLI resolves and runs tasks
---

By default, the CLI resolves each pipeline task to a published Docker image based on the plugin name. A runtime config file lets you override this — useful when working with custom images, specific versions, or HPC environments that use Apptainer instead of Docker.

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

1. `[tasks]` — overrides for a specific task
2. `[plugins]` — overrides for all tasks from a plugin
3. `[defaults]` — fallback for anything not explicitly set
4. Built-in defaults (published GHCR images)

## Common scenarios

### Pin a plugin to a specific image version

```toml
version = 1

[plugins]
dada2 = { image = "ghcr.io/cymis/qiime2-plugin-dada2:2025.4" }
```

### Use a locally built image for one task

```toml
version = 1

[tasks]
"dada2.denoise_paired" = { image = "localhost/my-dada2-dev:latest" }
```

### Force a specific platform

Useful on Apple Silicon when tasks must run as `linux/amd64`:

```toml
version = 1

[defaults]
platform = "linux/amd64"
```

### Use Apptainer instead of Docker

For HPC environments where Docker is not available, Adagio can run tasks with Apptainer (or Singularity) using local `.sif` image files:

```toml
version = 1

[defaults]
kind = "docker"

[plugins]
dada2 = { kind = "apptainer", image = "/shared/images/qiime2-plugin-dada2.sif" }
bowtie2 = { kind = "apptainer", image = "/shared/images/qiime2-plugin-bowtie2.sif" }
```

`kind` can be `docker` (default) or `apptainer`. When using `apptainer`, `image` must be a local path to a `.sif` file. Adagio prefers the `apptainer` executable and falls back to `singularity`.

### Mix Docker and Apptainer

```toml
version = 1

[defaults]
kind = "docker"

[plugins]
# most plugins run in Docker
dada2 = { image = "ghcr.io/cymis/qiime2-plugin-dada2:2026.1" }

# one plugin uses a local Apptainer image
bowtie2 = { kind = "apptainer", image = "/shared/images/q2-bowtie2.sif" }
```

## Full config reference

| Key | Applies to | Values | Description |
|-----|-----------|--------|-------------|
| `kind` | defaults, plugins, tasks | `docker`, `apptainer` | Task runner to use |
| `image` | defaults, plugins, tasks | image ref or `.sif` path | Container image to use |
| `platform` | defaults, plugins, tasks | e.g. `linux/amd64` | Docker platform override |
