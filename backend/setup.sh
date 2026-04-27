#!/usr/bin/env bash
set -e
echo "📦 Installing backend dependencies..."
npm install

echo ""
echo "🔑 Creating .env from template..."
if [ ! -f .env ]; then
  cp .env.example .env
  echo "  ✓ .env created — fill in your MONGODB_URI and JWT_SECRET"
else
  echo "  ✓ .env already exists"
fi

echo ""
echo "🌱 Seeding database (optional)..."
read -p "  Run seed? [y/N] " seed
if [[ $seed =~ ^[Yy]$ ]]; then
  node seed.js
fi

echo ""
echo "✅ Backend ready. Run: npm run dev"
