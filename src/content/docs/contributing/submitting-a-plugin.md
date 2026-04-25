---
title: Registering and Submitting a Plugin
description: How to make a plugin available in Adagio and request public visibility
---

There are two separate steps in the Adagio plugin workflow:

1. **register it with an Adagio environment** so Adagio can see the plugin actions
2. **request public visibility** if you want other users to see it as a community or official plugin

Registering through the CLI creates a **private** plugin entry by default.

## Before you submit

Prepare three things:

1. a QIIME 2 environment with your plugin installed
2. a container image that can run the plugin
3. a scoped QAPI submission token from Adagio

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

### 3. Create a QAPI submission token in Adagio

In the Adagio app:

1. sign in
2. open **Profile**
3. create a **QAPI Submission Token**
4. copy it immediately, because it is shown only once

Token notes:

- tokens are short-lived bearer tokens
- they can be created for 1 to 168 hours
- they are meant for CLI submission only
- you can revoke them later from the same Profile page

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

CLI submission creates a **private** plugin record for:

- the submitted QIIME version
- the authenticated owner
- the submitted plugin name

Private plugins are visible only to the submitting user inside Adagio.

If a plugin name exists both publicly and privately, the submitting user's private version takes precedence in that user's catalog view.

## Plugin visibility states

Adagio recognizes three plugin states:

- **private**: submitted by a user through the CLI; visible only to that owner
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
