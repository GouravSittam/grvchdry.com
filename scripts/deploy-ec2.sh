#!/usr/bin/env bash

set -Eeuo pipefail

APP_DIR="${APP_DIR:-$HOME/app}"
BRANCH="${BRANCH:-main}"

echo "Starting deployment..."
echo "App directory: ${APP_DIR}"
echo "Branch: ${BRANCH}"

if [ ! -d "${APP_DIR}" ]; then
  echo "App directory does not exist: ${APP_DIR}"
  exit 1
fi

cd "${APP_DIR}"

if [ ! -d .git ]; then
  echo "No git repository found in ${APP_DIR}"
  exit 1
fi

echo "Pulling latest changes..."
git fetch origin "${BRANCH}"
git checkout "${BRANCH}"
git pull --ff-only origin "${BRANCH}"

echo "Building and restarting containers..."
docker compose up -d --build --remove-orphans

echo "Deployment complete."
