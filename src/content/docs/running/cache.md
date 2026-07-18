---
title: Cache Behavior
description: How Adagio reuses task results and manages the shared QIIME cache
---

`adagio run` requires a cache directory:

```bash
adagio run --pipeline pipeline.adg --cache-dir /path/to/cache
```

That directory is a shared QIIME cache, not a general scratch folder.

## What the cache is for

Adagio uses the cache to reuse previously completed task results when:

- the same task is invoked again
- with the same resolved inputs
- and the same resolved parameters

When that happens, Adagio can replay the cached result instead of rerunning the task.

## What gets reused

Reuse happens at the task level, not only at the whole-pipeline level.

That means:

- change one downstream parameter and upstream unchanged tasks can still be reused
- change an early input or parameter and all dependent downstream tasks will rerun

## Connected local plugins

Actions from a connected local or developer plugin always execute fresh because
the code in their Conda environment can change in place. Their presence does not
disable caching for the rest of the pipeline.

| Node                              | Cache behavior              |
| --------------------------------- | --------------------------- |
| Upstream official plugin          | May reuse a matching result |
| Connected local plugin            | Always executes fresh       |
| Downstream official plugin        | Normal cache eligibility    |
| Any node when global reuse is off | Executes fresh              |

"Normal cache eligibility" means the downstream node is not automatically
disabled. If the fresh local-plugin output changes its cache signature, the
downstream node runs again. If it produces an identical cacheable input, reuse is
allowed.

The per-node **Use cache** control can force any other node fresh. On local-plugin
nodes it is locked off with an explanation. The global cache control remains
available; turning it off still forces the entire pipeline to execute fresh.

## Reuse is enabled by default

Normal behavior:

```bash
adagio run --pipeline pipeline.adg --cache-dir ./cache
```

Disable reuse for one run:

```bash
adagio run --pipeline pipeline.adg --cache-dir ./cache --no-reuse
```

`--no-reuse` keeps the run from loading matching prior results from the selected cache.
It overrides all selective behavior and forces every task fresh.

## Choosing a cache location

Pick one stable directory and keep using it for related runs.

Examples:

- `./adagio-cache`
- `/scratch/project-a/adagio-cache`
- `/shared/qiime-cache`

This is usually better than creating a new cache path for every run, because reuse only helps when later runs can see earlier results.

## Cache vs outputs

Do not confuse these:

- **cache directory**: internal reusable task data
- **output directory**: the final artifacts copied out for the current run

Removing output files does not clear the cache. Clearing the cache does not remove previously copied final outputs.

## Clearing a cache

Use the dedicated command:

```bash
adagio cache clear --cache-dir /path/to/cache
```

This command checks that the target really looks like a QIIME cache before deleting it.

## Cache and container execution

The cache works across both Docker and Apptainer execution as long as the run points at the same cache directory.

Runtime config changes do not disable caching by themselves. What matters is whether the resolved task invocation is the same.

## When to bypass the cache

Use `--no-reuse` when you want to:

- confirm that a task still runs cleanly from scratch
- ignore prior results after changing a runtime image or environment
- benchmark a fresh execution path
