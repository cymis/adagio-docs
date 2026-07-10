---
title: Catalog Pipelines
description: Running shared Adagio catalog pipelines from the CLI
---

Catalog pipeline references let `adagio run` resolve a named pipeline without requiring you to download a `.adg` file first.

Use `@adagio/<slug>` when you want to:

- run a shared community or official pipeline from the Adagio catalog
- test a local checkout of `adagio-pipelines`

## Run from the Adagio catalog

Use `@adagio` for pipelines published in the shared `adagio-pipelines` catalog:

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

## Develop against a local catalog

While you are editing or validating a local `adagio-pipelines` checkout, run `adagio` from the same workspace. The CLI discovers nearby `adagio-pipelines` directories automatically, so the same `@adagio/<slug>` command can resolve to your local checkout before falling back to GitHub.

This is useful for:

- testing a pipeline before opening a pull request
- working offline

## Runtime images are still separate

Catalog references only resolve the pipeline definition. They do not change which Docker or Apptainer images Adagio uses for each task.

If a catalog pipeline needs custom runtime images, use `--config`:

```bash
adagio run \
  @adagio/microbial-diversity \
  --cache-dir /path/to/cache \
  --arguments run-arguments.json \
  --config runtime.toml
```

See [Runtime Configuration](/running/cli-config/) for Docker and Apptainer overrides.

## Fetching behavior

Remote catalog references fetch only the matching `pipeline.adg` file when the reference is resolved. Adagio does not clone the whole repository.

During `adagio run`, a remote catalog pipeline is downloaded under the selected `--cache-dir` and reused by source name and slug on later runs. `adagio pipeline show` uses a temporary download when it needs to fetch from GitHub because it does not take a cache directory.

If the GitHub catalog is private, set `GITHUB_TOKEN` or `GH_TOKEN` to a token that can read `cymis/adagio-pipelines`. With a token, the CLI fetches through the GitHub contents API. It does not automatically use browser sessions, git credentials, or `gh` CLI authentication.

Run output includes a `Resolved from` line with the local path or remote URL used for the pipeline definition.

## When to download the file instead

Use an explicit `.adg` file path when you need to:

- edit or fork the pipeline in the Adagio UI
- review the exact file being sent to another runner
- run in an environment with no network and no local channel path

```bash
adagio run --pipeline path/to/pipeline.adg --cache-dir /path/to/cache
```
