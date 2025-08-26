#!/bin/bash

# Update all submodules (skipping non-code issue tracker if present)

set -e

# Update submodules to their upstream default branches
git submodule update --init --recursive

# Iterate submodules and fast-forward to origin/main when available
git submodule foreach '
  BRANCH=$(git remote show origin | awk "/HEAD branch/ {print \$NF}")
  if [ -n "$BRANCH" ]; then
    git fetch origin "$BRANCH"
    git checkout "$BRANCH" || true
    git merge --ff-only "origin/$BRANCH" || true
  fi
'

# Commit changes in superproject if any submodule pointers moved
if [[ -n $(git status -s) ]]; then
  git add .
  git commit -m "Update submodules $(date +%Y-%m-%d)"
  echo "Submodule updates committed locally. Push when ready: git push"
else
  echo "No submodule updates."
fi

