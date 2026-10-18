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

This prints the task order, resolved input bindings, pipeline parameters, and outputs.

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

### Using an artifact URL

QIIME artifact inputs accept HTTPS URLs as well as local file paths. Pass the
URL through the input's usual flag:

```bash
adagio run pipeline.adg --config runtime.toml --cache-dir ./cache \
  --input-seqs 'https://example.org/data/seqs.qza' --log-dir ./logs
```

Or use a URL in your arguments file:

```json
{
  "version": 1,
  "inputs": {
    "seqs": "https://example.org/data/seqs.qza"
  }
}
```

Replace `seqs` with your pipeline's input name. The same URL can be entered in
the app's input field. The consuming task downloads and validates the artifact
inside its execution environment, so that environment must have network access.
The orchestration process does not download inputs, and no `wget` installation
is required. Loading the original archive preserves its UUID and QIIME provenance.

Consumers share one download within a run. Each new run downloads again before
checking for reusable action results. To require specific content, append
`#sha256=<64 hexadecimal digits>` to the URL; a mismatch fails the input. This
also works in an arguments file. Quote URLs when passing them through a shell.

With `--log-dir`, task logs include transfer progress and `*_inputs.json` files
record the source, final URL, byte count, SHA-256, artifact type, and UUID.
Connected runs also record this information in task events. Query strings are
omitted from download logs and receipts; the original URL remains in your run
arguments.

This first version supports HTTPS links to individual artifacts, including
artifact URLs in collections or as metadata when the artifact supports that
view. Metadata inputs also accept HTTPS links to TSV files and are loaded
directly as QIIME metadata. The URL does not need a `.qza` or `.tsv` suffix.
Raw data imports, remote manifests, `.qzv` files, and login flows are not supported. Downloads are
retried from the beginning after transient failures; transfer resumption and
separately scheduled download tasks are not yet implemented.

## Variable values and environments saved with a pipeline

A `.adg` file carries the values its author set in the editor: variable values, input paths or URLs, and output destinations. They are stored in the file's `configs` list, in the same shape as an arguments file, and never in the pipeline specification itself.

The same entry also saves the environment each plugin and step runs in, and the CPUs and memory each step requests, under `execution`. These are what the app would use when you download the file: a step's own environment where one was chosen, otherwise the plugin's environment from your plugin library. `execution` has the same shape as a [runtime config file](/running/cli-config/), so a downloaded pipeline runs without one.

`adagio run` starts from those values, so a shared pipeline runs with its author's values until you change them. To see them, ask for help on the pipeline:

```bash
adagio run --pipeline path/to/pipeline.adg --show-params all --help
```

A parameter whose variable has a value shows that value as its `[default: …]`, and an input that already has a path is not listed as required.

To change values, pass flags or an arguments file. The arguments file you download from the app holds the same values as the `.adg`, so it is a convenient starting point to edit. A saved path from another machine simply fails to open at run time; override it the same way.

## Flags override the arguments file, which overrides the saved values

Values are resolved in layers, lowest first:

1. the values saved in the `.adg` file
2. the `--arguments` file
3. explicit CLI flags

That means this is valid:

```bash
adagio run \
  --pipeline path/to/pipeline.adg \
  --arguments path/to/arguments.json \
  --cache-dir /path/to/cache \
  --param-trunc-len 150
```

Environments follow the same idea: a `--config` file overrides the environments saved in the `.adg`. See [Runtime configuration](#runtime-configuration).

## Providing inputs as flags

Pipeline inputs and parameters can also be passed as flags directly on the command line:

```bash
adagio run --pipeline path/to/pipeline.adg --help
```

This is especially useful with:

- `--show-params missing` to see only values still unfilled after the saved values and any arguments file
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

Per-output flags override `--output-dir`. A per-output path ending in `/` is a directory, and the output is written into it under its own name: `--output-table /results/run-001/` writes `/results/run-001/table.qza`. Without the trailing `/` the path is the file itself. Only the trailing `/` decides, not whether the directory exists. The same rule applies to output paths in an arguments file and in a pipeline file's configuration.

## Runtime configuration

A `.adg` downloaded from the app runs each plugin in the environment saved with it. The run header lists every plugin's environment and where it came from, `pipeline file` or `--config`:

```text
Environments:
  dada2: docker ghcr.io/cymis/qiime2-plugin-dada2:2026.1 (pipeline file)
  feature_table: conda /opt/envs/feature-table (--config)
```

A saved conda environment is a path on its author's machine. On another machine, point that plugin at your own environment with `--config`.

A `--config` file overrides the saved environments: anything it sets wins over the pipeline file, even where the author chose an environment for a single step. A pipeline file from an older release saves no environments, so it needs a `--config` file that names one for every plugin.

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
