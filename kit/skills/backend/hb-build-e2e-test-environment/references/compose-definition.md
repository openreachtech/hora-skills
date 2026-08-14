# The compose definition

The compose file that brings the E2E stack up, service by service, and the settings the pipeline
actually depends on. Referenced from §2 and §4 of [SKILL.md](../SKILL.md).

> **This file is written in one example stack.** Each service below is a *role* being filled — system
> of record, cache and job queue, event transport, change propagation, read model — by one particular
> component, and the roles are what §1 of [SKILL.md](../SKILL.md) asks you to map your project onto.
> A project on PostgreSQL logical replication, NATS, an outbox poller, a different search engine or no
> read model at all keeps the **general rule** stated in each section's bullets and replaces the YAML.
> Service names, volume names, images, environment variables and ports are **illustrative values**,
> never values to copy.

## Reading a service block

Whatever component fills a role, the block for it answers the same four questions:

| Question | Where the answer shows up | Holds for any component |
| --- | --- | --- |
| what does it need to be configured to emit or accept, for the next role to work? | `command:` / `environment:` | yes — a store that feeds change propagation must be told to produce what the propagator reads |
| does the host need to reach it, and on which port? | `ports:`, always `127.0.0.1`-prefixed | yes — and a service that advertises its own address must publish the port it advertises |
| how does it say it is ready? | `healthcheck:` | yes — the runner waits on this and nothing else |
| what must be inside its image, so the stack starts without network access? | `build:` | yes — plugins, extensions and drivers are baked in, never downloaded at start |

## Why a second compose file

The development stack is a place to work in; the E2E stack is a place to *operate the product* in.
They want different things:

| | development stack | E2E stack |
| --- | --- | --- |
| lifetime | days, kept between sessions | kept between sessions too, but destroyable in one command |
| ports | the conventional ones | a block of its own **if** the two must run at once |
| memory | generous | as small as the services tolerate, so it can run on a working machine |
| data | accumulated by hand | loaded once from the seed set, then mutated by the operator |
| volumes | persistent | persistent **per project**, dropped only by `clean.sh` |

Keeping one file for both means every one of those rows becomes a compromise. Keep two, and put the
E2E one under `e2e/` where its purpose is obvious.

## Project name and volumes

```yaml
# e2e/docker/compose.yaml
name: <project>-e2e   # NOT the default (the directory name), and NOT the dev project's
```

**The file sits under `e2e/docker/`, with everything it references by relative path beside it** — the
`build:` contexts under `images/`, the init SQL under `initdb/`, any config a service mounts. Compose
resolves those paths against this file's directory, so keeping them together is what lets the
definition move as a unit; the scripts stay at `e2e/` root and pass `-f e2e/docker/compose.yaml`.

- **Declare `name:`.** Without it, compose derives the project name from the directory, and two
  compose files that happen to sit in similarly-named directories share containers, network and
  volumes. Sharing volumes with the development stack is the worst case: the run inherits the last
  session's rows, and fixed seed ids collide on insert.
- **Named volumes persist between runs, and that is the point.** The operator's data has to survive a
  restart, so `down.sh` never touches the volumes; `clean.sh` is the one command that drops them
  ([runner-and-lifecycle.md](./runner-and-lifecycle.md)). A re-run also skips the image build and the
  cluster's startup as a side benefit.
- **`tmpfs` for the data directory is a trade, not a free speed-up.** It makes a store fast and always
  empty — the change log the capture connector reads works there too — but *always empty* now means
  the operator loses their session's work whenever the container restarts. Use it only for a store
  whose contents are genuinely disposable within a session, never for the system of record.

## The services

Each heading names the **role** first and the component the example fills it with second.

### System of record — example: a relational database with a row-format change log

```yaml
services:
  mariadb:
    image: mariadb:11.4   # pin the minor: the binlog format the connector reads must not move
    command: >
      --log-bin=mysql-bin
      --binlog-format=ROW
      --binlog-row-image=FULL
      --expire-logs-days=1
      --server-id=1
    environment:
      MARIADB_DATABASE: ${DATABASE_NAME}
      MARIADB_ROOT_PASSWORD: ${DATABASE_PASSWORD}
    ports: ['127.0.0.1:13306:3306']
    volumes:
      - 'e2e-db-data:/var/lib/mysql'
      # e2e/docker/initdb — beside the compose file, because that is what './' resolves against.
      # the account the capture connector reads the log with; runs once, on volume creation
      - './initdb:/docker-entrypoint-initdb.d:ro'
    healthcheck:
      test: ['CMD', 'healthcheck.sh', '--connect', '--innodb_initialized']
      interval: 5s
      retries: 20
```

- **`--binlog-format=ROW` with `--binlog-row-image=FULL` is a requirement, not a preference.**
  Without the full row image a change event does not carry the row's values, and the capture pipeline
  delivers events the consumer cannot act on. A search would then return an empty document rather
  than a missing one. **General rule:** the store must be configured to emit *whatever the change
  propagation mechanism reads* — the equivalent switch is `wal_level=logical` plus a replication slot
  on PostgreSQL, CDC enabled per table on SQL Server, an oplog-backed replica set for change streams,
  and nothing at all where propagation is an outbox table the application writes itself.
- **Pin the minor version.** A floating major tag can move the change-log format under the propagator
  on a rebuild, breaking the pipeline for a reason that is not in the repository.
- **The initdb directory runs once, when the volume is created.** Since the volume now survives every
  `down.sh`, a changed SQL file there is **not** applied on the next `up.sh` — and will not be until
  someone runs `clean.sh`. Say so wherever these files are edited, because the symptom (a missing
  account, an ungranted privilege) looks nothing like its cause.
- **Short log expiry** (`--expire-logs-days=1`) — this environment has no reason to keep a week of
  change log.

### Cache and job queue — example: Redis

```yaml
  redis:
    image: redis:7-alpine
    command: ['redis-server', '--save', '', '--appendonly', 'no']
    ports: ['127.0.0.1:16379:6379']
    healthcheck:
      test: ['CMD', 'redis-cli', 'ping']
      interval: 5s
      retries: 20
```

- **Persistence off** (`--save '' --appendonly no`) — the one store that is allowed to forget.
  Queued jobs are work *in flight*, not the operator's data: the durable state lives in the system of
  record, and a job whose row is still there can be re-triggered. Keeping them across a restart mostly
  means a worker waking up to process a job whose context has moved on. **General rule:** the roles
  that must survive a restart are the ones holding authored state; the queue is not one of them, so
  turn its durability off rather than reasoning about stale jobs later.

### Event transport — example: Kafka in single-node mode

```yaml
  kafka:
    image: <kraft-mode-kafka-image>
    environment:
      KAFKA_CFG_NODE_ID: '0'
      KAFKA_CFG_PROCESS_ROLES: controller,broker
      KAFKA_CFG_CONTROLLER_QUORUM_VOTERS: 0@kafka:9093
      # two ways in: Connect is a container and reaches the broker by service name; the test
      # runner is on the host and reaches it through the published port
      KAFKA_CFG_LISTENERS: INTERNAL://:9092,EXTERNAL://:19092,CONTROLLER://:9093
      KAFKA_CFG_ADVERTISED_LISTENERS: INTERNAL://kafka:9092,EXTERNAL://localhost:19092
      KAFKA_CFG_LISTENER_SECURITY_PROTOCOL_MAP: INTERNAL:PLAINTEXT,EXTERNAL:PLAINTEXT,CONTROLLER:PLAINTEXT
      KAFKA_CFG_INTER_BROKER_LISTENER_NAME: INTERNAL
      KAFKA_CFG_CONTROLLER_LISTENER_NAMES: CONTROLLER
      KAFKA_CFG_AUTO_CREATE_TOPICS_ENABLE: 'false'
    ports: ['127.0.0.1:19092:19092']   # host port == the EXTERNAL listener port
    healthcheck:
      test: ['CMD-SHELL', 'kafka-topics.sh --bootstrap-server localhost:9092 --list']
      interval: 5s
      retries: 30
```

- **The published port must equal the external listener's port.** A broker answers the initial
  connection with cluster metadata containing its *advertised* address, and the client then reconnects
  to that. Map `127.0.0.1:19092:29092` while advertising `localhost:29092` and the client connects,
  is told to go to `29092`, finds nothing there, and every produce and consume fails — after a
  connection that looked fine. Change the listener port and the advertised port together, and publish
  that same number. **General rule:** this applies to every component that answers with its own
  address, not just to this broker — a clustered queue redirecting to a node name, a replica set
  naming its members, a cluster publishing a `publish_address`. Find where the component states its
  own address and make that the address the host can actually reach.
- **Two listeners because there are two kinds of client.** One listener can advertise only one
  address; a container client needs the service name, the host runner needs `localhost`. Any
  component reached from both sides has the same two-audience problem, however it is configured.
- **`KAFKA_CFG_CONTROLLER_LISTENER_NAMES` is required whenever `controller` is a role** — without it
  the entrypoint aborts before the broker starts, because it cannot tell which listener the quorum
  speaks on.
- **Leave auto-creation off.** A topic the broker invents gets one partition, and **a partition count
  cannot be reduced afterwards** — so a single accidental produce before the create step permanently
  changes what ordering guarantees the topic has. The runner creates topics explicitly. **General
  rule:** wherever the transport can invent a channel on first use, turn that off and create the
  channels in the runner, because an invented channel gets defaults you cannot take back.

### Change propagation — example: a CDC connector in Kafka Connect

```yaml
  kafka-connect:
    build: ./images/connect      # the capture connector plugin, baked in
    depends_on:
      kafka: { condition: service_started }
      mariadb: { condition: service_healthy }
    environment:
      BOOTSTRAP_SERVERS: kafka:9092         # in-network, not the published port
      GROUP_ID: <project>-e2e-connect
      CONNECT_REST_ADVERTISED_HOST_NAME: kafka-connect
      CONFIG_STORAGE_TOPIC: _connect_configs
      OFFSET_STORAGE_TOPIC: _connect_offsets
      STATUS_STORAGE_TOPIC: _connect_status
      KEY_CONVERTER_SCHEMAS_ENABLE: 'false'
      VALUE_CONVERTER_SCHEMAS_ENABLE: 'false'
    ports: ['127.0.0.1:18083:8083']   # only because the runner registers the connector over it
    healthcheck:
      test: ['CMD-SHELL', 'curl -sf http://localhost:8083/connectors']
      interval: 5s
      retries: 40
```

- **The plugin is baked into an image, not downloaded at start.** A start-time download makes the
  stack need the network and fail differently on a slow day, and where outbound access is restricted
  it does not work at all.
- **Its own storage topics per project.** Connector configuration and offsets live in Kafka, so two
  stacks sharing them means one registers a connector the other did not ask for. A distinct
  `GROUP_ID` (and separate broker, as here) keeps them apart. **General rule:** wherever the
  propagation mechanism keeps its own state — replication slot, offset table, cursor file, subscription
  name — that state needs a name of its own per stack, or two stacks steer each other.
- **The connector registration API is published only because the runner is on the host.** It takes
  no authentication — the `127.0.0.1` prefix is what keeps it off the network.
- **A propagator that is not a service at all needs no block here.** An outbox poller or a dual-write
  path lives inside the application, so it is started as one of the background processes instead
  ([runner-and-lifecycle.md](./runner-and-lifecycle.md)) — and the ordering constraint (propagation
  registered after the transport's channels and after the master rows) is unchanged.

### Read model — example: a search cluster with an analyzer plugin

```yaml
  elasticsearch:
    build: ./images/search       # the analyzer plugin the application relies on, baked in
    environment:
      discovery.type: single-node
      ES_JAVA_OPTS: '-Xms512m -Xmx512m'   # a fixture, not a workload
      xpack.security.enabled: 'true'
      ELASTIC_PASSWORD: ${ELASTICSEARCH_PASSWORD}
    ports: ['127.0.0.1:19200:9200']
    healthcheck:
      test: ['CMD-SHELL', 'curl -sf -u elastic:$$ELASTIC_PASSWORD http://localhost:9200/_cluster/health']
      interval: 5s
      retries: 40
    volumes: ['e2e-search-data:/usr/share/elasticsearch/data']
```

- **A much smaller heap than the development stack.** The E2E stack must be able to run *beside* the
  development one; a multi-gigabyte heap on both is what makes a developer stop bringing it up.
- **Leave authentication on.** Turning it off here means the credential path is never exercised,
  and the first environment that has it enabled is the one that breaks.
- **The analyzer plugin is baked in for the same reason as the connector plugin** — no network at
  start, so the stack also comes up where outbound access is restricted. The same holds for any
  extension the read model needs (a database extension for a materialized view, a tokenizer
  dictionary, a language pack).
- **This is the slowest service to become healthy.** Give its health wait the longest retry budget.
- **A read model that is not a separate service still exists as a step.** A materialized view or a
  denormalized table lives in the system of record, so it has no block here — but it still needs
  creating before anything writes to it, a name of its own per run, and a backfill after seeding.

## Healthchecks are the contract

Every service declares its own healthcheck, and the runner only ever polls compose for the result
([runner-and-lifecycle.md](./runner-and-lifecycle.md)). Two reasons:

- **The service knows when it is ready; the runner does not.** "The port accepts a connection" is not
  readiness for a database still initializing, or for a cluster that has not elected itself.
- **`depends_on: condition: service_healthy` composes.** Connect must not start before the database
  is genuinely up, or it registers against a server that then restarts, and the connector lands in a
  failed state that no test explains.

Use short intervals (5s) and a generous retry count for a fixture: a fast machine then starts fast,
and a slow one still starts.
