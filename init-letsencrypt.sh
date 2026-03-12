#!/bin/bash
# ─────────────────────────────────────────────────────────────────────────────
# init-letsencrypt.sh
# Obtém o certificado SSL inicial via Let's Encrypt (Certbot + webroot)
# Execute UMA VEZ na VPS antes de usar o app.ssl.conf
# ─────────────────────────────────────────────────────────────────────────────

set -e

# Carrega variáveis do .env
if [ -f .env ]; then
  export $(grep -v '^#' .env | xargs)
fi

if [ -z "$DOMAIN" ] || [ -z "$CERTBOT_EMAIL" ]; then
  echo "ERRO: Defina DOMAIN e CERTBOT_EMAIL no arquivo .env"
  exit 1
fi

echo "==> Domínio: $DOMAIN"
echo "==> Email:   $CERTBOT_EMAIL"

# Garante que os diretórios existem
mkdir -p nginx/certbot/conf nginx/certbot/www

# Parâmetros recomendados do Certbot
if [ ! -f nginx/certbot/conf/options-ssl-nginx.conf ]; then
  echo "==> Baixando parâmetros SSL recomendados..."
  curl -s https://raw.githubusercontent.com/certbot/certbot/master/certbot-nginx/certbot_nginx/_internal/tls_configs/options-ssl-nginx.conf \
    -o nginx/certbot/conf/options-ssl-nginx.conf
  openssl dhparam -out nginx/certbot/conf/ssl-dhparams.pem 2048 2>/dev/null
fi

# Sobe apenas o nginx em modo HTTP (sem SSL ainda)
echo "==> Usando app.conf (HTTP) para o desafio ACME..."
docker compose up -d nginx

echo "==> Aguardando nginx iniciar..."
sleep 5

# Solicita o certificado
echo "==> Solicitando certificado para $DOMAIN..."
docker compose run --rm certbot certonly \
  --webroot \
  --webroot-path=/var/www/certbot \
  --email "$CERTBOT_EMAIL" \
  --agree-tos \
  --no-eff-email \
  -d "$DOMAIN" \
  -d "www.$DOMAIN"

# Substitui a config do nginx pela versão SSL
echo "==> Ativando config HTTPS..."
# Faz backup da config HTTP
cp nginx/conf.d/app.conf nginx/conf.d/app.conf.http.bak

# Copia a config SSL e substitui o placeholder pelo domínio real
sed "s/SEUDOMINIO.COM/$DOMAIN/g" nginx/conf.d/app.ssl.conf > nginx/conf.d/app.conf

# Reinicia o nginx com SSL ativo
docker compose restart nginx

echo ""
echo "Certificado SSL obtido com sucesso!"
echo "Acesse: https://$DOMAIN"
echo ""
echo "Agora suba todos os containers com:"
echo "  docker compose up -d"
