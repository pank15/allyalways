#!/bin/bash
# Deploy script for DigitalOcean — run on the server
set -e

echo "=== AllyAlways Deploy ==="

cd /root/allyalways

echo "[1] Pull latest code..."
git pull origin main

echo "[2] Restart app..."
docker compose restart app

echo "[3] Wait for startup..."
sleep 3

echo "[4] Health check..."
curl -sf http://localhost:3009/admin/login -o /dev/null && echo "✓ App is UP" || echo "✗ App not responding"

echo "=== Deploy complete ==="
