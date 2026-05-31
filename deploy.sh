#!/usr/bin/env sh

# Abort on errors
set -e

# Build the project
echo "Building the project..."
npm run build

# Navigate into the build output directory
cd dist

# Initialize a fresh git repository
git init
git checkout -B web
git add -A
git commit -m 'Auto-deployment from local build'

# Force push to the web branch
echo "Pushing to GitHub..."
git push -f https://github.com/ZAR0X/CivicTwin.git web

cd -
echo "Deployment successful!"
