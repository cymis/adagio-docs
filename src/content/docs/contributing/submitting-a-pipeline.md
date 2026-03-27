---
title: Submitting a Pipeline
description: How to contribute a pipeline to the community catalog
---

Pipelines you build in Adagio can be shared with the community through the [adagio-pipelines](https://github.com/cymis/adagio-pipelines) catalog. Community pipelines are discoverable in the **Explore** section of the Lattice UI.

## Pipeline tiers

| Tier | Path | Description |
|------|------|-------------|
| **Community** | `pipelines/community/<slug>/` | Contributed pipelines, open to all |
| **Official** | `pipelines/official/<slug>/` | Stable, maintainer-supported pipelines |

New submissions go into `pipelines/community/`. Promotion to `pipelines/official/` is a separate process after a pipeline has proven stable.

## What to include

Each pipeline submission is a directory containing:

- **`pipeline.adg`** — the pipeline file. Download this from the Adagio UI (pipeline settings → Download).
- **`metadata.toml`** — catalog metadata describing the pipeline.
- **`README.md`** — optional for community, required for official pipelines.

## metadata.toml format

```toml
name = "My Pipeline"
description = "A short description of what this pipeline does."
version = "1.0.0"
authors = ["Your Name <you@example.com>"]
tags = ["amplicon", "dada2", "taxonomy"]
qiime2_version = "2026.1"
```

## Submitting

1. Fork the [adagio-pipelines](https://github.com/cymis/adagio-pipelines) repository.
2. Create a directory under `pipelines/community/<your-slug>/`.
3. Add `pipeline.adg` and `metadata.toml` (and optionally `README.md`).
4. Open a pull request.

GitHub Actions will automatically validate your submission. The validator checks:

- Required files are present
- `metadata.toml` is complete and consistent
- The pipeline file is a valid Adagio pipeline shape

Fix any validation errors reported in the PR checks before requesting review.

## Tips for a good submission

- Give your pipeline a clear, descriptive name and description.
- Use specific tags so users can find it when browsing.
- Include a `README.md` explaining what the pipeline does, what inputs it expects, and what outputs it produces.
- Test the pipeline end-to-end with real data before submitting.
