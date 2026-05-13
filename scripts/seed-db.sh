#!/bin/bash
set -e

echo "Seeding database..."

# Check if psql is available
if ! command -v psql &> /dev/null; then
    echo "psql not found. Please install PostgreSQL client."
    exit 1
fi

# Get database connection from environment
DB_HOST=${DB_HOST:-localhost}
DB_PORT=${DB_PORT:-5432}
DB_USER=${DB_USER:-medical_user}
DB_PASSWORD=${DB_PASSWORD:-medical_password}
DB_NAME=${DB_NAME:-medical_admission}

echo "Connecting to $DB_HOST:$DB_PORT as $DB_USER"

# Run seed SQL files
for file in ./docker/postgres/seed/*.sql; do
    if [ -f "$file" ]; then
        echo "Running $file..."
        PGPASSWORD=$DB_PASSWORD psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -f "$file"
    fi
done

echo "Database seeded successfully!"
