---
title: Adagio for ChatGPT and Codex
description: Install, authorize, use, revoke, and troubleshoot the official Adagio plugin
---

The official Adagio plugin lets ChatGPT and Codex inspect, create, validate, and safely edit pipelines in your Adagio account. It uses the universal plugin model shared by supported OpenAI surfaces.

:::note[Publication status]
The hosted integration is being prepared for OpenAI review and is not yet publicly installable. Until the official listing is published, Adagio and Adagio Desktop link to this status page; there is no listing link to follow from here. This page must be deployed before a plugin package or Desktop release that depends on it.
:::

## Install and connect

### Before the public listing is available

There is no public installation flow yet. The **Use Adagio with ChatGPT and Codex** links currently open this page so you can confirm availability; they do not lead to another installation page.

### After the official listing is published

1. Open the official Adagio listing from a supported ChatGPT or Codex surface. A future Adagio Desktop release may open the same listing as a convenience.
2. Install the plugin.
3. Choose **Connect** when ChatGPT or Codex requests access.
4. In the browser, review the requested Adagio permissions and approve them.
5. Start a new task so the newly installed plugin and skills are available.

Installation occurs in ChatGPT or Codex. Account authorization occurs through Adagio. Adagio cannot claim that the plugin is installed because OpenAI does not expose that state to the Adagio application.

Adagio Desktop is optional for the hosted integration. Install and sign in to Desktop only when you want to run pipelines on your computer; the web-hosted inspection and editing flow works without it.

Try one of these prompts:

- “Explain the pipeline I most recently edited in Adagio.”
- “Show me my Adagio pipelines.”
- “Validate this pipeline and tell me what still needs user input.”
- “Find an installed action compatible with this output.”

Pipeline tool results include a canonical **Open in Adagio** HTTPS link. Plugin catalog results do not currently include an Adagio page URL.

## What the first release can do

- list and inspect your pipelines
- search the action catalog and fetch exact action specifications
- check semantic-type compatibility
- validate pipelines
- create pipelines and make reviewed, conflict-aware edits when assistant writes are enabled
- add a community plugin to your library only through the existing explicit consent flow

The hosted plugin does not execute pipelines, read local files, inspect local run-output folders, control the Desktop interface, or access raw biological artifacts. Adagio Desktop remains responsible for local execution.

## Review and consent

Read-only operations can run after authorization. Before a consequential pipeline change, ask the assistant to show the proposed stages or diff and confirm the change in the conversation. That review is assistant workflow guidance, not a separate server-side approval gate. Browser and assistant writers use the same optimistic-concurrency token, so a stale assistant edit fails instead of overwriting a newer browser change.

In the first release, `add_plugin_to_library` is the only tool with a server-side review gate. Community plugins contain third-party code that runs locally, so the assistant must ask every time before starting that protected consent flow. If ChatGPT or Codex cannot show the approval interaction, nothing is installed; add that exact plugin in Adagio's Library instead. The assistant must not invent an approval URL or silently weaken consent.

Pipelines written through the hosted integration display **Created with Codex** or **Last edited through Adagio AI integration**. Adagio records the operation ID, time, integration identity, and writer/specification version, but not the raw prompt.

## Revoke access

Open **Profile → AI assistants** in Adagio and choose **Revoke access**. Revocation is enforced by Adagio and does not depend on uninstalling the plugin. Existing tokens issued before the revocation stop working; the next use requires authorization again.

## Troubleshooting

### The plugin does not appear

Before publication, this is expected because no public listing or installation flow exists. After publication, confirm that your ChatGPT or Codex surface supports universal plugins, that workspace policy permits the Adagio plugin, and that you are signed into the intended OpenAI account. After installation, start a new task.

### Authorization loops or has expired

Revoke the existing connection under **Profile → AI assistants**, then connect again. Check that browser privacy controls allow the Adagio and Cognito authorization pages to complete their redirect. A wrong-client, wrong-audience, expired, malformed, or insufficient-scope token is rejected rather than accepted as a partial session.

### The assistant cannot find a pipeline

Pipeline names are not unique. Ask it to list matching pipelines and choose using the name, modification date, and link. Archived pipelines require an explicit request to include Trash.

### A write reports a conflict

The pipeline changed after the assistant read it. Ask the assistant to fetch the latest version, explain both changes, and propose a reconciliation. Do not ask it to overwrite blindly.

### Assistant writes are temporarily unavailable

Adagio can disable assistant creation and editing while leaving read-only tools available. A disabled write returns `assistant_writes_disabled`; retrying will not bypass it. Continue inspecting and validating pipelines, then make the proposed change in Adagio or wait until the integration administrator re-enables assistant writes.

### A local run cannot start

The public plugin does not start runs. Open the pipeline in Adagio Desktop and confirm the local agent status is connected. If Desktop is offline, start it and sign in before running. Pipeline structure work can continue through the hosted plugin while Desktop is offline.

### A workspace blocks authorization

Organization administrators can restrict plugins, domains, or OAuth scopes. After the public listing is available, ask the workspace administrator to allow the official Adagio listing and `mcp.adagio.run`; do not work around policy with a personal token.

### Local developer fallback

Adagio Desktop retains **Developer: Configure Local MCP** for engineering and outage fallback. It edits only the local `adagio` MCP entry after parse-and-verify checks and creates a backup. This is distinct from the official hosted plugin and browser authorization flow.

For support, visit [Adagio contact and support](https://adagio.run/contact) or email [contact@adagio.run](mailto:contact@adagio.run). Security issues should go to [security@adagio.run](mailto:security@adagio.run).
