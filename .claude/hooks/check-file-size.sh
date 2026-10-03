#!/bin/bash
FILE="$1"
if [ -f "$FILE" ]; then
  LINES=$(wc -l < "$FILE")
  if [ "$LINES" -gt 250 ]; then
    echo "âš ï¸  ATTENTION: $FILE contient $LINES lignes (>250). Pense Ã  dÃ©couper ce fichier (God File anti-pattern)." >&2
  fi
fi
exit 0