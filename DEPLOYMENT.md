# Stratégie de déploiement

## Environnements
- **Staging** : Chaque PR Vercel génère automatiquement une preview URL → tester ici avant merge
- **Production** : Branch `main` → déploiement auto sur Vercel

## Rollback
1. Aller sur vercel.com → projet → Deployments
2. Trouver le dernier déploiement stable
3. Cliquer "Promote to Production"

## Avant chaque PR
- [ ] `npm run build` → 0 erreur
- [ ] `npm test` → tous les tests passent
- [ ] Tester sur la preview URL Vercel
