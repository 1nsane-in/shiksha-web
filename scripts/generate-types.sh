#!/bin/bash
set -e

echo "Generating TypeScript types..."

# Generate types from OpenAPI spec if available
if command -v openapi-typescript &> /dev/null; then
    openapi-typescript ./docs/api-spec.yaml -o ./packages/shared-types/src/api-types.ts
    echo "API types generated!"
else
    echo "openapi-typescript not found. Install with: npm install -g openapi-typescript"
    exit 1
fi
