#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
RUN_DIR="$ROOT_DIR/.run"
BACKEND_ENV_FILE="$ROOT_DIR/backend/.env"

mkdir -p "$RUN_DIR"

DB_PID=""
API_PID=""
WEB_PID=""

cleanup() {
  local exit_code=$?
  if [[ -n "$WEB_PID" ]] && kill -0 "$WEB_PID" 2>/dev/null; then
    kill "$WEB_PID" 2>/dev/null || true
  fi
  if [[ -n "$API_PID" ]] && kill -0 "$API_PID" 2>/dev/null; then
    kill "$API_PID" 2>/dev/null || true
  fi
  if [[ -n "$DB_PID" ]] && kill -0 "$DB_PID" 2>/dev/null; then
    kill "$DB_PID" 2>/dev/null || true
  fi

  wait 2>/dev/null || true
  exit $exit_code
}

trap cleanup EXIT INT TERM

read_env_value() {
  local key="$1"
  local file="$2"
  if [[ ! -f "$file" ]]; then
    return 0
  fi
  grep -E "^${key}=" "$file" | head -n1 | cut -d'=' -f2-
}

DATABASE_URL_VALUE="$(read_env_value "DATABASE_URL" "$BACKEND_ENV_FILE")"
if [[ -z "$DATABASE_URL_VALUE" ]]; then
  DATABASE_URL_VALUE="postgres://postgres:postgres@127.0.0.1:55432/career_compass"
fi

API_PORT="$(read_env_value "PORT" "$BACKEND_ENV_FILE")"
if [[ -z "$API_PORT" ]]; then
  API_PORT="4000"
fi

DB_HOST="$(node -e "const u=new URL(process.argv[1]); process.stdout.write(u.hostname);" "$DATABASE_URL_VALUE")"
DB_PORT="$(node -e "const u=new URL(process.argv[1]); process.stdout.write(String(u.port || 5432));" "$DATABASE_URL_VALUE")"

should_use_embedded_db=false
if [[ "$DB_HOST" == "127.0.0.1" && "$DB_PORT" == "55432" ]]; then
  should_use_embedded_db=true
fi

cd "$ROOT_DIR"

if [[ "$should_use_embedded_db" == "true" ]]; then
  echo "[dev-all] Starting embedded PostgreSQL on $DB_HOST:$DB_PORT"
  npm --prefix backend run db:embedded >"$RUN_DIR/db.log" 2>&1 &
  DB_PID=$!

  for _ in {1..90}; do
    if node -e "const net=require('net'); const host=process.argv[1]; const port=Number(process.argv[2]); const socket=net.connect({host,port},()=>{socket.end();process.exit(0);}); socket.on('error',()=>process.exit(1)); setTimeout(()=>process.exit(1),500);" "$DB_HOST" "$DB_PORT"; then
      echo "[dev-all] Embedded PostgreSQL is ready"
      break
    fi

    if ! kill -0 "$DB_PID" 2>/dev/null; then
      echo "[dev-all] Embedded PostgreSQL exited unexpectedly. Check $RUN_DIR/db.log"
      exit 1
    fi

    sleep 1
  done
else
  echo "[dev-all] Using external PostgreSQL at $DB_HOST:$DB_PORT"
fi

echo "[dev-all] Starting backend API on port $API_PORT"
npm --prefix backend run dev >"$RUN_DIR/backend.log" 2>&1 &
API_PID=$!

for _ in {1..90}; do
  if curl -fsS "http://localhost:${API_PORT}/api/v1/health" >/dev/null 2>&1; then
    echo "[dev-all] Backend API is ready"
    break
  fi

  if ! kill -0 "$API_PID" 2>/dev/null; then
    echo "[dev-all] Backend exited unexpectedly. Check $RUN_DIR/backend.log"
    exit 1
  fi

  sleep 1
done

echo "[dev-all] Starting frontend dev server"
npm run dev >"$RUN_DIR/frontend.log" 2>&1 &
WEB_PID=$!

echo "[dev-all] Running"
echo "[dev-all] Frontend: http://localhost:5173"
echo "[dev-all] Backend : http://localhost:${API_PORT}"
echo "[dev-all] Logs    : $RUN_DIR/frontend.log, $RUN_DIR/backend.log, $RUN_DIR/db.log"
echo "[dev-all] Press Ctrl+C to stop all services"

wait -n "$API_PID" "$WEB_PID"

echo "[dev-all] A service exited unexpectedly. Check logs in $RUN_DIR"
exit 1
