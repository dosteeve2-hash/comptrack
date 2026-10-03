#!/bin/bash
FILE="$1"
BASENAME=$(basename "$FILE")
if [[ "$BASENAME" == ".env" ]] || [[ "$BASENAME" == ".env.local" ]] || [[ "$BASENAME" == ".env.production" ]]; then
  echo "ðŸš« BLOQUÃ‰: Claude Code ne peut pas modifier $FILE directement." >&2
  exit 1
fi
exit 0