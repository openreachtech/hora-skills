# The edge and the proxy layer

The reverse proxy the browser actually connects to: how its E2E configuration is derived from the
production one, where it sits relative to the container boundary, and what it can and cannot prove.
Referenced from §5 of [SKILL.md](../SKILL.md).

> **nginx is the example, the edge is the role.** Every rule here is about *the thing in front of
> the application*; the nginx directives are one way of expressing it, and the Apache equivalents
> are tabulated below. Service names, ports and paths are **illustrative values**, never values to
> copy.

## What only the edge can catch

Each of these behaves correctly when the browser talks to the application directly, and wrongly in
production. An environment without an edge reports all of them as working.

| Setting | Left at its default | How it shows up in production |
| --- | --- | --- |
| `Upgrade` / `Connection` headers | not forwarded | WebSocket and GraphQL subscriptions never connect — they time out silently, with no error to read |
| `client_max_body_size` | 1MB | image and file uploads answer 413 above 1MB |
| `proxy_buffering` | on | a streamed or server-sent response arrives all at once at the end, or is cut off |
| `proxy_read_timeout` | 60s | a long-running request answers 504 while the application is still working on it |
| `X-Forwarded-For` / `-Proto` | unset | every client looks like the proxy, so per-client rules count everyone as one; generated links fall back to `http` |
| trailing `/` on `proxy_pass` | — | the path prefix is dropped or doubled, so a route that works locally 404s |
| `try_files` for a single-page app | unset | a deep link or a reload 404s; only navigation from the entry page works |
| cookie `Secure` / `SameSite` | depends where TLS ends | sign-in appears to succeed and the session is gone on the next request |

The first two are the ones that reach production most often, because both are invisible until a
particular feature is exercised.

## Derive the E2E configuration from production

**Start from the production file. Do not write a new one.** The whole value of this layer is that it
carries production's defects; a file written from scratch carries different ones, and then the edge
is present and proves nothing.

Three changes, and no others:

| Change | Why |
| --- | --- |
| Remove TLS termination — the `listen 443 ssl`, the certificate paths, the redirect from `:80` | there is no certificate here, and the operator reaches the stack over loopback |
| Repoint `proxy_pass` at the E2E application | it is the only address that differs |
| Relax `server_name` to `_` | the stack is selected by loopback port, not by host name — host-name routing would need an `/etc/hosts` edit on every machine |

Everything else — header forwarding, body size, timeouts, buffering, the location blocks and their
order — is copied **unchanged**. A difference that is not in this table is a difference that will
not be caught.

### Record the derivation in the file

```nginx
# derived-from: the deployment runbook's edge configuration chapter
# derived-at:   2026-08-22
# deltas:       TLS termination removed / upstream repointed to the E2E app / server_name relaxed
```

- **Update `derived-at` and rewrite `deltas` whenever the production file changes.** A record that
  was not updated does not describe a derivation; it describes a different file.
- **Watch the length of `deltas`.** Two or three entries is a derivation. A list that keeps growing
  says the copy has become a reimplementation, and the thing to fix is the production side —
  usually by moving whatever differs into a variable or an included file that both can share.
- **Name the production chapter, not a path.** The runbook lives in the consuming project, and its
  path is not knowable from here.

## The compose service

The edge is the last service to become healthy, because it has nothing to serve until the
application answers.

```yaml
  edge:
    image: nginx:1.27-alpine
    depends_on:
      app:
        condition: service_healthy
    volumes:
      - ./nginx/e2e.conf:/etc/nginx/conf.d/default.conf:ro
    ports:
      - '127.0.0.1:18080:80'
    mem_limit: 64m
    healthcheck:
      test: ['CMD', 'wget', '-q', '-O', '-', 'http://localhost/healthz']
      interval: 5s
      timeout: 3s
      retries: 12
```

- **`:ro` on the configuration mount.** The container has no reason to write it, and a read-only
  mount makes that explicit.
- **`mem_limit` like every other service.** A proxy is small, but an uncapped container is an
  uncapped container ([§ Memory](./compose-definition.md#memory-cap-every-container-then-budget-against-the-runtimes-memory)).
- **The container's own healthcheck is not sufficient.** It answers from inside the namespace. The
  runner additionally polls `http://127.0.0.1:18080/` from the host — the side the operator uses.

## The nginx configuration

```nginx
# derived-from: the deployment runbook's edge configuration chapter
# derived-at:   2026-08-22
# deltas:       TLS termination removed / upstream repointed to the E2E app / server_name relaxed

upstream app {
  server app:3000;
}

server {
  listen 80;
  server_name _;

  # copied from production unchanged — the values these defend are the point
  client_max_body_size 30m;
  proxy_read_timeout   300s;

  location /healthz {
    access_log off;
    return 200 "ok\n";
  }

  location / {
    proxy_pass http://app;

    proxy_http_version 1.1;
    proxy_set_header Host              $host;
    proxy_set_header X-Real-IP         $remote_addr;
    proxy_set_header X-Forwarded-For   $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;

    # WebSocket / subscriptions
    proxy_set_header Upgrade    $http_upgrade;
    proxy_set_header Connection $connection_upgrade;
  }
}
```

- **`proxy_set_header` does not inherit into a `location` that sets one of its own.** Declaring any
  `proxy_set_header` inside a `location` block discards **every** one inherited from the `server`
  block. This is the single most common way a header stops being forwarded on one route while
  working on all the others, and no unit test can see it.
- **`$connection_upgrade` is a map, not a built-in.** It belongs in the `http` block:
  `map $http_upgrade $connection_upgrade { default upgrade; '' close; }`. Sending a literal
  `Connection: upgrade` on every request breaks keep-alive for ordinary ones.
- **A trailing `/` on `proxy_pass` changes the path.** `proxy_pass http://app;` forwards the URI
  unchanged; `proxy_pass http://app/;` strips the matched `location` prefix. Copy whichever
  production uses, exactly.

### Apache equivalents

| Purpose | nginx (the default here) | Apache httpd |
| --- | --- | --- |
| forward | `proxy_pass` | `ProxyPass` / `ProxyPassReverse` |
| WebSocket | `proxy_set_header Upgrade` / `Connection` | `RewriteCond` + `ProxyPass ws://` (`mod_proxy_wstunnel`) |
| request body size | `client_max_body_size` | `LimitRequestBody` |
| upstream timeout | `proxy_read_timeout` | `ProxyTimeout` |
| suppress buffering | `proxy_buffering off` | `flushpackets=on` / `proxy-sendchunked` |
| original client address | `X-Forwarded-For` | `mod_remoteip` (`RemoteIPHeader`) |
| single-page fallback | `try_files $uri /index.html` | `FallbackResource` |
| compression | `gzip on` | `mod_deflate` |

## Topology: which side of the container boundary

**The edge and the application go on the same side. Both in containers, or neither.**

```
A — the edge is part of what is being checked
  [client container ×N] → [edge container] → [app container]
  one compose network; nothing crosses the boundary; source addresses are genuinely distinct

B — no edge
  [browser on the host] → [app process on the host]
  the proxy layer is not exercised at all — record that, and hand the verification on
```

Shape A is also what makes the stack portable: with all three inside containers the host needs only
a container runtime, and the same stack behaves identically on Linux, macOS and WSL2.

### The measured record: what a mixed topology does

A stack that put the application on the host and the edge in a container was built and measured on
**WSL2 with Docker Desktop 29.5.2**. All four routes failed. The application was bound to `*:3900`
on every interface throughout, so "the application was not listening" does not explain any of them.

| Route attempted | Result |
| --- | --- |
| edge with `network_mode: host` | does not work. On Docker Desktop, "host" is the Docker VM's namespace, not WSL2's, so `proxy_pass 127.0.0.1` never reaches the application |
| bridge network plus a published port | **connects, and is worthless as a check.** Requests from three distinct sources all arrived with `$remote_addr` of `172.17.0.1`, so a rule meant to be per-client passes against an implementation that counts every client as one |
| host reaching the container's IP directly | `EHOSTUNREACH` — WSL2's `eth0` on `172.17.2.189/20` overlapped Docker's `172.17.0.0/16` |
| container reaching the application on the host | HTTP 000 on all four of `host.docker.internal`, the default gateway, `192.168.65.2`, and WSL2's own address |

**The conclusion is not that the machine was unusual.** The topology was weak from the start and
this machine exposed it. The `127.x` aliases used to separate the sources collapse on native Linux
engines too, because loopback traffic to a published port passes through `docker-proxy` — unless
`userland-proxy=false` is set *and* the sources are non-loopback addresses. Filed as machine-specific,
the same design gets written again on the next machine.

There is a second reason the mixed shape cannot work here: this skill binds the application to
`127.0.0.1` only ([§4](../SKILL.md)), which closes the route independently of anything above.

### Source addresses collapse at a published port

**Moving the application into a container is not enough** for any check that depends on who the
client is. Traffic entering through a published port is rewritten to the bridge gateway's address
before the edge sees it. If the check needs distinct clients, the clients belong inside the compose
network too — that is why shape A has the client in a container.

## The reduced test bed: the edge alone

The edge's configuration can be exercised without the application, by putting an echo server behind
it and reading the headers it received:

```
[client container ×N] → [edge container] → [echo container]
```

It is smaller than the full stack, needs no seed data, and never crosses the container boundary.

**What it proves, and what it does not:**

| Proposition | Established by |
| --- | --- |
| the edge appends a genuine client address on the right, and no `location` block has silently discarded the inherited `proxy_set_header` | **this test bed** — and this is the part nothing else can reach |
| the application reads the correct entry counting from the right | unit tests, which already exist |
| the two are actually connected, so the behaviour really is per-client | **neither of them** |

The echo server has no rate limiter, no session, no application logic, so nothing here reaches the
behaviour those headers feed. **This is an inference across two test beds, not an end-to-end
demonstration** — write it down that way. Closing the seam needs the application on the same side,
which is shape A.

The gap this test bed *does* close is the dangerous one: a `proxy_set_header` present in one
`location` and missing from another cannot be caught by a unit test in principle, and shows up in
production as one route behaving differently from the rest.

## Confirming it works

Read these as intentions; the exact flags differ per client. Run them **from the host** — the side
the operator uses — not from inside a container.

| What to confirm | How |
| --- | --- |
| the edge is serving at all | `curl -sS -o /dev/null -w '%{http_code}\n' http://127.0.0.1:18080/` |
| the path prefix survives the proxy | request a nested route and compare the status with the same route on the application's own port |
| `Upgrade` is forwarded | open the product's subscription or WebSocket feature in the browser **through the edge** and watch data arrive; a 101 in the access log confirms the handshake |
| the body limit is what production allows | upload a file just under and just over the configured size, and check for 413 |
| streaming is not buffered | request the streaming endpoint and confirm the first bytes arrive before the response completes |
| the forwarded address is present | check the application's log for the client address rather than the proxy's |

**Each of these is exercised, not read.** A configuration review confirms what the file says; only a
request confirms what the edge does.

## When the edge is left out

Leaving it out is a legitimate decision — a demo, a deadline, a machine it will not run on. Leaving
it out silently is not. Record, next to the environment:

- **what was measured** — the routes tried and what each returned, as a table
- **what was fixed in the product** rather than in the environment
- **what a person has to decide**, with the options
- **the decision and its date**
- **where the verification went instead** — normally the deployment runbook's post-release chapter

The record exists so the next person does not spend a day rediscovering it on the same machine.

**Do not leave a non-working edge configuration and a spec that always fails behind.** A sweep that
is red every time is a sweep nobody reads, and the failures that matter disappear into it.
