---
title: Adagio for AI assistants
description: Install, authorize, use, revoke, and troubleshoot the official Adagio integrations for ChatGPT, Codex, and Claude
---

The official Adagio integrations let AI assistants inspect, create, validate, and safely edit pipelines in your Adagio account. One plugin package and one hosted service serve every assistant: ChatGPT and Codex through the universal plugin model on supported OpenAI surfaces, and Claude through the Claude Code plugin. The capabilities, review rules, and privacy boundaries described on this page apply identically to all of them.

:::note[Publication status]
The ChatGPT and Codex integration is being prepared for OpenAI review and is not yet publicly installable; until the official listing is published, Adagio and Adagio Desktop link to this status page. The Claude Code integration is installable today from the Adagio repository, as described below. A claude.ai listing in the Claude connectors directory is not yet available.
:::

## Use Adagio with Claude

### Claude Code

Install the plugin from the Adagio repository — it carries the same skills and connects to the same hosted service as every other surface:

```
/plugin marketplace add cymis/adagio-app
/plugin install adagio@adagio
```

The first time the assistant uses an Adagio tool, Claude Code asks you to authenticate: your browser opens Adagio's sign-in page, you approve the requested permissions, and the session completes automatically. You can also authenticate ahead of time with `claude mcp login plugin:adagio:adagio`. Each Adagio tool then requires your per-call or standing approval in Claude Code's own permission prompts; read-only and write tools are grouped separately.

To sign out on that machine, run `claude mcp logout plugin:adagio:adagio`. Access tokens are short-lived, so signing out ends access promptly.

### claude.ai

A public claude.ai connection is not yet available: the connectors-directory listing has not been published, and adding `https://mcp.adagio.run/mcp` as a custom connector requires OAuth client credentials that Adagio does not distribute. When the directory listing is published, this page will link to it. Connecting on claude.ai will then cover Claude on the web, desktop, and mobile with one authorization.

Pipelines written through Claude display the same provenance labels and record the same operation metadata as every assistant surface, and Claude connections are recorded and revocable separately from ChatGPT and Codex connections.

## Install and connect (ChatGPT and Codex)

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

Pipelines written through the hosted integration display a provenance label such as **Created with Codex** or **Last edited through Adagio AI integration**. Adagio records the operation ID, time, integration identity (ChatGPT/Codex and Claude are recorded as distinct integrations), and writer/specification version, but not the raw prompt.

## Revoke access

For ChatGPT and Codex, open **Profile → AI assistants** in Adagio and choose **Revoke access**. Revocation is enforced by Adagio and does not depend on uninstalling the plugin. Existing tokens issued before the revocation stop working; the next use requires authorization again.

Claude connections are recorded separately and do not yet appear in **Profile → AI assistants**; that panel currently manages the ChatGPT/Codex connection only. To end Claude's access, sign out on the Claude side — `claude mcp logout plugin:adagio:adagio` in Claude Code, or disconnect the connector in claude.ai settings — which discards the stored credentials; access tokens are short-lived, so access ends promptly. For immediate server-enforced revocation of a Claude connection, contact [contact@adagio.run](mailto:contact@adagio.run). Claude connections will join the profile panel in an upcoming release.

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

### Claude authentication loops or its tools disappear

Sign out and back in: `claude mcp logout plugin:adagio:adagio`, then `claude mcp login plugin:adagio:adagio`, and start a new session. If Claude Code reports an incompatible authorization server, the plugin is pointing at a stale server entry — update the plugin and retry. On claude.ai, a missing Adagio connection is expected until the directory listing is published.

### A workspace blocks authorization

Organization administrators can restrict plugins, domains, or OAuth scopes. After the public listing is available, ask the workspace administrator to allow the official Adagio listing and `mcp.adagio.run`; do not work around policy with a personal token.

### Local developer fallback

Adagio Desktop retains **Developer: Configure Local MCP** for engineering and outage fallback. It edits only the local `adagio` MCP entry after parse-and-verify checks and creates a backup. This is distinct from the official hosted plugin and browser authorization flow.

For support, visit [Adagio contact and support](https://adagio.run/contact) or email [contact@adagio.run](mailto:contact@adagio.run). Security issues should go to [security@adagio.run](mailto:security@adagio.run).
