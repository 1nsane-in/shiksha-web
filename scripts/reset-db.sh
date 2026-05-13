#!/bin/bash
set -e

echo "Resetting database..."

DB_HOST=${DB_HOST:-localhost}
DB_PORT=${DB_PORT:-5432}
DB_USER=${DB_USER:-medical_user}
DB_PASSWORD=${DB_PASSWORD:-medical_password}
DB_NAME=${DB_NAME:-medical_admission}

echo "Dropping and recreating $DB_NAME..."

PGPASSWORD=$DB_PASSWORD psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d postgres -c "DROP DATABASE IF EXISTS $DB_NAME;"
PGPASSWORD=$DB_PASSWORD psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d postgres -c "CREATE DATABASE $DB_NAME;"

echo "Running seed script..."
./scripts/seed-db.sh

echo "Database reset successfully!"
