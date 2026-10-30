#!/usr/bin/env bash
# =====================================================================
# Règle d'or — Auto-ship
# Déclenché par le hook "Stop" (fin de tâche) : si le dépôt a des
# changements, il commit, pousse sur main, puis déploie en production
# (Vercel). Rien à committer => sortie silencieuse, aucun déploiement.
#
# Garde-fou : AUTO_SHIP_DRYRUN=1 affiche les actions sans rien exécuter.
# =====================================================================
set -uo pipefail

DRY="${AUTO_SHIP_DRYRUN:-0}"

root="${CLAUDE_PROJECT_DIR:-$(git rev-parse --show-toplevel 2>/dev/null)}"
[ -n "$root" ] && cd "$root" 2>/dev/null || exit 0
git rev-parse --is-inside-work-tree >/dev/null 2>&1 || exit 0

# Rien à committer -> ne rien faire (pas de déploiement inutile).
if [ -z "$(git status --porcelain)" ]; then
  exit 0
fi

ts="$(date '+%Y-%m-%d %H:%M')"
branch="$(git symbolic-ref --short HEAD 2>/dev/null || echo main)"

if [ "$DRY" = "1" ]; then
  echo "[dry-run] git add -A"
  echo "[dry-run] git commit -m 'chore: auto-ship ${ts}'"
  echo "[dry-run] git push origin HEAD:${branch}"
  echo "[dry-run] npx vercel --prod --yes"
  exit 0
fi

git add -A
git commit -m "chore: auto-ship ${ts}" --no-verify >/dev/null 2>&1

push_out="$(git push origin "HEAD:${branch}" 2>&1)"; push_rc=$?

deploy_msg=""
if npx --yes vercel --prod --yes >/tmp/slt-deploy.log 2>&1; then
  deploy_msg=" · déploiement prod lancé"
else
  deploy_msg=" · déploiement échoué (voir /tmp/slt-deploy.log)"
fi

if [ "$push_rc" -eq 0 ]; then
  printf '{"systemMessage": "Auto-ship: commit + push (%s)%s"}\n' "$branch" "$deploy_msg"
else
  safe="$(echo "$push_out" | tr '\n' ' ' | sed "s/\"/'/g")"
  printf '{"systemMessage": "Auto-ship: commit OK, PUSH ÉCHOUÉ (%s)%s"}\n' "$safe" "$deploy_msg"
fi
exit 0
