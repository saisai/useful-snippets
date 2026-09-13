```
go version && node --version && npm --version && docker --version 2>/dev/null; which go node npm docker 2>/dev/null
```

```
# Check available package managers and node install options
ls /usr/local/bin /home/username/.nvm 2>/dev/null; command -v nvm fnm n; ls /usr/bin/node* 2>/dev/null; curl -fsSL https://nodejs.org/dist/index.json 2>/dev/null | python3 -c "import json,sys; d=json.load(sys.stdin); lts=[x for x in d if x.get('lts')]; print(lts[0]['version'] if lts else 'none')" 2>/dev/null; python3 --version
```

```
# Install Node.js LTS locally without sudo
mkdir -p "$HOME/.local"
cd /tmp
NODE_VERSION="v22.19.0"
curl -fsSL "https://nodejs.org/dist/${NODE_VERSION}/node-${NODE_VERSION}-linux-x64.tar.xz" -o node.tar.xz && tar -xJf node.tar.xz && mkdir -p "$HOME/.local" && cp -r node-${NODE_VERSION}-linux-x64/* "$HOME/.local/" && export PATH="$HOME/.local/bin:$PATH" && node --version && npm --version
```

```
export PATH="$HOME/.local/bin:$PATH"
mkdir -p backend/cmd/server \
  backend/internal/{config,handler,service,repository,middleware,model,dto,auth,database,cache,validation,logger,mailer,httpx,security} \
  backend/migrations \
  backend/docs \
  backend/tests/integration \
  frontend \
  nginx/certs \
  docker
# Scaffold Next.js with non-interactive flags
cd /home/username/login-signup-api
npx --yes create-next-app@latest frontend --typescript --tailwind --eslint --app --no-src-dir --import-alias "@/*" --use-npm --yes
```

```
export PATH="$HOME/.local/bin:$PATH"
cd /home/username/login-signup-api/backend && go mod tidy
```

```
export PATH="$HOME/.local/bin:$PATH"
export GOSUMDB=off
export GOPROXY=https://proxy.golang.org,direct
cd /home/username/login-signup-api/backend && go mod tidy && go vet ./...
```

```
export GOSUMDB=off GOPROXY=https://proxy.golang.org,direct
cd /home/username/login-signup-api/backend && go vet ./... && go test ./...
```

```
export PATH="$HOME/.local/bin:$PATH"
cd /home/username/login-signup-api/frontend
npm install -D @types/node@22 vitest @vitejs/plugin-react jsdom @testing-library/react @testing-library/user-event @testing-library/jest-dom prettier eslint-config-prettier --legacy-peer-deps
```

```
export PATH="$HOME/.local/bin:$PATH"
export GOSUMDB=off
cd /home/username/login-signup-api/backend && go test ./... && go vet ./...
cd /home/username/login-signup-api/frontend && npm test
```

```
export PATH="$HOME/.local/bin:$PATH"
cd /home/username/login-signup-api/frontend
npm install -D vite --legacy-peer-deps
npm test
```

```
export PATH="$HOME/.local/bin:$PATH"
cd /home/username/login-signup-api/frontend && npm test
```

```
export PATH="$HOME/.local/bin:$PATH"
cd /home/username/login-signup-api/frontend && npm test
```

```
export PATH="$HOME/.local/bin:$PATH"
cd /home/username/login-signup-api/frontend && npm test
```

```
export PATH="$HOME/.local/bin:$PATH"
cd /home/username/login-signup-api/frontend && npm run build
```

```
export GOSUMDB=off
cd /home/username/login-signup-api/backend && go test ./... && go vet ./... && test -f go.sum && echo "go.sum ok"
ls /home/username/login-signup-api/backend/go.sum | head -1
cp -n /home/username/login-signup-api/.env.example /home/username/login-signup-api/.env
```

```
cd /home/username/login-signup-api && docker compose up --build -d
```

```
export PATH="$HOME/.local/bin:$PATH"
cd /home/username/login-signup-api/frontend && npm test
```

```
export PATH="$HOME/.local/bin:$PATH"
cd /home/username/login-signup-api/frontend && npm run build
```

```
export GOSUMDB=off
cd /home/username/login-signup-api/backend && go test ./... && go vet ./... && test -f go.sum && echo "go.sum ok"
ls /home/username/login-signup-api/backend/go.sum | head -1
cp -n /home/username/login-signup-api/.env.example /home/username/login-signup-api/.env
```

```
cd /home/username/login-signup-api && docker compose up -d
```

```
set -e
echo "== health =="
curl -sS -D- http://localhost:8088/health | head -20
echo "== ready =="
curl -sS http://localhost:8088/ready
echo
echo "== csrf =="
curl -sS -c /tmp/authcookies -b /tmp/authcookies http://localhost:8088/api/v1/auth/csrf
echo
CSRF=$(python3 - <<'PY'
import http.cookiejar
cj=http.cookiejar.MozillaCookieJar('/tmp/authcookies')
cj.load(ignore_discard=True, ignore_expires=True)
for c in cj:
    if c.name=='csrf_token':
        print(c.value)
PY
)
echo "csrf=$CSRF"
echo "== register =="
EMAIL="user$(date +%s)@example.com"
curl -sS -D- -c /tmp/authcookies -b /tmp/authcookies -H "Content-Type: application/json" -H "X-CSRF-Token: $CSRF" \
  -d "{\"email\":\"$EMAIL\",\"password\":\"StrongPass123\",\"first_name\":\"Ada\",\"last_name\":\"Lovelace\"}" \
  http://localhost:8088/api/v1/auth/register
echo
echo "== login =="
curl -sS -D- -c /tmp/authcookies -b /tmp/authcookies -H "Content-Type: application/json" -H "X-CSRF-Token: $CSRF" \
  -d "{\"email\":\"$EMAIL\",\"password\":\"StrongPass123\"}" \
  http://localhost:8088/api/v1/auth/login
echo
echo "== me =="
curl -sS -D- -c /tmp/authcookies -b /tmp/authcookies http://localhost:8088/api/v1/auth/me
echo
echo "== frontend =="
curl -sS -o /dev/null -w "%{http_code}\n" http://localhost:8088/login
echo "== docs =="
curl -sS -o /dev/null -w "%{http_code}\n" http://localhost:8088/docs
echo "$EMAIL"
```

```
# Refresh using updated CSRF from login
CSRF=$(python3 - <<'PY'
import http.cookiejar
cj=http.cookiejar.MozillaCookieJar('/tmp/authcookies')
cj.load(ignore_discard=True, ignore_expires=True)
for c in cj:
    if c.name=='csrf_token':
        print(c.value)
PY
)
echo "== refresh =="
curl -sS -c /tmp/authcookies -b /tmp/authcookies -H "Content-Type: application/json" -H "X-CSRF-Token: $CSRF" \
  -d '{}' http://localhost:8088/api/v1/auth/refresh
echo
echo "== sessions =="
curl -sS -c /tmp/authcookies -b /tmp/authcookies http://localhost:8088/api/v1/auth/sessions
echo
echo "== csrf reject =="
curl -sS -o /tmp/csrfbody -w "%{http_code}" -c /tmp/authcookies -b /tmp/authcookies -H "Content-Type: application/json" -H "X-CSRF-Token: invalid" \
  -d '{}' http://localhost:8088/api/v1/auth/logout
echo
cat /tmp/csrfbody
echo
echo "== logout =="
curl -sS -c /tmp/authcookies -b /tmp/authcookies -H "Content-Type: application/json" -H "X-CSRF-Token: $CSRF" \
  -d '{}' http://localhost:8088/api/v1/auth/logout
echo
echo "== me after logout =="
curl -sS -o /tmp/mebody -w "%{http_code}" -c /tmp/authcookies -b /tmp/authcookies http://localhost:8088/api/v1/auth/me
echo
cat /tmp/mebody
echo
echo "== backend logs verification email =="
docker compose -f /home/username/login-signup-api/docker-compose.yml logs backend --tail 40 | grep -E "user_registered|email_verification|login_success|refresh_token|logout" | tail -20
```

```
CSRF=$(python3 - <<'PY'
import http.cookiejar
cj=http.cookiejar.MozillaCookieJar('/tmp/authcookies')
cj.load(ignore_discard=True, ignore_expires=True)
for c in cj:
    if c.name=='csrf_token':
        print(c.value)
PY
)
echo "== logout =="
curl -sS -c /tmp/authcookies -b /tmp/authcookies -H "Content-Type: application/json" -H "X-CSRF-Token: $CSRF" \
  -d '{}' http://localhost:8088/api/v1/auth/logout
echo
echo "== me after logout =="
curl -sS -o /tmp/mebody -w "%{http_code}\n" -c /tmp/authcookies -b /tmp/authcookies http://localhost:8088/api/v1/auth/me
cat /tmp/mebody
echo
```

```
export PATH="$HOME/.local/bin:$PATH"
cd /home/username/login-signup-api/frontend && npm run lint
```

I'll add a GitHub Actions workflow that runs the backend and frontend checks this repo already uses.

I'll add a CI workflow with parallel backend, frontend, and integration jobs, plus a Docker Compose build check.

I’ll bind the stack on 0.0.0.0, allow same-host origins so LAN IP:port works, and point public URLs at this machine’s address.

```
export GOSUMDB=off
cd /home/username/login-signup-api/backend && go test ./internal/middleware ./internal/auth ./internal/config
echo "---"
ip -4 route get 1.1.1.1
hostname -I
ss -tlnp | grep -E ':80 |:8088 |:8080 ' || true
docker compose -f /home/username/login-signup-api/docker-compose.yml ps
```

```
cd /home/username/login-signup-api && docker compose up -d --build backend nginx
```

```
cd /home/username/login-signup-api && docker compose up -d --no-deps --build frontend
```

```
which kubectl kustomize 2>/dev/null; cp /home/snp/login-signup-api/k8s/overlays/local/secret.env.example /home/snp/login-signup-api/k8s/overlays/local/secret.env; cp /home/snp/login-signup-api/k8s/overlays/production/secret.env.example /home/snp/login-signup-api/k8s/overlays/production/secret.env; kubectl kustomize /home/snp/login-signup-api/k8s/overlays/local > /tmp/northline-local.yaml 2>&1; echo LOCAL_EXIT:$?; kubectl kustomize /home/snp/login-signup-api/k8s/overlays/production > /tmp/northline-production.yaml 2>&1; echo PROD_EXIT:$?
```

```
(command -v docker && docker run --rm -v /home/snp/login-signup-api:/src -w /src registry.k8s.io/kustomize/kustomize:v5.6.0 build k8s/overlays/local > /tmp/northline-local.yaml && docker run --rm -v /home/snp/login-signup-api:/src -w /src registry.k8s.io/kustomize/kustomize:v5.6.0 build k8s/overlays/production > /tmp/northline-production.yaml && echo OK && wc -l /tmp/northline-local.yaml /tmp/northline-production.yaml) || true
```

```
docker run --rm -v /home/snp/login-signup-api:/src -w /src registry.k8s.io/kustomize/kustomize:v5.6.0 build k8s/overlays/local >/tmp/northline-local.yaml && docker run --rm -v /home/snp/login-signup-api:/src -w /src registry.k8s.io/kustomize/kustomize:v5.6.0 build k8s/overlays/production >/tmp/northline-production.yaml && echo OK && rg -n "kind: " /tmp/northline-local.yaml /tmp/northline-production.yaml | head -40
```