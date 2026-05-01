#!/bin/bash

set -e  # Exit on any error

echo "🚀 Starting deployment..."

# Go to your project directory
cd /home/deploy/yourrepo

echo "📥 Pulling latest code..."
git pull origin main

echo "📦 Installing dependencies..."
npm install

echo "🏗️ Building project..."
npm run build

echo "🧹 Cleaning old Nginx files..."
sudo rm -rf /var/www/html/*

echo "📂 Copying new build to Nginx..."
sudo cp -r dist/* /var/www/html/

echo "🔁 Reloading Nginx..."
sudo systemctl reload nginx

echo "✅ Deployment complete!"