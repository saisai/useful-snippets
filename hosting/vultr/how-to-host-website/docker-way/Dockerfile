# ==========================================
# STAGE 1: Builder (Dependencies)
# ==========================================
FROM python:3.11-slim AS builder

WORKDIR /app

# Prevent Python from writing .pyc files & unbuffer logs
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1

# Install build essential if compiling native C-extensions
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements and install to user home directory
COPY requirements.txt .
RUN pip install --no-cache-dir --user -r requirements.txt gunicorn

# ==========================================
# STAGE 2: Lean Runtime
# ==========================================
FROM python:3.11-slim AS runner

WORKDIR /app

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PATH="/nonroot/.local/bin:${PATH}"

# Security: Create non-privileged system user/group
RUN groupadd -g 10001 appgroup && \
    useradd -u 10001 -g appgroup -m -d /nonroot appuser

# Copy installed packages from builder
COPY --from=builder /root/.local /nonroot/.local

# Copy app code and assign ownership
COPY --chown=appuser:appgroup . .

# Drop privileges to non-root user
USER 10001:10001

EXPOSE 5000

# Serve with Gunicorn (3 worker processes)
CMD ["gunicorn", "--bind", "0.0.0.0:5000", "--workers", "3", "app:app"]
