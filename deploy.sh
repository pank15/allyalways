#!/bin/bash
# Deploy script for DigitalOcean — run on the server
set -e

echo "=== AllyAlways Deploy ==="

cd /root/allyalways

echo "[1] Pull latest code..."
git pull origin main

echo "[2] Build Docker image..."
docker compose build

echo "[3] Start containers..."
docker compose up -d --force-recreate

echo "[4] Wait for startup..."
sleep 3

echo "[5] Health check..."
curl -sf http://localhost:3000/admin/login -o /dev/null && echo "✓ App is UP" || echo "✗ App not responding"

echo "=== Deploy complete ==="
