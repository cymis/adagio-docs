---
title: Registering and Submitting a Plugin
description: How to make a plugin available in Adagio and request public visibility
---

There are two separate steps in the Adagio plugin workflow:

1. **register it with an Adagio environment** so Adagio can see the plugin actions
2. **request public visibility** if you want other users to see it as a community or official plugin

Registering always creates a **private** plugin entry. There are three ways to register:

- **Adagio Desktop**: choose **Connect plugin** in Plugin management. See the [Developer Workflow](/contributing/developer-workflow/).
- **An AI assistant** connected to Adagio: it registers the plugin through your assistant connection, with no submission token.
- **The command line**: `adagio qapi build` submits with a scoped QAPI submission token.

## Before you submit

Prepare:

1. a QIIME 2 environment with your plugin installed
2. a container image that can run the plugin
3. for command-line submission only, a scoped QAPI submission token from Adagio

### 1. Install the plugin in the QIIME 2 environment you will inspect

Install or update your plugin in the active environment, then refresh the QIIME cache:

```bash
pip install -e /path/to/your-plugin
qiime dev refresh-cache
```

`adagio qapi build` reads the currently active QIIME 2 environment, so make sure you are in the environment you intend to submit from.

### 2. Prepare a runnable image

If you want the default Adagio image resolver to pick up your plugin automatically, the image naming convention is:

```text
ghcr.io/cymis/qiime2-plugin-<plugin-name>:<tag>
```

If you are not publishing into that default image set, users can still run the plugin with a runtime config that points to your own Docker or Apptainer image. See [Runtime Configuration](/running/cli-config/).

### 3. Create a QAPI submission token in Adagio (command line only)

Skip this step if you register through an AI assistant or Adagio Desktop. In the Adagio app:

1. sign in
2. open **Profile**
3. create a **QAPI Submission Token**
4. copy it immediately, because it is shown only once

Token notes:

- tokens are short-lived bearer tokens
- they can be created for 1 to 168 hours
- they are meant for CLI submission only
- you can revoke them later from the same Profile page

## Register through an AI assistant

An assistant connected through the [Adagio AI integration](/integrations/adagio-ai/) can register the plugin for you. The entry is created under your own account by your assistant connection, so you do not create or paste a submission token.

1. In the environment where the plugin is installed, write the plugin's interface to a file. `--no-submit` keeps the CLI from contacting Adagio, so no Action URL or token is needed:

   ```bash
   adagio qapi build --plugin my-plugin --no-submit --output qapi.json
   ```

   To have the entry remember where the plugin runs, add `--default-conda-prefix /absolute/path/to/env` or `--default-docker-image <image>`.

2. Ask the assistant to register the plugin from `qapi.json`. It passes the file's contents to Adagio's `register_plugin` tool unchanged.

An assistant that can run commands on your machine, such as Claude Code or Codex, can do step 1 itself. One that cannot needs you to provide the file.

What to expect:

- You can ask for a dry run first. It checks the file and reports what would be created or replaced without writing anything.
- An existing private entry of the same name and QIIME version is never replaced unless the assistant asks for replacement explicitly. It should ask you before doing so, because pipelines built on the old interface may stop validating.
- The entry belongs to the QIIME version of the environment you built it in. If that is not Adagio's default version, tell the assistant which version to work in when you ask it to find the plugin's actions or build a pipeline with them; otherwise it looks in the default version and does not see them.
- The assistant connection needs plugin write permission, which you approve when you connect it. Registration is unavailable while assistant writes are disabled.
- The whole file is sent in one request. A plugin with a very large interface can exceed the size limit; use the command line or Adagio Desktop for it.
- The assistant cannot publish the plugin, remove it, or create submission tokens.

The file describes the plugin's interface only. It must come from `adagio qapi build`; an interface written by hand, or by an assistant from memory, produces pipelines that cannot run.

## Submit from the command line

Set the Adagio API base URL and token:

```bash
export ACTION_URL="https://adagio.run/api/v1"
export QAPI_SUBMISSION_TOKEN="paste-token-here"
```

Preview the submission first:

```bash
adagio qapi build --plugin my-plugin --dry-run
```

Then submit:

```bash
adagio qapi build --plugin my-plugin
```

Useful variations:

```bash
adagio qapi build --plugin my-plugin --output qapi.json
adagio qapi build --plugin my-plugin,other-plugin --dry-run
adagio qapi build --plugin my-plugin --force-overwrite
```

Use `--force-overwrite` only when you mean to replace your own existing private submission for the same QIIME version.

## What the submission creates

Registration, by any of the three routes, creates a **private** plugin record for:

- the submitted QIIME version
- the authenticated owner
- the submitted plugin name

Private plugins are visible only to the submitting user inside Adagio.

If a plugin name exists both publicly and privately, the submitting user's private version takes precedence in that user's catalog view.

## Plugin visibility states

Adagio recognizes three plugin states:

- **private**: registered by a user through Adagio Desktop, an AI assistant, or the CLI; visible only to that owner
- **community**: public, but not maintainer-endorsed as a core supported plugin
- **official**: public and maintainer-endorsed

There is currently no self-serve CLI flag to publish directly as `community` or `official`. Public visibility is managed by Adagio maintainers.

## Requesting public visibility

If you want your plugin added to the public Adagio catalog or to the default image set, open an issue in the main Adagio repository and include:

- plugin name
- source repository
- container image reference
- supported QIIME version
- short description of what the plugin is for
- whether you are requesting `community` or `official` visibility
- who will maintain and support it

Maintainers may route follow-up work into the `images` repository or other internal publication workflows as needed.

## When to re-submit

Re-submit after interface changes such as:

- renamed actions
- changed inputs, parameters, or outputs
- changed semantic types
- changed defaults

If the interface did not change, users can usually keep the existing registration and only update the runtime image they execute.
