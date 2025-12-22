#!/bin/bash

# PostgreSQL Database Migration Script
# This script applies all schema changes from your Drizzle schema to the database

set -e

# Check if DATABASE_URL is set
if [ -z "$DATABASE_URL" ]; then
  echo "❌ Error: DATABASE_URL environment variable is not set"
  echo "Please set your database connection URL:"
  echo "export DATABASE_URL='postgresql://user:password@host:port/database'"
  exit 1
fi

echo "🔄 Starting database migration..."
echo "Database: $DATABASE_URL"

# Run Drizzle's schema push which applies all changes
npm run db:push

if [ $? -eq 0 ]; then
  echo "✅ Database migration completed successfully!"
  echo ""
  echo "Applied schema changes:"
  echo "  ✓ branches table"
  echo "  ✓ categories table"
  echo "  ✓ items table"
  echo "  ✓ orders table"
  echo "  ✓ tables table"
  echo "  ✓ languages table"
  echo "  ✓ foodTypes table"
  echo "  ✓ materials table"
  echo "  ✓ users table (with avatar and branchId)"
  echo "  ✓ waiterRequests table"
  echo "  ✓ session table"
else
  echo "❌ Migration failed. Please check your DATABASE_URL and try again."
  exit 1
fi
