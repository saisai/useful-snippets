
mkdir -p \
  /home/username/rag-system/backend/app/{api/v1,core,db/models,schemas,services,workers/tasks,repositories,integrations,middleware} \
  /home/username/rag-system/backend/migrations/versions \
  /home/username/rag-system/backend/tests/{unit,integration,e2e} \
  /home/username/rag-system/frontend/src/{components,pages,layouts,hooks,services,api,types,schemas,store,lib} \
  /home/username/rag-system/frontend/public \
  /home/username/rag-system/infrastructure/{docker,nginx/certs,otel,jaeger} \
  /home/username/rag-system/scripts


chmod +x /home/username/rag-system/scripts/generate-certs.sh && bash /home/username/rag-system/scripts/generate-certs.sh && cp -n /home/username/rag-system/.env.example /home/username/rag-system/.env || true

python3 -m venv /home/username/rag-system/backend/.venv && /home/username/rag-system/backend/.venv/bin/pip install -U pip && /home/username/rag-system/backend/.venv/bin/pip install -e "/home/username/rag-system/backend[dev]"

cd /home/username/rag-system/frontend && npm install

which python3 python3.12 pip3 docker node npm 2>/dev/null; python3 --version; apt-cache policy python3.12-venv python3-venv python3-pip nodejs npm 2>/dev/null | head -80; ls /usr/bin/python*

docker --version && docker compose version && ls /home/username/rag-system/backend/.venv 2>/dev/null; ls /usr/local/bin/uv /home/username/.local/bin/uv 2>/dev/null


docker run --rm -v /home/username/rag-system/backend:/app -w /app python:3.12-slim-bookworm bash -lc "pip install -q -e '.[dev]' && pytest -m 'not integration and not e2e' -q"

chmod +x /home/username/rag-system/scripts/generate-certs.sh && bash /home/username/rag-system/scripts/generate-certs.sh && cp -n /home/username/rag-system/.env.example /home/username/rag-system/.env || true


python3 -m venv /home/username/rag-system/backend/.venv && /home/username/rag-system/backend/.venv/bin/pip install -U pip && /home/username/rag-system/backend/.venv/bin/pip install -e "/home/username/rag-system/backend[dev]"

cd /home/username/rag-system/frontend && npm install

which python3 python3.12 pip3 docker node npm 2>/dev/null; python3 --version; apt-cache policy python3.12-venv python3-venv python3-pip nodejs npm 2>/dev/null | head -80; ls /usr/bin/python*

docker --version && docker compose version && ls /home/username/rag-system/backend/.venv 2>/dev/null; ls /usr/local/bin/uv /home/username/.local/bin/uv 2>/dev/null


docker run --rm -v /home/username/rag-system/backend:/app -w /app python:3.12-slim-bookworm bash -lc "pip install -q -e '.[dev]' && pytest -m 'not integration and not e2e' -q"

docker ps --format '{{.ID}} {{.Image}} {{.Status}}' ; ps -p 117858 -o pid,etime,cmd || true

docker logs --tail 40 1f29e4ad56c6 2>&1

docker logs --tail 40 1f29e4ad56c6 2>&1

docker top 1f29e4ad56c6 -eo pid,etime,pcpu,pmem,cmd 2>/dev/null | head -20; docker exec 1f29e4ad56c6 bash -lc 'ps aux | head -20; ls -la /tmp 2>/dev/null | head; ls ~/.cache/pip 2>/dev/null | head'

docker run --rm -v /home/username/rag-system/backend:/app -w /app python:3.12-slim-bookworm bash -lc "pip install -q -e '.[dev]' --root-user-action=ignore && pytest -m 'not integration and not e2e' -q"

docker top 1f29e4ad56c6 -eo pid,etime,pcpu,pmem,cmd 2>/dev/null | head -20; docker exec 1f29e4ad56c6 bash -lc 'ps aux | head -20; ls -la /tmp 2>/dev/null | head; ls ~/.cache/pip 2>/dev/null | head'

docker run --rm -v /home/username/rag-system/backend:/app -w /app python:3.12-slim-bookworm bash -lc "pip install -q -e '.[dev]' --root-user-action=ignore && pytest -m 'not integration and not e2e' -q"

docker ps --filter ancestor=python:3.12-slim-bookworm --format '{{.ID}} {{.Status}}'

test -f /home/username/rag-system/.env && echo HAS_ENV || echo NO_ENV; ls -la /home/username/rag-system/infrastructure/nginx/certs/

docker run --rm -v /home/username/rag-system/frontend:/app -w /app node:22-alpine sh -lc "npm install && npm run typecheck"

head -n 10 /home/username/.cursor/projects/home-username-rag-system/terminals/*.txt 2>/dev/null; echo "---"; docker compose ps 2>/dev/null || docker-compose ps 2>/dev/null

echo "=== HTTPS /docs ===" && curl -k -sS -D - -o /tmp/docs_body.html "https://localhost/docs" | head -n 40 && echo "=== BODY HEAD ===" && head -c 2000 /tmp/docs_body.html && echo && echo "=== HTTPS /openapi.json ===" && curl -k -sS -o /dev/null -w "status:%{http_code} size:%{size_download}\n" "https://localhost/openapi.json" && echo "=== HTTPS / ===" && curl -k -sS -o /dev/null -w "status:%{http_code}\n" "https://localhost/" && echo "=== backend /docs directly ===" && docker compose exec -T backend curl -sS -D - -o /tmp/backend_docs.html "http://127.0.0.1:8000/docs" | head -n 30 && echo "=== nginx error log ===" && docker compose logs nginx --tail=50