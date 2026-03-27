---
title: Submitting a Plugin
description: How to contribute a plugin to the Adagio ecosystem
---

Once your plugin is working and packaged, you can contribute it to the Adagio ecosystem so other users can access it from the node panel.

## What submission involves

1. **Publishing your plugin package** to PyPI so it can be installed into QIIME2 environments.
2. **Publishing a Docker image** to a container registry (GHCR recommended) following the Adagio image naming convention.
3. **Opening a pull request** in the [adagio-images](https://github.com/cymis/adagio-images) repository to add your image definition.

## Image naming convention

Images contributed to the Adagio ecosystem follow this convention:

```
ghcr.io/cymis/qiime2-plugin-<plugin-name>:<tag>
```

Use the QIIME2 release tag as your image tag (e.g., `2026.1`) so users can pin to specific releases.

## Pull request checklist

When opening a PR to `adagio-images`:

- [ ] Dockerfile is added under the correct directory
- [ ] Image builds successfully from the provided base
- [ ] Plugin installs cleanly (`pip install my-plugin`)
- [ ] `qiime dev refresh-cache` runs without errors
- [ ] Image is tested with at least one pipeline run using a local runtime config

## After your image is accepted

Once the image is merged and published, it becomes available through the default image resolver. Users with your plugin installed and registered (via `adagio build-qapi`) will see your actions in the node panel.

To get your plugin registered on the hosted Adagio instance, open an issue in the `adagio` repository with your plugin name and image reference.
