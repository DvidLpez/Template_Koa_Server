#!/usr/bin/env bash
set -e
trap 'last_command=$current_command; current_command=$BASH_COMMAND' DEBUG
trap 'echo "\"${last_command}\" command filed with exit code $?."' EXIT

cd "$(dirname "$0")"
cd ..

# install dependencies
npm install -g typescript
yarn install

# Create production build
yarn run build

mkdir -p app
cp -R ./node_modules ./app/
cp -R ./build ./app/
cp -R ./packages/server/graphql/schema ./app/build/server/graphql/schema
cp package.json ./app/
cp .env.production ./app/
cp .env.development ./app/

# Copy extra scripts to configure container and entry point.
cp ./scripts/run.sh ./app/

echo "Build finished"