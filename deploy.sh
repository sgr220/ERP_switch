#!/bin/bash
# ─────────────────────────────────────────────────────────────────────────────
# deploy.sh
# Script de deploy/atualização na VPS
# Uso: ./deploy.sh [--rebuild]
# ─────────────────────────────────────────────────────────────────────────────

set -e

REBUILD=false

for arg in "$@"; do
  case $arg in
    --rebuild) REBUILD=true ;;
  esac
done

echo "=== ERP Switch — Deploy ==="
echo ""

# Carrega variáveis
if [ ! -f .env ]; then
  echo "ERRO: Arquivo .env não encontrado."
  echo "Copie .env.example para .env e configure as variáveis."
  exit 1
fi

export $(grep -v '^#' .env | xargs)

# Puxa últimas alterações do repositório
echo "==> Atualizando código..."
git pull origin main

if [ "$REBUILD" = true ]; then
  echo "==> Reconstruindo imagens Docker..."
  docker compose build --no-cache
else
  echo "==> Construindo imagens (com cache)..."
  docker compose build
fi

echo "==> Subindo containers..."
docker compose up -d

echo "==> Aguardando backend ficar saudável..."
MAX_WAIT=60
COUNT=0
until docker compose exec -T backend wget -qO- http://localhost:3001/api/health > /dev/null 2>&1; do
  COUNT=$((COUNT+1))
  if [ $COUNT -ge $MAX_WAIT ]; then
    echo "AVISO: Backend demorou para iniciar. Verifique os logs:"
    echo "  docker compose logs backend"
    break
  fi
  echo "  Aguardando... ($COUNT/${MAX_WAIT}s)"
  sleep 1
done

echo ""
echo "=== Deploy concluído! ==="
echo ""
echo "Containers em execução:"
docker compose ps
echo ""
echo "Logs recentes do backend:"
docker compose logs backend --tail=20
