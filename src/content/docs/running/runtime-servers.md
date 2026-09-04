---
title: Runtime Servers
description: Connect a Linux machine to Adagio for pipeline execution
---

A Runtime Server connects a Linux machine to Adagio so that pipelines started in
the web app can execute on that machine. The server makes outbound HTTPS
connections to Adagio, claims work, runs it with `adagio-cli`, and reports
progress and output paths. It does not require an inbound network port.

:::caution[QA preview]
`adagio-server` is currently a QA prerelease for the Adagio development
deployment. Install the pinned `0.1.0a1` release shown below. Do not treat this
preview as a production service.
:::

## Requirements

Use a machine with:

- Linux and a working user-level systemd session
- Python 3.11 or newer
- Docker when the pipeline uses container-backed actions
- enough CPU, memory, disk, and concurrency capacity for the work you submit

Install the server as the Linux user that should own the job files. That user
must be able to read every input path and write to the job, cache, and output
locations.

:::danger[Trusted execution environment]
A Runtime Server executes pipeline actions with the permissions of the Linux
account that installed it. Giving someone permission to use the server gives
them permission to run code as that account. Access to a rootful Docker daemon
can amount to administrator access to the host. Use a dedicated account and run
only trusted pipelines and plugins.
:::

## Create a Runtime Server

1. In Adagio, open **Settings → Runtime Servers**.
2. Choose **New Runtime Server**.
3. Enter the name users should see when selecting the server.
4. Open the new server and copy its temporary enrollment token.

An enrollment token authorizes one machine once and expires after a short time.
Generating another token immediately invalidates the previous one.

## Install the server

Create a persistent virtual environment on the Linux machine:

```bash
python3 -m venv ~/.local/share/adagio-server-venv
source ~/.local/share/adagio-server-venv/bin/activate
python -m pip install "adagio-server==0.1.0a1"
adagio-server --version
```

Keep this environment after installation. The systemd service records the
interpreter path that ran `adagio-server install`. Do not use an ephemeral
`uvx` environment or `sudo pip`.

The setup page in Adagio provides a command block containing the current
deployment URL and temporary token. Copy and run that block while the virtual
environment is active. For the development deployment it has this shape:

```bash
export ADAGIO_ENROLLMENT_TOKEN='<temporary token from Adagio>'
adagio-server install --url 'https://app.dev.adagio.run'
```

`adagio-server install` exchanges the temporary token for a machine credential,
stores it with user-only permissions, installs a systemd user service, starts
the service immediately, and enables it to restart automatically. You do not
need to run `adagio-server start` separately.

## Confirm the connection

The install command should report that the machine enrolled and
`adagio-server.service` started. Confirm the service is running:

```bash
systemctl --user status adagio-server
```

The Runtime Server page in Adagio should change to **Connected**. If user
services stop after logout or reboot, ask the host administrator to enable
systemd user lingering for the service account:

```bash
loginctl enable-linger USERNAME
```

## Run a pipeline on the server

Open a pipeline and select the Runtime Server from the title-bar server
indicator. Values entered for pipeline inputs are paths on the selected Runtime
Server, not paths on the browser's computer. The same rule applies to conda
environments, Apptainer images, job outputs, and other filesystem settings.

The default server directories are:

| Purpose | Path |
| --- | --- |
| Server data | `~/.local/share/adagio-server` |
| Job workspaces | `~/.local/share/adagio-server/jobs` |
| Shared job cache | `~/.local/share/adagio-server/cache` |

To use another filesystem, append
`--server-home /path/to/adagio-server` to the install command. To select an
explicit authenticated loopback port, append `--port 23456`. The listener
remains bound to `127.0.0.1`.

Adagio does not impose a job-count limit or decide whether the machine has
capacity for another job. Each claimed job starts independently, so the server
owner is responsible for resource use and concurrency.

## Update or reconnect

Wait for active work to finish, upgrade the package in the same persistent
environment, then generate a fresh enrollment token and rerun
`adagio-server install`. Installing a new package alone does not restart an
existing service or update its systemd unit.

## Troubleshooting

Read recent service logs with:

```bash
journalctl --user -u adagio-server -n 100
```

For an interactive foreground process, stop the user service and use
`adagio-server start`. Plain HTTP and disabled TLS verification are refused
unless `install --insecure` is explicitly used with a development deployment.

Common checks:

- Confirm the setup page still shows the same Runtime Server and that no newer
  enrollment token was generated.
- Confirm the service user can read input paths and write to output and cache
  paths.
- Confirm Docker is running and accessible to the service user when the
  pipeline uses Docker images.
- If Adagio reports **Update required**, install the compatible server release
  and enroll again.

