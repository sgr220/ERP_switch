# Guia de Deploy — ERP Switch

Passo a passo para subir o ERP em uma VPS e atrelar um domínio com SSL.

---

## Pré-requisitos na VPS

- Ubuntu 22.04 LTS (recomendado) ou Debian 12
- Acesso root ou usuário com sudo
- Portas **80** e **443** liberadas no firewall/painel da VPS

---

## 1. Preparar a VPS

```bash
# Atualizar pacotes
sudo apt update && sudo apt upgrade -y

# Instalar Docker
curl -fsSL https://get.docker.com | bash
sudo usermod -aG docker $USER
newgrp docker

# Verificar instalação
docker --version
docker compose version
```

---

## 2. Apontar o domínio para a VPS

No painel do seu registrador de domínio, crie os seguintes registros DNS:

| Tipo | Nome | Valor         |
|------|------|---------------|
| A    | @    | IP_DA_SUA_VPS |
| A    | www  | IP_DA_SUA_VPS |

> Aguarde a propagação DNS (pode levar até 1h). Verifique com:
> ```bash
> nslookup seudominio.com
> ```

---

## 3. Clonar o repositório na VPS

```bash
git clone https://github.com/sgr220/ERP_switch.git
cd ERP_switch
```

---

## 4. Configurar o .env

```bash
cp .env.example .env
nano .env
```

Preencha:
```env
JWT_SECRET=gere-uma-chave-forte-aqui   # openssl rand -base64 48
DOMAIN=seudominio.com
CERTBOT_EMAIL=seu@email.com
```

---

## 5. Primeira execução — SEM SSL (para obter o certificado)

```bash
# Sobe o nginx em modo HTTP para o desafio ACME funcionar
docker compose up -d nginx backend frontend

# Aguarda serviços iniciarem
sleep 10

# Verifica se está respondendo
curl http://seudominio.com/api/health
```

---

## 6. Obter o certificado SSL (Let's Encrypt)

```bash
chmod +x init-letsencrypt.sh
./init-letsencrypt.sh
```

O script vai:
1. Solicitar o certificado para `seudominio.com` e `www.seudominio.com`
2. Ativar automaticamente a config HTTPS no Nginx
3. Reiniciar o Nginx com SSL

---

## 7. Subir todos os containers

```bash
docker compose up -d
```

Verifique os containers:
```bash
docker compose ps
```

Deve mostrar todos como **Up (healthy)**:
```
NAME           STATUS
erp-backend    Up (healthy)
erp-frontend   Up
erp-nginx      Up
erp-certbot    Up
```

---

## 8. Testar o deploy

```bash
# Health check
curl https://seudominio.com/api/health

# Teste de login
curl -X POST https://seudominio.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@erp.com","password":"admin123"}'
```

Acesse no navegador: **https://seudominio.com**

---

## Atualizações futuras

Sempre que fizer push de código novo:

```bash
# Na VPS, dentro da pasta ERP_switch:
./deploy.sh

# Para rebuild completo (ex: mudou Dockerfile):
./deploy.sh --rebuild
```

---

## Comandos úteis

```bash
# Ver logs em tempo real
docker compose logs -f

# Ver logs de um serviço específico
docker compose logs backend --tail=50
docker compose logs nginx --tail=50

# Reiniciar um serviço
docker compose restart backend

# Parar tudo
docker compose down

# Parar e remover volumes (CUIDADO: apaga o banco!)
docker compose down -v

# Acessar o shell do backend
docker compose exec backend sh

# Backup do banco SQLite
docker compose exec backend sh -c "cp /data/dev.db /data/backup_$(date +%Y%m%d).db"

# Verificar espaço em disco
df -h
docker system df
```

---

## Renovação SSL

O certificado SSL é renovado automaticamente pelo container `certbot` a cada 12h.
Para forçar a renovação manualmente:

```bash
docker compose run --rm certbot renew
docker compose restart nginx
```

---

## Estrutura de arquivos Docker

```
ERP_switch/
├── docker-compose.yml          # Orquestração dos containers
├── .env                        # Variáveis de ambiente (NÃO commitar!)
├── .env.example                # Template das variáveis
├── init-letsencrypt.sh         # Script para obter SSL (execute 1x)
├── deploy.sh                   # Script de atualização
├── backend/
│   ├── Dockerfile              # Build do Node.js backend
│   └── docker-entrypoint.sh   # Migrations + seed + start
├── frontend/
│   ├── Dockerfile              # Build React + Nginx
│   └── nginx.conf              # Config SPA (React Router)
└── nginx/
    ├── conf.d/
    │   ├── app.conf            # Config HTTP (antes do SSL)
    │   └── app.ssl.conf        # Config HTTPS (template)
    └── certbot/
        ├── conf/               # Certificados SSL (gerado pelo certbot)
        └── www/                # Arquivos de desafio ACME
```

---

## Provedores de VPS recomendados

| Provedor      | Plano mínimo | Custo/mês |
|---------------|--------------|-----------|
| Hetzner Cloud | CX22 (2vCPU, 4GB RAM) | ~€4 |
| DigitalOcean  | Basic (1vCPU, 1GB RAM) | ~$6 |
| Vultr         | Regular (1vCPU, 1GB RAM) | ~$5 |
| Contabo       | VPS S (4vCPU, 8GB RAM) | ~€5 |

> Para este projeto, 1vCPU + 1GB RAM é suficiente. Recomendamos pelo menos 2GB RAM para o build do frontend.
