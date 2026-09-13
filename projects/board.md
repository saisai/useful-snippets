```
docker ps --format '{{.Names}}\t{{.Image}}\t{{.Status}}' ; echo '---' ; curl -sS http://127.0.0.1:3000/_next/static/chunks/14mrh2-p_w84d.js | rg -o '.{20}Register.{20}|.{20}Log in.{20}|.{20}>Login.{20}' | head
```

```
for f in $(curl -sS http://127.0.0.1:3000/ | rg -o '/_next/static/chunks/[^"]+\.js'); do
  hits=$(curl -sS "http://127.0.0.1:3000$f" | rg -o 'Register' | head -c 20)
  if [ -n "$hits" ]; then echo "$f has Register"; fi
done
```

```
docker compose up -d --build frontend
```

```
for i in 1 2 3 4 5 6 7 8 9 10; do
  code=$(curl -sS -o /dev/null -w "%{http_code}" http://127.0.0.1:3000/ || true)
  if [ "$code" = "200" ]; then echo "up after $i"; break; fi
  echo "wait $i code=$code"
  sleep 2
done
html=$(curl -sS http://127.0.0.1:3000/)
echo "$html" | rg -o '/_next/static/chunks/[^"]+\.js' | sort -u > /tmp/chunks.txt
echo "chunks:" $(wc -l < /tmp/chunks.txt)
# Search for header-style Register vs Login CTA in JS
python3 - <<'PY'
import urllib.request, re
chunks=open("/tmp/chunks.txt").read().split()
pat_register=re.compile(r'>Register<|Register</')
pat_login_cta=re.compile(r'>Login<')
pat_log_in=re.compile(r'>Log in<')
for path in chunks:
    url="http://127.0.0.1:3000"+path
    try:
        data=urllib.request.urlopen(url, timeout=10).read().decode("utf-8","replace")
    except Exception as e:
        print("fail", path, e)
        continue
    if "Register" in data or "Login" in data or "Log in" in data:
        print(path)
        # show nearby snippets
        for m in re.finditer(r".{0,40}Register.{0,40}", data):
            s=m.group(0).replace("\n"," ")
            if "Registered" in s: continue
            print("  REG:", s[:120])
        for m in re.finditer(r".{0,40}>Login<.{0,40}|children:\"Login\"", data):
            print("  LOGIN:", m.group(0)[:120].replace("\n"," "))
        for m in re.finditer(r".{0,40}>Log in<.{0,40}|children:\"Log in\"", data):
            print("  LOG IN:", m.group(0)[:120].replace("\n"," "))
PY
```

```
docker compose ps --format '{{.Name}} {{.Status}} {{.Ports}}' 2>/dev/null; echo '---'; ss -tlnp 2>/dev/null | grep -E ':3000|:8080' || netstat -tlnp 2>/dev/null | grep -E ':3000|:8080' || true
```

```
test -d node_modules && echo 'has node_modules' || echo 'no node_modules'; npx tsc --noEmit --pretty false 2>&1 | tail -50
```

```
npx tsc --noEmit --incremental false --pretty false
```

```
npx vitest run src/components/ApplyList.test.tsx
```

```
npx vitest run src/components/ApplyList.test.tsx
```