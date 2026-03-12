#!/bin/sh
set -e

echo "==> Running database migrations..."
npx prisma db push

# Seed only if the database is empty (no users exist)
echo "==> Checking if database needs seeding..."
USER_COUNT=$(node -e "
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
prisma.user.count().then(count => {
  console.log(count);
  prisma.\$disconnect();
}).catch(() => {
  console.log(0);
  process.exit(0);
});
" 2>/dev/null || echo "0")

if [ "$USER_COUNT" = "0" ]; then
  echo "==> Seeding initial data..."
  node prisma/seed.js
else
  echo "==> Database already has data, skipping seed."
fi

echo "==> Starting ERP backend server..."
exec node server.js
