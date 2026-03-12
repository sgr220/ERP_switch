# ERP Switch — Fábrica de Camisetas

## Visão Geral
Sistema ERP completo para gestão de uma pequena fábrica de camisetas. Desenvolvido com stack full-stack moderna, cobrindo os módulos essenciais de operação: autenticação, produtos, clientes, pedidos, ordens de produção e estoque.

**GitHub:** https://github.com/sgr220/ERP_switch
**Branch principal:** `main`

---

## Stack Tecnológica

### Backend
- **Runtime:** Node.js (ES Modules — `"type": "module"`)
- **Framework:** Express 4.x
- **ORM:** Prisma 5.x
- **Banco de dados:** SQLite (dev) — schema compatível com PostgreSQL para produção
- **Autenticação:** JWT (`jsonwebtoken`) + hash de senhas (`bcryptjs@^2.4.3`)
- **Variáveis de ambiente:** `dotenv`

### Frontend
- **Framework:** React 18 + Vite
- **Estilização:** Tailwind CSS + shadcn/ui
- **HTTP Client:** Axios (com interceptors para JWT)
- **Roteamento:** React Router v6
- **Gerenciamento de estado:** Context API (AuthContext)

---

## Estrutura de Pastas

```
ERP_switch/
├── CLAUDE.md                  ← este arquivo
├── backend/
│   ├── server.js              ← entry point Express
│   ├── package.json
│   ├── .env                   ← DATABASE_URL + JWT_SECRET
│   ├── .env.example
│   ├── prisma/
│   │   ├── schema.prisma      ← modelos do banco
│   │   └── seed.js            ← dados iniciais
│   └── src/
│       ├── middleware/
│       │   └── auth.js        ← middleware JWT (verifyToken)
│       ├── routes/
│       │   ├── auth.js
│       │   ├── products.js
│       │   ├── customers.js
│       │   ├── orders.js
│       │   ├── productionOrders.js
│       │   └── stock.js
│       └── controllers/
│           ├── authController.js
│           ├── productController.js
│           ├── customerController.js
│           ├── orderController.js
│           ├── productionOrderController.js
│           └── stockController.js
└── frontend/
    ├── vite.config.js          ← proxy /api → localhost:3001
    ├── tailwind.config.js
    ├── index.html
    └── src/
        ├── main.jsx
        ├── App.jsx             ← rotas React Router
        ├── context/
        │   └── AuthContext.jsx ← login/logout/token
        ├── services/
        │   └── api.js          ← todos os endpoints Axios
        ├── components/
        │   ├── Layout.jsx
        │   ├── Sidebar.jsx
        │   ├── Modal.jsx
        │   ├── ProtectedRoute.jsx
        │   ├── LoadingSpinner.jsx
        │   └── StatusBadge.jsx
        └── pages/
            ├── Login.jsx
            ├── Dashboard.jsx
            ├── Products.jsx
            ├── Customers.jsx
            ├── Orders.jsx
            ├── ProductionOrders.jsx
            ├── Stock.jsx
            └── Users.jsx
```

---

## Como Rodar

### Backend
```bash
cd ~/Downloads/ERP_switch/backend
npm install
npx prisma migrate dev --name init   # cria o banco SQLite
node prisma/seed.js                  # popula dados iniciais
node server.js                       # ou: npm run dev (com nodemon)
```
Backend sobe em: **http://localhost:3001**
Health check: **http://localhost:3001/api/health**

### Frontend
```bash
cd ~/Downloads/ERP_switch/frontend
npm install
npm run dev
```
Frontend sobe em: **http://localhost:5173**
O Vite faz proxy de `/api` → `http://localhost:3001` automaticamente.

### Com PM2 (recomendado para deixar rodando)
```bash
npm install -g pm2
pm2 start ~/Downloads/ERP_switch/backend/server.js --name "erp-backend"
pm2 start "npm run dev" --name "erp-frontend" --cwd ~/Downloads/ERP_switch/frontend
pm2 save && pm2 startup
```

---

## Credenciais de Teste (seed)

| Perfil    | Email                  | Senha    |
|-----------|------------------------|----------|
| Admin     | admin@erp.com          | admin123 |
| Operador  | operator@erp.com       | admin123 |
| Vendedor  | seller@erp.com         | admin123 |

---

## Modelos do Banco (Prisma)

| Modelo           | Descrição                                      |
|------------------|------------------------------------------------|
| `User`           | Usuários com roles: ADMIN, OPERATOR, SELLER    |
| `Product`        | Produtos (camiseta, polo, regata) com SKU      |
| `Customer`       | Clientes com CPF/CNPJ e condição de pagamento  |
| `Order`          | Pedidos de venda com itens                     |
| `OrderItem`      | Itens de pedido (produto, tamanho, cor, qtd)   |
| `ProductionOrder`| Ordens de produção ligadas a pedidos           |
| `StockItem`      | Itens de estoque (matéria-prima ou acabado)    |
| `StockMovement`  | Movimentações de estoque (entrada/saída)       |

**Status de Pedido:** PENDING → CONFIRMED → IN_PRODUCTION → DELIVERED | CANCELLED
**Status de Produção:** PENDING → IN_PRODUCTION → COMPLETED | CANCELLED

---

## API Endpoints

### Auth
- `POST /api/auth/login` — `{ email, password }` → `{ token, user }`
- `GET  /api/auth/me` — retorna usuário logado (requer JWT)
- `GET  /api/auth/users` — lista usuários (ADMIN)
- `POST /api/auth/users` — cria usuário (ADMIN)
- `PUT  /api/auth/users/:id` — edita usuário (ADMIN)
- `DELETE /api/auth/users/:id` — remove usuário (ADMIN)
- `POST /api/auth/change-password` — troca senha

### Produtos
- `GET/POST /api/products`
- `GET/PUT/DELETE /api/products/:id`

### Clientes
- `GET/POST /api/customers`
- `GET/PUT/DELETE /api/customers/:id`

### Pedidos
- `GET/POST /api/orders`
- `GET/PUT/DELETE /api/orders/:id`
- `PATCH /api/orders/:id/status`
- `GET /api/orders/stats`

### Ordens de Produção
- `GET/POST /api/production-orders`
- `GET/PUT/DELETE /api/production-orders/:id`
- `PATCH /api/production-orders/:id/status`
- `GET /api/production-orders/stats`

### Estoque
- `GET/POST /api/stock`
- `GET/PUT/DELETE /api/stock/:id`
- `POST /api/stock/movements`
- `GET /api/stock/movements`
- `GET /api/stock/alerts/low-stock`

---

## Variáveis de Ambiente (backend/.env)

```env
DATABASE_URL="file:./dev.db"
JWT_SECRET="erp-switch-secret-key-2024"
PORT=3001
```

---

## Status dos Módulos

| Módulo              | Backend | Frontend | Observações                        |
|---------------------|---------|----------|------------------------------------|
| Autenticação        | ✅      | ✅       | JWT, roles, proteção de rotas      |
| Produtos            | ✅      | ✅       | CRUD completo                      |
| Clientes            | ✅      | ✅       | CRUD completo                      |
| Pedidos             | ✅      | ✅       | Com itens, status, stats           |
| Ordens de Produção  | ✅      | ✅       | Vinculado a pedidos e produtos     |
| Estoque             | ✅      | ✅       | Movimentações, alertas low-stock   |
| Usuários            | ✅      | ✅       | Gestão por ADMIN                   |
| Dashboard           | ✅      | ✅       | Visão geral com métricas           |

---

## Próximos Passos Sugeridos

1. **Relatórios** — PDF de pedidos, ordens de produção, ficha de estoque
2. **Dashboard aprimorado** — gráficos de produção e vendas por período
3. **Notificações** — alertas de estoque baixo, pedidos atrasados
4. **Migração para PostgreSQL** — para ambiente de produção (só trocar `provider` no schema)
5. **Integração fiscal** — emissão de NF-e
6. **App mobile** — React Native usando a mesma API

---

## Notas de Desenvolvimento

- O banco SQLite fica em `backend/prisma/dev.db` — não commitar este arquivo (já no `.gitignore`)
- `sizes` e `colors` em `Product` são armazenados como JSON stringificado (ex: `'["P","M","G"]'`)
- O frontend usa proxy do Vite em dev — em produção configurar CORS e variável `VITE_API_URL`
- Todos os endpoints (exceto login) exigem header `Authorization: Bearer <token>`
- Roles: `ADMIN` tem acesso total; `OPERATOR` gerencia produção/estoque; `SELLER` gerencia pedidos/clientes
