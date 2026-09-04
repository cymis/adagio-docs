---
title: Adagio for AI assistants
description: Install, authorize, use, revoke, and troubleshoot Adagio integrations for ChatGPT, Codex, and Claude
---

Adagio integrations let AI assistants inspect, create, validate, and safely edit pipelines in your Adagio account. One hosted MCP service exposes the tools, and one public, client-neutral plugin package adds the same guided pipeline skills to supported Codex and Claude Code clients. Each vendor reviews and distributes its official listing separately.

:::note[Publication status]
The ChatGPT and Codex plugin is in OpenAI review and is not yet published in the official Plugins Directory. For Claude Code, Anthropic accepts third-party submissions into its reviewed community marketplace; its separate official marketplace is curated at Anthropic's discretion. Adagio has not yet been published in either. Direct Claude connections are available today and provide Adagio's tools, but not the six guided workflow skills. A public GitHub package containing those skills and independent Codex and Claude Code marketplaces is in release validation at [`cymis/adagio-plugin`](https://github.com/cymis/adagio-plugin); installation commands below become usable when its first version tag is published.
:::

## Use Adagio with Claude

### Claude Code

If you have already connected Adagio on claude.ai, the connector's tools are available in Claude Code sessions signed into the same Claude account — no further setup is needed.

To connect Claude Code directly instead, add the hosted server and authenticate. This installs the tools, not the guided skills:

```
claude mcp add --transport http adagio https://mcp.adagio.run/mcp
claude mcp login adagio
```

Your browser opens Adagio's sign-in page; approve the requested permissions and the session completes automatically. Each Adagio tool then requires your per-call or standing approval in Claude Code's own permission prompts; read-only and write tools are grouped separately.

To sign out on that machine, run `claude mcp logout adagio`. Access tokens are short-lived, so signing out ends access promptly.

To install the skills-bearing GitHub release after the `v0.1.1` tag is published, run these commands in Claude Code:

```
/plugin marketplace add cymis/adagio-plugin@v0.1.1
/plugin install adagio@adagio
/reload-plugins
```

Starting a new session also loads the plugin. This GitHub installation is published by Adagio but is not an Anthropic-reviewed listing. Remove it before installing a future reviewed community or official listing to avoid duplicate skills and tool connections.

### claude.ai

Adagio connects as a custom connector — no credentials or advanced settings are required. Who adds it depends on your Claude plan:

**Individual plans (Free, Pro, and Max):**

1. Open **Settings → Connectors → Add → Add custom connector**.
2. Name it **Adagio** and enter the server URL `https://mcp.adagio.run/mcp`. Leave the advanced OAuth fields empty.
3. Choose **Add**, then **Connect**, and sign in with your Adagio account when the browser asks. If you already have an active Adagio session, the connection may complete without a prompt.

Free plans allow one custom connector, so the slot must be available.

**Team and Enterprise plans:** custom connectors are added by an organization **Owner or Primary Owner** under the organization's connector settings, using the same name and server URL as above. Once the Owner has added it, each member connects it from their own **Settings → Connectors** and signs in with their own Adagio account — connections and permissions are always per person, never shared.

One authorization covers Claude on the web, desktop, and mobile, and the connector's tools also become available in Claude Code sessions signed into the same Claude account. Each Adagio tool is individually permission-gated in Claude's own settings, with read-only and write tools grouped separately.

Pipelines written through Claude display the same provenance labels and record the same operation metadata as every assistant surface, and Claude connections are recorded and revocable separately from ChatGPT and Codex connections.

## Install and connect (ChatGPT and Codex)

### Official listing

OpenAI review is already underway. There is no official public installation flow until OpenAI approves the submission and Adagio publishes it. The **Use Adagio with ChatGPT and Codex** links currently open this page so you can confirm availability; they do not lead to another installation page.

After the official listing is published:

1. Open the official Adagio listing from a supported ChatGPT or Codex surface. A future Adagio Desktop release may open the same listing as a convenience.
2. Install the plugin.
3. Choose **Connect** when ChatGPT or Codex requests access.
4. In the browser, review the requested Adagio permissions and approve them.
5. Start a new task so the newly installed plugin and skills are available.

Installation occurs in ChatGPT or Codex. Account authorization occurs through Adagio. Adagio cannot claim that the plugin is installed because OpenAI does not expose that state to the Adagio application.

OpenAI distributes the reviewed skills as a versioned snapshot. A change in the public GitHub repository does not change the official listing automatically; Adagio must submit and publish a new reviewed version.

### Independent Codex fallback

After the public repository publishes its first `v0.1.1` tag, Codex users can install the same Adagio-maintained bundle without waiting for the Plugins Directory:

```
codex plugin marketplace add cymis/adagio-plugin --ref v0.1.1
codex plugin add adagio@adagio
```

Restart Codex and start a new task after installation. This path is published by Adagio but is not an OpenAI-reviewed listing, and it is not available in ChatGPT. Remove it before installing the future official listing to avoid duplicate skills or tools.

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

The hosted plugin does not execute pipelines, read local files, inspect
run-output folders, control the Desktop interface, or access raw biological
artifacts. Execution remains the responsibility of the Runtime Server selected
in Adagio, either Adagio Desktop or a self-hosted Linux server.

## Review and consent

Read-only operations can run after authorization. Before a consequential pipeline change, ask the assistant to show the proposed stages or diff and confirm the change in the conversation. That review is assistant workflow guidance, not a separate server-side approval gate. Browser and assistant writers use the same optimistic-concurrency token, so a stale assistant edit fails instead of overwriting a newer browser change.

In the first release, `add_plugin_to_library` is the only tool with a server-side review gate. Community plugins contain third-party code that runs locally, so the assistant must ask every time before starting that protected consent flow. If ChatGPT or Codex cannot show the approval interaction, nothing is installed; add that exact plugin in Adagio's Library instead. The assistant must not invent an approval URL or silently weaken consent.

Pipelines written through the hosted integration display a provenance label such as **Created with Codex** or **Last edited through Adagio AI integration**. Adagio records the operation ID, time, integration identity (ChatGPT/Codex and Claude are recorded as distinct integrations), and writer/specification version, but not the raw prompt.

## Revoke access

For ChatGPT and Codex, open **Profile → AI assistants** in Adagio and choose **Revoke access**. Revocation is enforced by Adagio and does not depend on uninstalling the plugin. Existing tokens issued before the revocation stop working; the next use requires authorization again.

Claude connections appear in the same panel as their own entry and are revoked independently of ChatGPT/Codex: choose **Revoke access** on the **Claude** row. Signing out on the Claude side (`claude mcp logout adagio` in Claude Code, or disconnecting the connector in claude.ai settings) additionally discards the credentials stored by Claude, but profile revocation is the server-enforced lever and does not depend on it.

## Troubleshooting

### The plugin does not appear

Before an official listing or the tagged GitHub release is published, this is expected. After publication, confirm that your client supports plugins, that workspace policy permits Adagio and its marketplace, and that you are signed into the intended assistant account. Direct MCP tools appearing does not mean the guided skills plugin is installed. After installation, reload plugins or start a new task or session.

### Authorization loops or has expired

Revoke the existing connection under **Profile → AI assistants**, then connect again. Check that browser privacy controls allow the Adagio and Cognito authorization pages to complete their redirect. A wrong-client, wrong-audience, expired, malformed, or insufficient-scope token is rejected rather than accepted as a partial session.

### The assistant cannot find a pipeline

Pipeline names are not unique. Ask it to list matching pipelines and choose using the name, modification date, and link. Archived pipelines require an explicit request to include Trash.

### A write reports a conflict

The pipeline changed after the assistant read it. Ask the assistant to fetch the latest version, explain both changes, and propose a reconciliation. Do not ask it to overwrite blindly.

### Assistant writes are temporarily unavailable

Adagio can disable assistant creation and editing while leaving read-only tools available. A disabled write returns `assistant_writes_disabled`; retrying will not bypass it. Continue inspecting and validating pipelines, then make the proposed change in Adagio or wait until the integration administrator re-enables assistant writes.

### A run cannot start

The public plugin does not start runs. Open the pipeline in Adagio and select an
available Runtime Server. If you use Adagio Desktop, start it and sign in. If you
use a self-hosted server, confirm it is connected under **Settings → Runtime
Servers**. Pipeline structure work can continue through the hosted plugin while
no Runtime Server is available.

### Claude authentication loops or its tools disappear

Sign out and back in: `claude mcp logout adagio`, then `claude mcp login adagio`, and start a new session. If Claude Code reports an incompatible authorization server, the server entry predates the current Adagio gateway — remove and re-add it with the command above. On claude.ai, open the Adagio connector in **Settings → Connectors** and reconnect; if its tools are missing from a conversation, enable the connector for that conversation from the composer's connectors menu.

### A workspace blocks authorization

Organization administrators can restrict plugins, domains, or OAuth scopes. After the public listing is available, ask the workspace administrator to allow the official Adagio listing and `mcp.adagio.run`; do not work around policy with a personal token.

### Local developer fallback

Adagio Desktop retains **Developer: Configure Local MCP** for engineering and outage fallback. It edits only the local `adagio` MCP entry after parse-and-verify checks and creates a backup. This is distinct from the official hosted plugin and browser authorization flow.

For support, visit [Adagio contact and support](https://adagio.run/contact) or email [contact@adagio.run](mailto:contact@adagio.run). Security issues should go to [security@adagio.run](mailto:security@adagio.run).
