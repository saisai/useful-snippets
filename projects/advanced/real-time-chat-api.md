real-time-chat-app

```
go version; node -v; npm -v; docker --version 2>/dev/null; which migrate 2>/dev/null; ls /usr/local/go/bin 2>/dev/null; echo "---"; uname -a
```

```
# Install Node.js 22 LTS via nvm or nodesource if available
if command -v nvm >/dev/null 2>&1; then echo "nvm available"; fi
ls /home/username/.nvm 2>/dev/null | head
# Check if fnm, n, or volta exist
command -v fnm; command -v n; command -v volta; command -v pnpm; command -v bun
# Check apt node versions
apt-cache policy nodejs 2>/dev/null | head -5
# Check if we can install via official binary
curl -fsSL https://nodejs.org/dist/index.json 2>/dev/null | head -c 200
echo
which curl wget
```


```
set -e
NODE_VER=22.19.0
ARCH=x64
TOOLS=/home/username/real-time-chat-app/.tools
mkdir -p "$TOOLS"
cd /tmp
curl -fsSL "https://nodejs.org/dist/v${NODE_VER}/node-v${NODE_VER}-linux-${ARCH}.tar.xz" -o node.tar.xz
tar -xJf node.tar.xz -C "$TOOLS"
# symlink for convenience
ln -sfn "$TOOLS/node-v${NODE_VER}-linux-${ARCH}" "$TOOLS/node"
export PATH="$TOOLS/node/bin:$PATH"
node -v
npm -v
# pnpm via corepack or npm local
corepack enable || true
npm install -g pnpm@10 --prefix "$TOOLS/node"
pnpm -v
echo "PATH_EXPORT=$TOOLS/node/bin"
```

```
export PATH="/home/username/real-time-chat-app/.tools/node/bin:$PATH"
node -v
npm -v
pnpm -v
go version
# keep PATH for later
echo "export PATH=\"/home/username/real-time-chat-app/.tools/node/bin:\$PATH\"" >> /tmp/chat-env.sh
cat /tmp/chat-env.sh
```


```
# Start only postgres and redis
cd /home/username/real-time-chat-app
docker compose up -d postgres redis 2>&1 | tail -20
```

```
export PATH="/home/username/real-time-chat-app/.tools/node/bin:$PATH"
# wait for postgres
for i in $(seq 1 30); do
  docker compose -f /home/username/real-time-chat-app/docker-compose.yml exec -T postgres pg_isready -U chat -d chat && break
  sleep 1
done
export DATABASE_URL=postgres://chat:chat@localhost:5432/chat?sslmode=disable
export REDIS_URL=redis://localhost:6379/0
export APP_ENV=development
cd /home/username/real-time-chat-app/backend
go run ./cmd/migrate up
go run ./cmd/seed
cd /home/username/real-time-chat-app/frontend && npm test -- --run 2>&1 | tail -25
```

```
cp -n /home/username/real-time-chat-app/.env.example /home/username/real-time-chat-app/.env || true
export PATH="/home/username/real-time-chat-app/.tools/node/bin:$PATH"
set -a
source /home/username/real-time-chat-app/.env
set +a
cd /home/username/real-time-chat-app/backend
# start services in background
nohup go run ./cmd/api > /tmp/chat-api.log 2>&1 &
echo "API_PID=$!"
nohup go run ./cmd/websocket > /tmp/chat-ws.log 2>&1 &
echo "WS_PID=$!"
nohup go run ./cmd/worker > /tmp/chat-worker.log 2>&1 &
echo "WORKER_PID=$!"
cd /home/username/real-time-chat-app/frontend
nohup npm run dev > /tmp/chat-fe.log 2>&1 &
echo "FE_PID=$!"
sleep 2
echo "started"
```

```
# wait for health
for i in $(seq 1 40); do
  if curl -sf http://127.0.0.1:8080/healthz >/dev/null && curl -sf http://127.0.0.1:8081/healthz >/dev/null; then
    echo "backends ready"
    break
  fi
  sleep 1
done
echo "=== API health ==="
curl -sS http://127.0.0.1:8080/healthz; echo
echo "=== ready ==="
curl -sS http://127.0.0.1:8080/readyz; echo
echo "=== login alice ==="
curl -sS -D - -o /tmp/login.json -c /tmp/chat.cookies -X POST http://127.0.0.1:8080/api/v1/auth/login \
  -H 'Content-Type: application/json' \
  -d '{"email":"alice@chat.local","password":"Password123!dev"}'
echo
echo "=== login body ==="
head -c 400 /tmp/login.json; echo
echo "=== me ==="
curl -sS -b /tmp/chat.cookies http://127.0.0.1:8080/api/v1/auth/me; echo
echo "=== conversations ==="
curl -sS -b /tmp/chat.cookies http://127.0.0.1:8080/api/v1/conversations | head -c 500; echo
echo "=== logs api ==="
tail -20 /tmp/chat-api.log
echo "=== logs ws ==="
tail -10 /tmp/chat-ws.log
echo "=== logs fe ==="
tail -15 /tmp/chat-fe.log
```

```
# kill hung curl wait if still running
kill 10221 2>/dev/null || true
# restart API
pkill -f "go run ./cmd/api" 2>/dev/null || true
sleep 1
export PATH="/home/username/real-time-chat-app/.tools/node/bin:$PATH"
set -a
source /home/username/real-time-chat-app/.env
set +a
cd /home/username/real-time-chat-app/backend
nohup go run ./cmd/api > /tmp/chat-api.log 2>&1 &
echo "API_PID=$!"
# wait for listen
for i in $(seq 1 40); do
  if curl -sf http://127.0.0.1:8080/healthz >/dev/null; then echo ready; break; fi
  sleep 0.5
done
curl -sS http://127.0.0.1:8080/healthz; echo
curl -sS http://127.0.0.1:8080/readyz; echo
tail -15 /tmp/chat-api.log
```

```
ps aux | grep -E 'cmd/api|chat-platform|next' | grep -v grep
echo '---'
ss -lnt | grep -E '8080|8081|3000|9090' || netstat -lnt 2>/dev/null | grep -E '8080|8081|3000'
echo '--- log ---'
tail -20 /tmp/chat-api.log
```

```
cd /home/username/real-time-chat-app/backend
go build -o /tmp/chat-api ./cmd/api
echo "build_ok"
DATABASE_URL=postgres://chat:chat@localhost:5432/chat?sslmode=disable \
REDIS_URL=redis://localhost:6379/0 \
APP_ENV=development \
/tmp/chat-api > /tmp/chat-api.log 2>&1 &
echo "pid=$!"
sleep 2
curl -sS --max-time 3 http://127.0.0.1:8080/healthz; echo
curl -sS --max-time 3 http://127.0.0.1:8080/readyz; echo
tail -12 /tmp/chat-api.log
```

```
set -e
# login
curl -sS -c /tmp/chat.cookies -o /tmp/login.json -w "login_status=%{http_code}\n" \
  -X POST http://127.0.0.1:8080/api/v1/auth/login \
  -H 'Content-Type: application/json' \
  -d '{"email":"alice@chat.local","password":"Password123!dev"}'
python3 - <<'PY'
import json
d=json.load(open("/tmp/login.json"))
print("user", d["user"]["username"], "role", d["role"])
print("has_access", bool(d.get("access_token")))
open("/tmp/alice_token","w").write(d["access_token"])
PY
echo "=== me ==="
curl -sS -b /tmp/chat.cookies http://127.0.0.1:8080/api/v1/auth/me
echo
echo "=== conversations ==="
curl -sS -b /tmp/chat.cookies http://127.0.0.1:8080/api/v1/conversations > /tmp/convs.json
python3 - <<'PY'
import json
d=json.load(open("/tmp/convs.json"))
convs=d.get("conversations") or []
print("count", len(convs))
for c in convs:
    print(c["id"], c["type"], c.get("name"), "unread", c.get("unread_count"), "members", len(c.get("members") or []))
    open("/tmp/conv_id","w").write(c["id"])
PY
CONV=$(cat /tmp/conv_id)
echo "=== messages $CONV ==="
curl -sS -b /tmp/chat.cookies "http://127.0.0.1:8080/api/v1/conversations/$CONV/messages"
echo
echo "=== send message ==="
curl -sS -b /tmp/chat.cookies -X POST "http://127.0.0.1:8080/api/v1/conversations/$CONV/messages" \
  -H 'Content-Type: application/json' \
  -H "X-CSRF-Token: $(grep csrf_token /tmp/chat.cookies | awk '{print $7}')" \
  -d '{"content":"Hello from verification","client_message_id":"verify-1"}'
echo
echo "=== search users ==="
curl -sS -b /tmp/chat.cookies "http://127.0.0.1:8080/api/v1/users/search?q=bob"
echo
echo "=== ws health ==="
curl -sS http://127.0.0.1:8081/healthz; echo
echo "=== frontend ==="
curl -sS -o /dev/null -w "fe=%{http_code}\n" http://127.0.0.1:3000/login
# IDOR: bob cannot edit alice message if we get a message id
python3 - <<'PY'
import json
# login bob
import urllib.request
print("idor check via second login below")
PY
# login bob and try to patch alice message
ALICE_MSG=$(python3 -c 'import json; print(json.load(open("/tmp/login.json")).get("access_token","")[:8])')
echo done
```

```
kill 11075 2>/dev/null || true
sleep 1
cd /home/username/real-time-chat-app/backend
go build -o /tmp/chat-api ./cmd/api
DATABASE_URL=postgres://chat:chat@localhost:5432/chat?sslmode=disable \
REDIS_URL=redis://localhost:6379/0 \
APP_ENV=development \
/tmp/chat-api > /tmp/chat-api.log 2>&1 &
echo pid=$!
sleep 2
curl -sS --max-time 3 http://127.0.0.1:8080/healthz; echo
# login + conversations + send
curl -sS -c /tmp/chat.cookies -o /tmp/login.json \
  -X POST http://127.0.0.1:8080/api/v1/auth/login \
  -H 'Content-Type: application/json' \
  -d '{"email":"alice@chat.local","password":"Password123!dev"}'
python3 - <<'PY'
import json
d=json.load(open("/tmp/login.json"))
print("login", d["user"]["username"])
PY
curl -sS -b /tmp/chat.cookies http://127.0.0.1:8080/api/v1/conversations > /tmp/convs.json
python3 - <<'PY'
import json
convs=json.load(open("/tmp/convs.json"))["conversations"]
print("count", len(convs))
for c in convs:
    print(c["id"], c["type"], c.get("name"), "unread", c.get("unread_count"))
open("/tmp/conv_id","w").write(convs[0]["id"])
PY
CONV=$(cat /tmp/conv_id)
CSRF=$(awk '$6=="csrf_token"{print $7}' /tmp/chat.cookies)
echo "csrf_len=${#CSRF}"
curl -sS -b /tmp/chat.cookies -X POST "http://127.0.0.1:8080/api/v1/conversations/$CONV/messages" \
  -H 'Content-Type: application/json' \
  -H "X-CSRF-Token: $CSRF" \
  -d '{"content":"Hello from verification","client_message_id":"verify-1"}'
echo
curl -sS -b /tmp/chat.cookies "http://127.0.0.1:8080/api/v1/conversations/$CONV/messages" | python3 -c 'import json,sys; d=json.load(sys.stdin); print("messages", len(d.get("messages") or [])); print((d.get("messages") or [{}])[-1].get("content"))'
# IDOR: login bob, try delete alice message
curl -sS -c /tmp/bob.cookies -o /tmp/bob.json -X POST http://127.0.0.1:8080/api/v1/auth/login \
  -H 'Content-Type: application/json' \
  -d '{"email":"bob@chat.local","password":"Password123!dev"}'
MSG=$(python3 -c 'import json,sys; print(json.load(open("/tmp/convs.json"))["conversations"][0]["id"])')
# get last message id
MID=$(curl -sS -b /tmp/chat.cookies "http://127.0.0.1:8080/api/v1/conversations/$CONV/messages" | python3 -c 'import json,sys; print(json.load(sys.stdin)["messages"][-1]["id"])')
echo "alice_msg=$MID"
BCSRF=$(awk '$6=="csrf_token"{print $7}' /tmp/bob.cookies)
echo -n "bob_delete_status="
curl -sS -o /tmp/bobdel.json -w "%{http_code}" -b /tmp/bob.cookies -X DELETE "http://127.0.0.1:8080/api/v1/messages/$MID" -H "X-CSRF-Token: $BCSRF"
echo
cat /tmp/bobdel.json; echo
# user search
curl -sS -b /tmp/chat.cookies "http://127.0.0.1:8080/api/v1/users/search?q=bob"; echo
# frontend
curl -sS -o /dev/null -w "fe_login=%{http_code}\n" http://127.0.0.1:3000/login
curl -sS -o /dev/null -w "fe_chat=%{http_code}\n" http://127.0.0.1:3000/chat
```

```
chmod +x /home/username/real-time-chat-app/scripts/*.sh
cd /home/username/real-time-chat-app/backend && go test ./... -count=1 2>&1 | tail -20
# rebuild websocket in case domain tags needed there (already running old binary is fine)
echo done
```


local development 
```
cp .env.example .env
docker compose up -d postgres redis
make migrate && make seed
make frontend-install
make dev
```

Or: API :8080, WebSocket :8081, Next :3000 (rewrites /api/*).

Development-only seed accounts (never production):

Email				Password		Role
admin@chat.local	Admin123!dev	super_admin
alice@chat.local	Password123!dev	user
bob@chat.local		Password123!dev	user
cara@chat.local		Password123!dev	user
mod@chat.local		Password123!dev	moderator


```
chmod +x /home/username/.cursor/skills/save-conversation/scripts/save_conversation.py
python3 /home/username/.cursor/skills/save-conversation/scripts/save_conversation.py \
  --transcripts-dir /home/username/.cursor/projects/home-username-real-time-chat-app/agent-transcripts \
  --out-dir /home/username/Documents/cursor-conversations \
  --title "Production-grade real-time chat application"
# show a short preview
python3 - <<'PY'
from pathlib import Path
p = sorted(Path("/home/username/Documents/cursor-conversations").glob("*.md"))[-1]
text = p.read_text()
print("saved", p)
print("bytes", len(text))
print("--- preview ---")
print("\n".join(text.splitlines()[:20]))
PY
```

```
python3 /home/username/.cursor/skills/save-conversation/scripts/save_conversation.py \
  --transcripts-dir /home/username/.cursor/projects/home-username-real-time-chat-app/agent-transcripts \
  --out-dir /home/username/real-time-chat-app/conversations \
  --title "Production-grade real-time chat application"
ls -l /home/username/real-time-chat-app/conversations/
```

```
# Find Cursor plan artifacts
ls -la /home/username/.cursor 2>/dev/null | head -40
find /home/username/.cursor -iname '*plan*' 2>/dev/null | head -50
find /home/username/.cursor/projects -iname '*.md' 2>/dev/null | head -40
```

```
docker compose up -d redis && sleep 2 && docker compose exec -T redis redis-cli ping && docker compose exec -T -e REDISCLI_AUTH=wrong redis redis-cli ping; echo "---"; docker compose exec -T redis redis-cli --no-auth-warning ping
```

```
docker compose up -d redis
```

```
export PATH="$PWD/.tools/node/bin:$PATH"
cd e2e && node -e "require.resolve('@playwright/test')" && npx playwright --version
```

```
export PATH="/home/username/real-time-chat-app/.tools/node/bin:$PATH"
cd /home/username/real-time-chat-app/e2e && node -e "require.resolve('@playwright/test')" && npx playwright --version && ls node_modules/@playwright/test/package.json
```

```
export PATH="/home/username/real-time-chat-app/.tools/node/bin:$PATH"
ldd /tmp/cursor-sandbox-cache/d652c48675605155249bec0233a83f92/playwright/chromium_headless_shell-1243/chrome-headless-shell-linux64/chrome-headless-shell 2>/dev/null | grep "not found"
echo "---"
# install-deps needs root; try without and with sudo
cd /home/username/real-time-chat-app/e2e
npx playwright install-deps chromium 2>&1 | tail -40
```

```
id; command -v apt-get; command -v google-chrome google-chrome-stable chromium chromium-browser firefox 2>/dev/null; ls /usr/bin/chrom* /usr/bin/google* /usr/bin/firefox* 2>/dev/null; dpkg -l | grep -E 'libnspr4|libnss3|libatk' | head; apt-get --version | head -1
```

```
sudo -n true && echo PASSLESS || echo NEEDPW
. /etc/os-release && echo "$ID $VERSION_ID $VERSION_CODENAME"
apt-cache search --names-only '^libnspr4$' | head
apt-cache search --names-only '^libasound2' | head
```

```
export PATH="/home/username/real-time-chat-app/.tools/node/bin:$PATH"
cd /home/username/real-time-chat-app/e2e
npx playwright install-deps --dry-run chromium 2>&1 | tail -30
```

```
export PATH="/home/username/real-time-chat-app/.tools/node/bin:$PATH"
cd /home/username/real-time-chat-app/e2e
npx playwright install-deps --dry-run chromium 2>&1
```

```
set -euo pipefail
ROOT=/home/username/real-time-chat-app
DEST="$ROOT/.tools/playwright-sysdeps"
TMP=$(mktemp -d)
cd "$TMP"
pkgs=(
  at-spi2-common
  libasound2-data
  libasound2t64
  libatk-bridge2.0-0t64
  libatk1.0-0t64
  libatspi2.0-0t64
  libavahi-client3
  libavahi-common-data
  libavahi-common3
  libcairo2
  libcups2t64
  libdatrie1
  libgraphite2-3
  libharfbuzz0b
  libnspr4
  libnss3
  libpango-1.0-0
  libpixman-1-0
  libthai-data
  libthai0
  libxcb-render0
  libxdamage1
  fontconfig
  fonts-liberation
)
apt-get download "${pkgs[@]}"
mkdir -p "$DEST"
for deb in *.deb; do
  dpkg-deb -x "$deb" "$DEST"
done
ls "$DEST/usr/lib/x86_64-linux-gnu" | head
export LD_LIBRARY_PATH="$DEST/usr/lib/x86_64-linux-gnu:${LD_LIBRARY_PATH:-}"
BIN=/tmp/cursor-sandbox-cache/d652c48675605155249bec0233a83f92/playwright/chromium_headless_shell-1243/chrome-headless-shell-linux64/chrome-headless-shell
ldd "$BIN" | grep "not found" || echo "ALL RESOLVED"
rm -rf "$TMP"
```

```
chmod +x /home/username/real-time-chat-app/scripts/install-playwright-sysdeps.sh
export PATH="/home/username/real-time-chat-app/.tools/node/bin:$PATH"
cd /home/username/real-time-chat-app/e2e
npx playwright test --reporter=line 2>&1 | tail -60
```

```
export PATH="/home/username/real-time-chat-app/.tools/node/bin:$PATH"
cd /home/username/real-time-chat-app/e2e
npx playwright test --reporter=line
```

```
echo hello && pwd && ls /home/username/real-time-chat-app/e2e/playwright.config.ts
```

```
export PATH="/home/username/real-time-chat-app/.tools/node/bin:$PATH"
npx playwright test --reporter=line
```

```
chmod +x /home/username/real-time-chat-app/scripts/install-k6.sh
bash /home/username/real-time-chat-app/scripts/install-k6.sh
```

```
docker compose -f docker-compose.yml -f docker-compose.dev.yml logs migrate --tail 80; echo "===="; docker compose -f docker-compose.yml -f docker-compose.dev.yml ps -a
```

```
docker compose -f docker-compose.yml -f docker-compose.dev.yml run --rm migrate up
```

```
docker compose -f docker-compose.yml -f docker-compose.dev.yml up -d --no-build
```

```
docker compose -f docker-compose.yml -f docker-compose.dev.yml ps -a
echo "==== migrate ===="
docker compose -f docker-compose.yml -f docker-compose.dev.yml logs migrate --tail 20
echo "==== seed ===="
docker compose -f docker-compose.yml -f docker-compose.dev.yml logs seed --tail 20
curl -sS -o /dev/null -w "%{http_code}\n" http://127.0.0.1:8080/healthz
```


```
python3 ~/.cursor/skills/save-thoughts/scripts/save_thoughts.py \
  --transcripts-dir "$HOME/.cursor/projects/home-username-real-time-chat-app/agent-transcripts" \
  --out-dir "$PWD/cursor/thoughts"
```

I'll implement a complete Prometheus setup for this project.

Remaining metrics will include the Postgres connection pool. A dedicated worker metrics HTTP server will handle scraping separately from the main application. Docker Compose will run Prometheus and Grafana alongside Kubernetes scrape annotations and a ServiceMonitor. Documentation and tests for the /metrics endpoint will be added. The existing nginx configuration will remain unchanged. A helper wrapper around promhttp.Handler() will provide structured observability.

The worker metrics server will run in a goroutine and shut down when the worker context cancels. It will also expose a /healthz endpoint.

The metrics server will listen on :8082 by default and skip starting when METRICS_ADDR is empty, which keeps tests clean. A separate metrics port for the main API is unnecessary because Prometheus scrapes internally. Path labels from Echo will remain low-cardinality since GraphQL uses a single route.

The /metrics endpoint will bypass Echo's CSRF and CORS middleware to avoid recording its own requests. Grafana is being considered but may be omitted to reduce file count; the user only requested Prometheus, so documentation with PromQL queries and the native Prometheus UI should suffice.

Grafana will be included for practical team use, restricted to local development. New files will cover Prometheus and Grafana deployments, Kubernetes ServiceMonitor, and observability documentation. Existing docker-compose and backend config files will be updated.

Postgres pool metrics will be exposed via GaugeFuncs. The worker Dockerfile will expose port 8082. Deployment manifests for the API, WebSocket, and Worker services will be updated. Documentation will be added to README, DEPLOYMENT.md, ARCHITECTURE.md, and .env.example.

The Postgres pool metrics will be registered through a new RegisterDB method on the Metrics struct. This replaces the unused PostgresConns field and exposes gauge functions for acquired connections and other pool statistics.

Idle and maximum connection counts will be tracked for the Postgres pool. Redis metrics were considered but skipped to avoid adding a new dependency. The default HTTP duration buckets are sufficient. A test for the /metrics endpoint will be added to the HTTP API package. Care must be taken with the global Prometheus registry to prevent collisions during parallel test runs.

The test will mount promhttp.Handler() directly instead of calling NewMetrics, avoiding registry collisions while still exposing Go runtime metrics.

The metrics test will instantiate the Echo router via New() using Deps that supply Handlers for routes. It will then verify the /metrics endpoint returns HTTP 200 and includes Prometheus runtime metrics such as go_goroutines.

The metrics test needs real handler stubs to avoid panics from nil dependencies. A minimal Echo router with wrapped promhttp.Handler is too trivial. The Handlers struct fields need review to build a proper test fixture.


Checking the Health handler and whether metrics middleware panics on nil Metrics.

Making metrics middleware nil-safe. Choosing Prometheus v2.55.1 and Grafana 11.5.2 for stability. Preparing a compact Grafana dashboard JSON.

Adding recording and alert rules for Prometheus. Including an optional Kubernetes ServiceMonitor. Updating the worker deployment with port 8082, metrics service, and annotations. Exposing Prometheus and Grafana ports in docker-compose.dev.yml. Deciding whether to keep Prometheus ports in the main compose or only in the dev file.

Prometheus and Grafana will be placed in the main docker-compose.yml as part of the local observability stack. Port mappings for these services will remain in docker-compose.dev.yml. The frontend runs internally on port 3000, while Grafana maps its internal 3000 port to 3001 externally.

Nginx will explicitly deny /metrics requests to prevent them from reaching the frontend. Direct API access via the worker port remains available for local scraping. The metrics HTTP handler will be implemented in observe/metrics.go.

The metrics handler will use promhttp.Handler() directly to avoid Echo dependencies. A chat_build_info gauge will be added. The Grafana dashboard will include panels for request rate, error rate, latency, WebSocket connections, message counts, queue jobs, goroutines, and Postgres connections. Prometheus queries will aggregate HTTP request rates by job and status.

Defining exact Prometheus queries for the Grafana dashboard: 95th percentile latency, WebSocket connections, message rates, queue jobs, goroutines, and Postgres pool connections. Jobs will be labeled as chat-api, chat-websocket, and chat-worker. Custom metrics will keep their existing names rather than adding a chat_ prefix, since no external scrapers currently exist.

Adding a chat_ prefix to custom metrics to distinguish them from system exporters. Existing metric names are generic, so this small change is acceptable for a new project.

Existing metric names will be kept unchanged. The Postgres connection gauge was never registered and will be fixed. A nil check will be added to the metrics middleware. RegisterDB panics if called twice, so tests that instantiate Runtime multiple times must be checked.

Beginning implementation of Prometheus integration. Files will be written in parallel batches.

Drafting a Grafana dashboard JSON. Fixing metrics middleware to skip /metrics and handle nil values. Adding a Worker Dockerfile EXPOSE 8082. Creating observe/metrics.go with RegisterDB and Serve functions. Configuring METRICS_ADDR to enable a dedicated metrics server on :8082. API and WebSocket servers will continue using the main HTTP port.

Settled on a consistent metrics port per service: API on :8080, WebSocket on :8081, and Worker on METRICS_ADDR. Will implement a standalone ListenAndServe helper in the observe package so the worker can run metrics independently without Echo.

The worker will launch its metrics server in a goroutine alongside the main worker loop. A buffered error channel will let the worker exit immediately if metrics binding fails.

Reconsidering the worker startup strategy. A goroutine that calls os.Exit on metrics failure is too blunt. Using a channel to signal errors risks letting the worker run without scraping. Need a cleaner way to handle metrics startup failures.

Decided to mirror the API Serve startup pattern for the worker metrics server. Will split the metrics server code into a new observe/http.go file to keep observe/metrics.go focused. For Grafana, defaulting to admin/admin credentials with anonymous access enabled for local convenience; the dashboard JSON will be written carefully with a matching datasource UID. Docker Compose does not need extra hosts because internal service names resolve via Docker network DNS.

Prometheus will wait for the API, WebSocket, and Worker services to start. The Worker will get a /healthz endpoint on port 8082 once the metrics server is added. Nginx will explicitly deny /metrics requests to prevent accidental scraping by the Next.js application. Ready to implement all changes now.

```
gofmt -w internal/platform/observe/metrics.go internal/platform/config/config.go internal/httpapi/middleware.go internal/httpapi/router.go internal/httpapi/metrics_test.go internal/app/app.go cmd/worker/main.go && go test ./internal/httpapi ./internal/platform/observe ./internal/platform/config ./internal/app -count=1
```

```
gofmt -w internal/httpapi/middleware.go && go test ./internal/httpapi ./internal/platform/observe ./internal/platform/config -count=1
```

```
go vet ./... && go test ./... -count=1
```