---
title: Submitting a Pipeline
description: How to contribute a pipeline to the community catalog
---

Pipelines you build in Adagio can be shared through the `adagio-pipelines` catalog repository.

New external submissions start in the community catalog. Promotion to official is a separate maintainer decision.

After a pipeline is merged into the shared catalog, CLI users can run it by slug:

```bash
adagio run @adagio/<slug> --cache-dir /path/to/cache
```

See [Catalog Pipelines](/running/pipeline-channels/) for how `@adagio/<slug>` is resolved by the CLI.

## Catalog states

| State | Path | Meaning |
|------|------|---------|
| `community` | `pipelines/community/<slug>/` | public contributed workflow |
| `official` | `pipelines/official/<slug>/` | maintainer-endorsed workflow |

## What to include

Each pipeline submission is a directory containing:

- `pipeline.adg`
- `metadata.toml`
- optional `README.md` for community pipelines
- required `README.md` for official pipelines

Use the repository template as your starting point:

```bash
cp -R templates/pipeline pipelines/community/<slug>
```

## `metadata.toml`

The catalog metadata is intentionally small. Today it must include:

```toml
maintainers = ["@github-handle"]
tags = ["amplicon", "dada2"]
```

The validator currently requires:

- `maintainers`
- `tags`
- a lowercase slug directory name using letters, numbers, and hyphens

## `README.md`

Even when it is optional, include a README whenever the workflow has assumptions that are not obvious from the graph alone.

Recommended sections:

- summary
- inputs
- outputs
- notes
- runtime requirements, if any

## Local validation

Before opening a PR:

```bash
cd adagio-pipelines
uv sync
uv run python scripts/validate_repo.py
```

## Submission flow

1. Fork the [adagio-pipelines](https://github.com/cymis/adagio-pipelines) repository.
2. Create a directory under `pipelines/community/<your-slug>/`.
3. Add `pipeline.adg`, `metadata.toml`, and a `README.md` when appropriate.
4. Open a pull request.

GitHub Actions will automatically validate your submission. The validator checks:

- required files are present
- `metadata.toml` is complete and correctly typed
- the pipeline file is a valid Adagio pipeline shape

Fix any validation errors reported in the PR checks before requesting review.

## Runtime requirements and custom images

Do not put runtime image overrides into `metadata.toml`.

If your pipeline depends on:

- a custom Docker image
- an Apptainer image
- a plugin that is not in the default image set

document that in `README.md` and include a sample runtime config for `adagio run`.

Example:

```bash
adagio run \
  @adagio/<slug> \
  --cache-dir /path/to/cache \
  --arguments run-arguments.json \
  --config runtime.toml
```

## Community vs official submissions

External contributors should not open first-time submissions directly under `pipelines/official/`.

If you think a workflow should become official:

1. submit it as a community pipeline first
2. make the README and maintenance expectations strong enough for broader use
3. ask maintainers about promotion in the PR or in a follow-up issue

Promotion to official is done by maintainers by moving the directory into `pipelines/official/`.

## Tips for a good submission

- Give your pipeline a clear, descriptive purpose.
- Use specific tags so users can find it when browsing.
- Include a `README.md` explaining what the pipeline does, what inputs it expects, what outputs it produces, and any runtime assumptions.
- Test the pipeline end-to-end with real data before submitting.
- Avoid publishing a community pipeline that only you can run because it depends on a private plugin with no instructions.
