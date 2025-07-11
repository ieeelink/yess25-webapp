#!/bin/bash

# Check if a commit message was provided
if [ -z "$1" ]; then
  echo "❌ Error: Please provide a commit message."
  echo "Usage: ./commit-and-push.sh \"Your commit message here\""
  exit 1
fi

# Stage all changes
git add .

# Commit with provided message
git commit -m "$1"

# Push to personal GitHub (origin)
echo "📤 Pushing to origin..."
git push origin main

# Push to organization GitHub (org-origin)
echo "📤 Pushing to org-origin..."
git push org-origin main

echo "✅ Done. Pushed to both remotes."

