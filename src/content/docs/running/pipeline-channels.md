---
title: Pipeline Channels
description: Running shared and personal pipeline catalogs from the CLI
---

Pipeline channels let `adagio run` resolve a named pipeline without requiring you to download a `.adg` file first.

Use channels when you want to:

- run a shared community or official pipeline from the Adagio catalog
- keep a lab or project pipeline catalog in GitHub
- test a local checkout of `adagio-pipelines`
- pin a workflow reference for repeatable command-line runs

## Run from the Adagio catalog

Use the built-in `@adagio` channel for pipelines published in the shared `adagio-pipelines` catalog:

```bash
adagio pipeline show @adagio/microbial-diversity
```

```bash
adagio run \
  @adagio/microbial-diversity \
  --cache-dir /path/to/cache \
  --arguments microbial-diversity-arguments.json
```

The value after the slash is the pipeline slug. In the catalog repository, that slug corresponds to a directory such as:

```text
pipelines/community/microbial-diversity/
```

or:

```text
pipelines/official/microbial-diversity/
```

The CLI first checks for a nearby local `adagio-pipelines` checkout. If it does not find one, it fetches the matching `pipeline.adg` from the public GitHub catalog. Within a catalog, `official` is checked before `community`.

## Use a personal or lab channel

Create `~/.config/adagio/pipeline-sources.toml`:

```toml
[channels.my-personal-channel]
github = "my-github-user/adagio-pipelines"
ref = "main"
```

Then run:

```bash
adagio pipeline show @my-personal-channel/microbial-diversity
```

```bash
adagio run \
  @my-personal-channel/microbial-diversity \
  --cache-dir /path/to/cache \
  --arguments run-arguments.json
```

Use this when your team maintains its own catalog repository with the same layout as `adagio-pipelines`.

## Pin a channel for reproducibility

For repeatable runs, set `ref` to a tag or commit SHA instead of a moving branch:

```toml
[channels.lab-release]
github = "my-lab/adagio-pipelines"
ref = "v2026.1"
```

```bash
adagio run \
  @lab-release/microbial-diversity \
  --cache-dir /path/to/cache \
  --arguments run-arguments.json
```

This keeps the command stable even if the `main` branch of the catalog changes later.

## Develop against a local catalog

Use a local path while you are editing or validating a catalog checkout:

```toml
[channels.local-lab]
path = "/path/to/adagio-pipelines"
```

```bash
adagio pipeline show @local-lab/microbial-diversity
```

This is useful for:

- testing a pipeline before opening a pull request
- running private workflows without publishing them
- working offline

You can also configure both `path` and `github`:

```toml
[channels.lab]
path = "/path/to/adagio-pipelines"
github = "my-lab/adagio-pipelines"
ref = "main"
```

When both are present, Adagio checks the local catalog first and falls back to GitHub.

## Use a custom config path

Set `ADAGIO_PIPELINE_SOURCES` when you want a project-specific channel config:

```toml
[channels.project]
github = "my-org/project-pipelines"
ref = "main"
```

```bash
export ADAGIO_PIPELINE_SOURCES=/path/to/project/pipeline-sources.toml
adagio run @project/microbial-diversity --cache-dir /path/to/cache
```

This is useful in shared scripts, CI jobs, or training materials where you do not want to rely on each user's home-directory config.

## Runtime images are still separate

Pipeline channels only resolve the pipeline definition. They do not change which Docker or Apptainer images Adagio uses for each task.

If a channel pipeline needs custom runtime images, use `--config`:

```bash
adagio run \
  @my-personal-channel/microbial-diversity \
  --cache-dir /path/to/cache \
  --arguments run-arguments.json \
  --config runtime.toml
```

See [Runtime Configuration](/running/cli-config/) for Docker and Apptainer overrides.

## Fetching behavior

Remote channels fetch only the matching `pipeline.adg` file when the reference is resolved. Adagio does not clone the whole repository and does not persistently cache remote pipeline definitions.

For small pipeline files, this keeps runs simple and avoids stale local copies. Use a pinned `ref` when the exact remote version matters.

Run output includes a `Resolved from` line with the local path or remote URL used for the pipeline definition.

## When to download the file instead

Use an explicit `.adg` file path when you need to:

- edit or fork the pipeline in the Adagio UI
- review the exact file being sent to another runner
- run in an environment with no network and no local channel path

```bash
adagio run --pipeline path/to/pipeline.adg --cache-dir /path/to/cache
```
