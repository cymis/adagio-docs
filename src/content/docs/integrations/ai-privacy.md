---
title: AI Integration Privacy and Data Boundaries
description: What Adagio shares with AI assistants (ChatGPT, Codex, and Claude), what it excludes, and how records are retained
---

The hosted Adagio plugin is deliberately limited to pipeline structure, catalog metadata, validation results, and information the user explicitly requests through its narrow tools.

## Information that may be returned

- pipeline names, descriptions, graph structure, layout, and version metadata
- installed action and plugin metadata, semantic types, parameters, and compatibility results
- validation findings and unresolved pipeline decisions
- non-sensitive assistant provenance and canonical Adagio links

This information is sent to the assistant product the user chose — a ChatGPT/Codex surface or Claude — under that product's account and workspace controls. Review [Adagio's Privacy Policy](https://adagio.run/privacy) and the privacy terms for the assistant product and workspace you use.

## Information excluded by default

The public plugin does not expose access or refresh tokens, internal service credentials, unnecessary personal identifiers, debug payloads, local filesystem paths, local run-output directories, unrestricted artifact access, or raw biological data. It cannot read files from Adagio Desktop. User-controlled pipeline and catalog text is treated as data, not trusted instructions.

Do not use this integration with protected health information, regulated clinical data, or identifiable human genomic data unless a separate written agreement and product/security review explicitly permits it.

## Operational records

The hosted gateway logs a random correlation ID, tool name, status, duration, and error class. It does not log authorization headers, tokens, prompts, pipeline documents, pipeline names, biological data, or local paths. MCP access logs are retained for 30 days for security and reliability, then deleted.

Adagio stores an OAuth connection record containing the integration identity, granted scopes, connection and last-used times, revocation time, and last token issue time. Active records are retained while the connection exists; revoked records are retained for up to 90 days for security investigation and then removed, subject to the normal backup lifecycle. Assistant pipeline provenance remains with the pipeline so users can understand its history.

Raw prompts are not stored by Adagio's MCP integration. Conversation retention is controlled by the assistant product and workspace you use.

## Control and deletion

Revoke any assistant connection under **Adagio → Profile → AI assistants**; each integration is listed and revoked independently. You can request access, correction, or deletion through [privacy@adagio.run](mailto:privacy@adagio.run). Removing the plugin in the assistant product alone is not a substitute for revoking the Adagio connection.
