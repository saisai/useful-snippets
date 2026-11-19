1. Role and objective
You are a senior backend + platform engineer. Build a production-grade product catalog service for an e-commerce platform, plus a storefront frontend that consumes it.

Ship working, tested, runnable code — not scaffolding, not TODOs. Every acceptance criterion in §10 must pass before you declare done.

Scale target: <<< e.g. 50k SKUs, 2k RPS read / 50 RPS write, p99 < 150ms >>> Team size / ownership: <<< e.g. 3 engineers, single repo >>>

2. Stack (verify latest stable before pinning)
Layer	Choice
Language	Go (latest stable; use the toolchain directive in go.mod)
HTTP framework	Echo v4
Database	PostgreSQL 16+
Cache / locks	Redis 7+
Edge	Nginx (TLS termination, rate limit, gzip/brotli, static)
Frontend	Next.js (latest, App Router) + TypeScript strict
Styling	Tailwind CSS + shadcn/ui
Migrations	goose or golang-migrate — pick one, justify in the ADR
DB access	pgx/v5 + sqlc (no ORM)
Contracts	protobuf + buf for gRPC; OpenAPI 3.1 for REST
Do not assume version numbers from memory. Check the current stable release of each dependency before writing go.mod / package.json, and pin exact versions. If a pinned version is unavailable, say so rather than silently downgrading.

3. Protocol strategy — use the right one per boundary
This is a deliberate design constraint, not a buffet. Justify any deviation in an ADR.

REST (public, via Echo) — the browser/mobile-facing product API. Cacheable GETs, ETags, conventional status codes, cursor pagination. This is the only surface Nginx exposes publicly.
gRPC (internal, service-to-service) — the ProductService contract consumed by other backend services (cart, search indexer, pricing). Strongly typed, streaming for bulk catalog sync, protobuf-versioned.
GraphQL (BFF layer, optional but required if the storefront needs it) — a single read-optimized gateway for the storefront when a product page needs product + variants + inventory + reviews in one round trip. Read-only. Mutations stay on REST. Enforce query depth and complexity limits, and persisted queries in production.
Both REST handlers and gRPC servers must be thin adapters over the same service layer. Business logic lives in exactly one place.

4. Domain model
Implement at minimum:

Product — id (UUID v7), slug (unique), title, description, brand, status (draft|active|archived), attributes (JSONB), timestamps, soft delete.
Variant — product_id FK, SKU (unique), option values, price (integer minor units + ISO-4217 currency — never float), weight/dims, barcode.
Inventory — variant_id, quantity_available, quantity_reserved, warehouse_id, optimistic-locked via version column.
Category — nested set or ltree for tree queries; many-to-many with products.
Media — ordered images per product/variant, with a position column.
PriceHistory — append-only audit of price changes.
Rules: money is BIGINT minor units. All timestamps TIMESTAMPTZ in UTC. Every table has created_at, updated_at. Foreign keys with explicit ON DELETE behavior. Indexes on every column you filter or sort by, plus a GIN index on attributes and a tsvector index for full-text search.

5. REST API surface
GET    /api/v1/products                 list, filter, cursor-paginate
GET    /api/v1/products/:slug           detail, with variants + media
POST   /api/v1/products                 create (admin)
PATCH  /api/v1/products/:id             partial update (admin)
DELETE /api/v1/products/:id             soft delete (admin)
POST   /api/v1/products/:id/variants    add variant (admin)
PATCH  /api/v1/variants/:id/inventory   adjust stock (admin, idempotent)
GET    /api/v1/categories               category tree
GET    /api/v1/search?q=                full-text + faceted
GET    /healthz  /readyz  /metrics
Requirements for every endpoint:

Request validation with typed DTOs — never bind straight into domain models.
Cursor pagination (opaque base64 cursor), never OFFSET on large tables.
Filtering: category, price range, brand, attributes, availability. Whitelist sortable fields.
Idempotency-Key header support on all POST/PATCH mutations, backed by Redis.
RFC 7807 application/problem+json error bodies with a stable type URI and a correlation ID.
ETag + Cache-Control on GETs; return 304 on If-None-Match.
Retry-After on 429 and 503.
6. Caching strategy (Redis)
Cache-aside for product detail and category tree. Key scheme: product:v1:{slug}, versioned so a schema change invalidates cleanly.
Write-through invalidation on mutation — invalidate by explicit key, plus a tag set (product:tags:{category_id}) for bulk busts.
Stampede protection: single-flight via Redis SETNX lock + jittered TTL (base TTL ± 10%).
Negative caching for 404s with a short TTL so missing slugs don't hammer Postgres.
Rate limiting with a sliding-window or token-bucket Lua script, per-IP and per-API-key.
Distributed lock for inventory adjustments (Redlock-style or a single-instance SET NX PX — document which, and its failure mode).
Redis must be treated as optional for correctness: if Redis is down, the service degrades to direct Postgres reads and stays up. Prove this with a test.
7. Non-functional requirements
Config — env vars only, validated at boot, fail fast on missing/invalid. No secrets in the repo or image. .env.example checked in.

Observability

Structured JSON logs via log/slog, with request ID propagated through context and into logs, traces, and error responses.
OpenTelemetry traces spanning Nginx → Echo → service → pgx/Redis.
Prometheus metrics: RED (rate/errors/duration) per route, plus pool saturation, cache hit ratio, queue depths.
Resilience

Context deadlines on every DB and Redis call, derived from an inbound request timeout.
Connection pool tuned and explicitly configured (MaxConns, MaxConnLifetime, MaxConnIdleTime).
Graceful shutdown: stop accepting, drain in-flight with a timeout, close pools.
Circuit breaker on downstream calls.
Panic-recovery middleware that logs a stack trace and returns a clean 500.
Security

JWT auth with RS256, JWKS rotation, short-lived access tokens. Role-based guards on admin routes.
Parameterized queries only (sqlc gives this for free — verify no string-built SQL exists).
Security headers: HSTS, CSP, X-Content-Type-Options, Referrer-Policy. Strict CORS allowlist.
Request body size limits and a global request timeout.
Run as non-root in a distroless or scratch image.
Testing — target ≥80% on the service layer.

Unit tests for business logic with mocked repositories.
Integration tests against real Postgres and Redis via testcontainers-go. No mocked DB in integration tests.
Contract tests for gRPC against the compiled proto.
One end-to-end happy path per critical flow.
Table-driven, t.Parallel() where safe, and a go test -race run in CI.
CI/CD — GitHub Actions: lint (golangci-lint with a committed config), go vet, race tests, govulncheck, build, image scan (Trivy), push. Migrations run as a separate job/step, never on app boot.

8. Repo layout
/cmd/api            # Echo HTTP server entrypoint
/cmd/grpc           # gRPC server entrypoint
/cmd/migrate        # migration runner
/internal/domain    # entities, value objects, domain errors — zero deps
/internal/service   # use cases; the single source of business logic
/internal/repo      # sqlc-generated + hand-written queries
/internal/cache     # Redis adapters, keys, locks
/internal/transport/http   # Echo handlers, DTOs, middleware
/internal/transport/grpc   # gRPC servers
/internal/platform  # config, logger, telemetry, db, redis
/api/proto          # .proto files
/api/openapi        # OpenAPI 3.1 spec (generated or hand-written, kept in sync)
/migrations
/deploy             # docker-compose, nginx.conf, Dockerfiles, k8s manifests
/web                # Next.js app
/docs/adr           # architecture decision records
Dependency rule: domain imports nothing internal. service imports domain only. transport and repo depend inward, never on each other. Wire dependencies explicitly in main — no global state, no service locator, no init() side effects.

9. Frontend (Next.js + Tailwind + shadcn/ui)
App Router, Server Components by default; client components only where interactivity demands it.
Server-side data fetching for product list and detail pages with Next's cache + tag-based revalidation mirroring the Redis tags.
ISR for product pages; revalidateTag called from a webhook on product mutation.
shadcn/ui components — install via CLI into the repo, don't wrap a component library as a dependency.
Pages: product listing with faceted filters and URL-synced state, product detail with variant selector, cart drawer, admin CRUD table.
Skeleton loading states, optimistic UI on cart actions, error boundaries per route segment.
Generated TypeScript types from the OpenAPI spec — no hand-written API types that can drift.
Accessibility: keyboard nav, focus management in dialogs, aria-live for cart updates, ≥4.5:1 contrast.
Images via next/image with explicit sizes and a remote pattern allowlist.
Lighthouse ≥90 on performance and accessibility for the product detail route.
10. Acceptance criteria
Done means all of these hold:

docker compose up brings up Postgres, Redis, the API, the gRPC server, Nginx, and the frontend, with migrations applied and the catalog seeded.
make test passes, including race detection and testcontainers integration tests.
make lint is clean with no suppressed rules other than ones justified in a comment.
The storefront loads product list and detail against the running API with no mocked data.
Killing the Redis container leaves the API serving correct responses (degraded latency, not errors).
A load test (k6 or vegeta) at the §1 target hits the stated p99, with results committed under /docs.
/metrics exposes RED metrics and a trace ID is visible end to end for a sample request.
No secrets, no hardcoded connection strings, no panic() outside main.
ADRs exist for: protocol split, migration tool choice, caching strategy, and the auth model.
README.md gets a new engineer running locally in under 10 minutes.
11. How to work
Start by proposing the schema and the proto/OpenAPI contracts. Wait for my approval before implementing.
Then build in this order: migrations → domain → repo → service → REST → gRPC → Nginx → frontend → GraphQL BFF (if needed) → load test.
After each phase, show me what changed and what you decided, then continue.
If a requirement here is ambiguous or you think it's wrong, say so and propose an alternative — don't silently reinterpret it.
Never stub a function and move on. If something can't be completed, stop and tell me why.
Flag any place where you're unsure a library version, API, or behavior is current rather than guessing.


I read your request as wanting the prompt — a spec to hand to a coding agent — rather than the code itself. Two things I made opinionated calls on:

Protocol split. Rather than "use whichever," the spec assigns each one a boundary: REST for the public browser-facing API, gRPC for internal service-to-service, GraphQL only as a read-only BFF when a page genuinely needs to fan out. All three sit on one shared service layer so logic doesn't fork.

Version pinning. The prompt tells the agent to check current stable releases rather than write versions from memory — that's the most common way these specs rot.

If you actually wanted the implementation rather than the prompt, say the word and I'll start on the schema and contracts.