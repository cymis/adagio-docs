---
title: Connections and Semantic Types
description: Why some connections work and others do not
---

Adagio decides whether two ports can connect by comparing their semantic types.

This is the core rule behind the builder: if the upstream output is not type-compatible with the downstream input, Adagio blocks the edge.

## What a semantic type looks like

Examples:

- `SampleData[SequencesWithQuality]`
- `FeatureTable[Frequency]`
- `FeatureData[Sequence]`
- `MetadataColumn[Categorical]`

These types describe what a value means, not just which file extension it uses.

## How Adagio checks compatibility

At a high level, a connection is valid when the output is the same type, or a compatible specialization of the type that the input expects.

Adagio also understands:

- **union types**, where an input can accept one of several types
- **predicates**, such as categorical vs numeric metadata columns
- **metadata compatibility**, for metadata-like inputs

Adagio does not perform arbitrary conversion between unrelated types.

## Simple examples

| Upstream output | Downstream input | Result |
|---|---|---|
| `FeatureTable[Frequency]` | `FeatureTable[Frequency]` | valid |
| `FeatureTable[Frequency]` | `FeatureData[Sequence]` | invalid |
| `MetadataColumn[Categorical]` | `MetadataColumn[Categorical]` | valid |
| `MetadataColumn[Categorical]` | `MetadataColumn[Numeric]` | invalid |

## Why a connection is rejected

Common reasons:

- the base semantic types are different
- the downstream input requires a predicate the upstream value does not satisfy
- the output is a collection, but the input expects a single artifact
- the input expects metadata or a metadata column, but the output is not metadata-compatible

## Metadata and metadata columns

Metadata-like values deserve special attention:

- a metadata input carries the metadata object itself
- a metadata-column parameter selects one column from that metadata

That is why some actions appear to need both a metadata connection and a separate column choice.

## Parameter predicates still matter

Type checking is not only for edges. Adagio also validates parameter values against the action's declared type metadata.

Examples:

- numeric parameters can have ranges
- string parameters can have enumerated choices
- list parameters require at least one valid value

## Fast troubleshooting

If a connection does not work:

1. Select the source or destination port.
2. Read the type shown in the inspector.
3. Compare the two type strings.
4. Use the port-scoped action tray to find compatible next steps.

If no action appears for a selected input port, there is currently no visible plugin action that can produce that input type.

## Practical guidance

- Keep a mental model of artifact families such as `FeatureTable`, `FeatureData`, `SampleData`, and `Phylogeny`.
- Promote an input when the data should come from the runner instead of another node.
- Do not expect Adagio to insert hidden conversion steps. If a conversion is needed, add the explicit action that performs it.
