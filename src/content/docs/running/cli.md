---
title: Running with the CLI
description: Running saved pipelines from the command line using adagio
---

The `adagio` CLI lets you run pipelines locally or on a server without opening the browser. This is useful for automating runs, working on HPC infrastructure, or integrating pipelines into scripts.

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

Requirements: Python 3.10+, Docker (for the default task runner).

## Getting a pipeline file

Download the `.adg` file from the Adagio UI:

1. Open the pipeline in the canvas.
2. Open the settings menu and choose **Download**.

Or from the home screen, use the pipeline's action menu.

## Running a pipeline

```bash
adagio run --pipeline path/to/pipeline.adg --cache-dir /path/to/cache
```

The `--cache-dir` is required and stores task results between runs. On rerun, unchanged steps are skipped automatically.

## Providing inputs

Use an **arguments file** to specify inputs, parameters, and outputs:

```bash
adagio run \
  --pipeline path/to/pipeline.adg \
  --arguments path/to/arguments.json \
  --cache-dir /path/to/cache
```

You can download a pre-filled arguments file from the Adagio UI run configuration panel, or write one yourself:

```json
{
  "version": 1,
  "inputs": {
    "demux": "/data/demux.qza"
  },
  "parameters": {
    "trunc_len_f": 250,
    "trunc_len_r": 200
  },
  "outputs": "/results/my-run/"
}
```

If `outputs` is omitted, results are written to `./adagio-outputs`.

## Providing inputs as flags

Pipeline inputs and parameters can also be passed as flags directly on the command line. Run with `--help` after specifying the pipeline to see what flags are available:

```bash
adagio run --pipeline path/to/pipeline.adg --help
```

## Cache management

The cache directory stores completed task outputs and is reused across runs. To clear it:

```bash
adagio cache clear --cache-dir /path/to/cache
```

To disable cache reuse for a single run without clearing it:

```bash
adagio run --pipeline pipeline.adg --cache-dir /cache --no-reuse
```
