#!/bin/bash
FILE="$1"
if [[ "$FILE" =~ \.(ts|tsx|js|jsx)$ ]] && [ -f "$FILE" ]; then
  npx prettier --write "$FILE" --log-level=silent 2>/dev/null || true
fi
exit 0