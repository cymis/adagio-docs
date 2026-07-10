---
title: Running with the CLI
description: Running saved pipelines from the command line using adagio
---

The `adagio` CLI runs exported Adagio pipeline files locally or in other controlled environments.

Use it when you want:

- reproducible local execution
- scripting and automation
- cluster or HPC execution through Docker or Apptainer
- direct control over runtime images and cache location

## Installation

```bash
pip install adagio-cli
# or with uv
uv pip install adagio-cli
```

Verify:

```bash
adagio --version
adagio --help
```

Requirements:

- Python 3.10+
- Docker for the default execution path
- or Apptainer/Singularity when you configure `.sif` images

## Getting a pipeline file

Download the `.adg` file from the Adagio UI:

1. Open the pipeline in the canvas.
2. Download the pipeline.

You can also run shared catalog pipelines by reference, for example `@adagio/microbial-diversity`. See [Catalog Pipelines](/running/pipeline-channels/).

## Inspecting a pipeline

Before running, inspect the pipeline interface:

```bash
adagio pipeline show path/to/pipeline.adg
```

This prints the task order, resolved input bindings, promoted parameters, and outputs.

To see the dynamic CLI flags for that pipeline:

```bash
adagio run --pipeline path/to/pipeline.adg --cache-dir ./cache --help
```

If you also want per-output flags, ask for all parameters:

```bash
adagio run --pipeline path/to/pipeline.adg --cache-dir ./cache --show-params all --help
```

## Running a pipeline

```bash
adagio run \
  --pipeline path/to/pipeline.adg \
  --cache-dir /path/to/cache
```

The required pieces are:

- `--pipeline`: the exported `.adg` file
- `--cache-dir`: the shared QIIME cache directory

By default, outputs go to `./adagio-outputs`.

The pipeline can also be a channel reference:

```bash
adagio run \
  @adagio/microbial-diversity \
  --cache-dir /path/to/cache
```

Use this when you want to run a community or official catalog pipeline without downloading the `.adg` file first.

## Providing inputs

Use an **arguments file** to specify inputs, parameters, and outputs:

```bash
adagio run \
  --pipeline path/to/pipeline.adg \
  --arguments path/to/arguments.json \
  --cache-dir /path/to/cache
```

You can export a template from the UI or write one yourself:

```json
{
  "version": 1,
  "inputs": {
    "seqs": "/data/seqs.qza",
    "barcodes": "/data/metadata.tsv"
  },
  "parameters": {
    "trim_left": 0,
    "trunc_len": 120
  },
  "outputs": "/results/my-run"
}
```

`outputs` can be:

- a single directory path, which Adagio expands into one path per output name
- or an object with explicit paths per output name

If `outputs` is omitted, Adagio writes to `./adagio-outputs`.

## CLI flags override the arguments file

Values from `--arguments` are loaded first. Any explicit CLI flag overrides the file value.

That means this is valid:

```bash
adagio run \
  --pipeline path/to/pipeline.adg \
  --arguments path/to/arguments.json \
  --cache-dir /path/to/cache \
  --param-trunc-len 150
```

## Providing inputs as flags

Pipeline inputs and parameters can also be passed as flags directly on the command line:

```bash
adagio run --pipeline path/to/pipeline.adg --help
```

This is especially useful with:

- `--show-params missing` to see only unfilled values after loading an arguments file
- `--show-params all` to expose all outputs as `--output-*` flags

## Output control

Two output styles are available:

```bash
adagio run \
  --pipeline path/to/pipeline.adg \
  --cache-dir /path/to/cache \
  --output-dir /results/run-001
```

or, with `--show-params all`:

```bash
adagio run \
  --pipeline path/to/pipeline.adg \
  --cache-dir /path/to/cache \
  --show-params all \
  --output-table /results/table.qza
```

Per-output flags override `--output-dir`.

## Runtime configuration

By default, Adagio resolves each plugin action to a published Docker image using the plugin name.

Use `--config` when you need to:

- pin a plugin to a specific image tag
- use a locally built or private image
- run some actions with Apptainer
- force Docker to run `linux/amd64` images on Apple Silicon
- override one task without changing the rest of the pipeline

See [Runtime Configuration](/running/cli-config/).

On Apple Silicon, Docker may report that an image has no `linux/arm64/v8` manifest. In that case, run the plugin containers as `linux/amd64` with a runtime config:

```toml
version = 1

[defaults]
kind = "docker"
platform = "linux/amd64"
```

Then pass that config when running:

```bash
adagio run \
  --pipeline path/to/pipeline.adg \
  --cache-dir /path/to/cache \
  --config runtime.toml
```

You can also pre-pull or check a task image with the same platform:

```bash
docker pull --platform linux/amd64 ghcr.io/cymis/qiime2-plugin-feature-table:2026.1
```

If the pipeline itself comes from the catalog, keep pipeline resolution and runtime images separate:

```bash
adagio run \
  @adagio/microbial-diversity \
  --cache-dir /path/to/cache \
  --config runtime.toml
```

See [Catalog Pipelines](/running/pipeline-channels/) for `@adagio/<slug>` resolution.

## Cache management

The cache directory stores reusable task results. To remove a cache safely:

```bash
adagio cache clear --cache-dir /path/to/cache
```

To disable reuse for a single run without deleting the cache:

```bash
adagio run --pipeline pipeline.adg --cache-dir /cache --no-reuse
```

See [Cache Behavior](/running/cache/) for details.

## About `adagio runtime`

`adagio runtime` is the lower-level entrypoint used by the Adagio runtime adapter. Most users should use `adagio run`.
