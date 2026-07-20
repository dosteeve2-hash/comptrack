# Claude Code Hooks â€” FORGE Afrika

> La couche dÃ©terministe par-dessus l'IA non-dÃ©terministe.

## Hooks actifs

### PreToolCall : protect-env
**Quand :** Avant chaque Ã©criture de fichier par Claude
**Action :** Bloque immÃ©diatement si le fichier est `.env`, `.env.local` ou `.env.production`
**Pourquoi :** Une IA ne doit JAMAIS Ã©crire dans un fichier d'environnement â€” risque de fuite de secrets

### PreToolCall : check-file-size
**Quand :** Avant chaque Ã©criture de fichier par Claude
**Action :** Avertit (sans bloquer) si le fichier dÃ©passe 250 lignes
**Pourquoi :** Anti-pattern "God File" â€” un fichier qui fait trop de choses = contexte perdu = rÃ©gressions silencieuses

### PostToolCall : auto-format
**Quand :** AprÃ¨s chaque Ã©criture d'un fichier `.ts`, `.tsx`, `.js`, `.jsx`
**Action :** Lance Prettier automatiquement
**Pourquoi :** Style cohÃ©rent sans intervention manuelle

## Fichiers

```
.claude/
  settings.json          â† config des hooks
  hooks/
    protect-env.sh       â† bloque Ã©criture .env
    check-file-size.sh   â† alerte God File >250 lignes
    auto-format.sh       â† Prettier auto aprÃ¨s chaque write
specs/
  HOOKS.md               â† ce fichier
```

## Principe

```
Utilisateur â†’ Claude â†’ Hook PreToolCall â†’ [BLOQUÃ‰ ou CONTINUER]
                    â†’ Ã‰criture fichier
                    â†’ Hook PostToolCall â†’ Prettier
```

Les hooks sont des scripts bash exÃ©cutÃ©s localement. Ils ne font pas de rÃ©seau.
Ils sont dans `.gitignore` uniquement si tu ne veux pas les partager avec l'Ã©quipe.
Par dÃ©faut, les committer permet Ã  tous les Claude Code du projet de bÃ©nÃ©ficier des mÃªmes guardrails.

## Stack FORGE Afrika (rappel)

- Next.js 15 App Router + TypeScript strict (0 `any`)
- Supabase SSR â€” `getUser()` JAMAIS `getSession()`
- Charte : Navy `#0A1628` / Gold `#D4AF37` / Cyan `#00BCD4`
- FCFA : `new Intl.NumberFormat("fr-FR").format(n) + " FCFA"`
