---
title: Adagio for ChatGPT and Codex
description: Install, authorize, use, revoke, and troubleshoot the Adagio plugin
---

The Adagio plugin lets ChatGPT and Codex inspect, create, validate, and safely edit pipelines in your Adagio account. It uses the universal plugin model shared by supported OpenAI surfaces.

:::note[Publication status]
The reviewed OpenAI directory listing is still pending. Codex users can install the same Adagio plugin as a version-pinned GitHub beta from the public [`cymis/adagio-plugin`](https://github.com/cymis/adagio-plugin) repository. The GitHub beta has not been reviewed or endorsed by OpenAI and requires an explicit marketplace installation.
:::

## Install and connect

### Install the GitHub beta in Codex

You need an Adagio account and a current Codex installation with plugin marketplace support.

1. In a terminal, add the version-pinned Adagio marketplace:

   ```bash
   codex plugin marketplace add cymis/adagio-plugin --ref v0.1.0
   ```

2. Install the plugin from that marketplace:

   ```bash
   codex plugin add adagio@adagio
   ```

3. Restart Codex and begin a new task so the installed skills and tools are loaded.
4. Ask a read-only question such as “Show my Adagio pipelines.”
5. When prompted, connect your Adagio account, review the requested permissions, and approve access.

The pinned Git tag prevents the installed marketplace source from changing underneath an existing installation. Only install from the `cymis` organization link and commands shown on this page.

The GitHub beta is intended for Codex. It does not provide the discovery or supported-surface coverage of the reviewed listing, and an organization administrator may block custom marketplaces or connector access.

### After the official listing is published

1. Open the official Adagio listing from a supported ChatGPT or Codex surface. A future Adagio Desktop release may open the same listing as a convenience.
2. Install the plugin.
3. Choose **Connect** when ChatGPT or Codex requests access.
4. In the browser, review the requested Adagio permissions and approve them.
5. Start a new task so the newly installed plugin and skills are available.

Installation occurs in ChatGPT or Codex. Account authorization occurs through Adagio. Adagio cannot claim that the plugin is installed because OpenAI does not expose that state to the Adagio application.

If you installed the GitHub beta, remove it before installing the reviewed listing to prevent duplicate Adagio skills or tools:

```bash
codex plugin remove adagio@adagio
codex plugin marketplace remove adagio
```

Removing the GitHub beta does not revoke the existing Adagio authorization. Revoke separately under **Profile → AI assistants** when you no longer want the integration to have access.

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

## Update or uninstall the GitHub beta

Pinned GitHub marketplace releases do not move automatically. To install a newer released tag, remove the installed beta and marketplace, then add the new version and reinstall:

```bash
codex plugin remove adagio@adagio
codex plugin marketplace remove adagio
codex plugin marketplace add cymis/adagio-plugin --ref vX.Y.Z
codex plugin add adagio@adagio
```

Start a new task after reinstalling. To uninstall without replacing it, run only the first two commands. Revoke the Adagio connection separately if access should also end.

## Troubleshooting

### The plugin does not appear

For the GitHub beta, run `codex plugin list` and confirm that `adagio@adagio` is installed and enabled. Confirm that the marketplace was added from `cymis/adagio-plugin`, your Codex version supports plugin marketplaces, and workspace policy permits custom marketplaces and the Adagio connector. Restart Codex and begin a new task after installation.

For the reviewed listing, confirm that your ChatGPT or Codex surface supports universal plugins, workspace policy permits Adagio, and you are signed into the intended OpenAI account.

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

Organization administrators can restrict plugins, marketplace sources, domains, or OAuth scopes. For the GitHub beta, ask the administrator to allow the `cymis/adagio-plugin` marketplace and `mcp.adagio.run`. After the reviewed listing is available, ask them to allow the reviewed Adagio listing and `mcp.adagio.run`. Do not work around organization policy with a personal token.

### Local developer fallback

Adagio Desktop retains **Developer: Configure Local MCP** for engineering and outage fallback. It edits only the local `adagio` MCP entry after parse-and-verify checks and creates a backup. This is distinct from the official hosted plugin and browser authorization flow.

For support, visit [Adagio contact and support](https://adagio.run/contact) or email [contact@adagio.run](mailto:contact@adagio.run). Security issues should go to [security@adagio.run](mailto:security@adagio.run).
