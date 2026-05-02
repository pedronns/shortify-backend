# Shortify

**Idiomas / Languages:**
- [ Português](#português)
- [ English](#english)

---

## Português

# Shortify (Backend)

API encurtadora de links simples, rápida e segura desenvolvida com **Node.js**, **Express** e **MongoDB**.

Live demo: https://shortify-6s8t.vercel.app/

---

## Funcionalidades

- ✨ Geração de links aleatórios (Base36 - 8 caracteres)
- 🔗 Links personalizados com código customizável
- 🔐 Proteção por senha com hash bcrypt
- ✅ Validação de URL
- 🚫 Prevenção de links recursivos
- ⚡ Rate limiting para criação de links
- 🗄️ Persistência em MongoDB

---

## Stack Técnico

- **Runtime**: Node.js
- **Framework**: Express v5
- **Banco de Dados**: MongoDB com Mongoose
- **Linguagem**: TypeScript
- **Autenticação**: bcrypt para hash de senhas
- **Validação**: Joi
- **Rate Limiting**: express-rate-limit
- **CORS**: Habilitado

---

## Instalação

### Pré-requisitos
- Node.js (v18+)
- MongoDB

### Setup

1. Instale as dependências:
```bash
npm install
```

2. Configure as variáveis de ambiente (crie `.env.development` e `.env.production`):
```env
PORT=3000
FRONTEND_URL=http://localhost:5173
MONGO_URI=mongodb://localhost:27017/shortify
API_URL=http://localhost:3000
NODE_ENV=development
```

3. Inicie o servidor:

**Desenvolvimento (com watch):**
```bash
npm run dev
```

**Produção:**
```bash
npm run build
npm start
```

O servidor será iniciado na porta configurada nas variáveis de ambiente.

---

## Endpoints

### GET /health
Verifica a saúde da aplicação.

**Response (200):**
```json
{
  "status": "ok",
  "uptime": 123.45,
  "timestamp": "2026-05-02T00:00:00.000Z"
}
```

---

### POST /random
Cria um link com código Base36 gerado automaticamente.

**Body:**
```json
{
  "url": "https://exemplo.com/pagina-muito-longa",
  "password": "opcional"
}
```

**Response (201):**
```json
{
  "_id": "...",
  "url": "https://exemplo.com/pagina-muito-longa",
  "code": "a1b2c3d4",
  "custom": false,
  "protected": false,
  "clicks": 0,
  "createdAt": "..."
}
```

**Middlewares**: createLinkLimiter, validateLink

---

### POST /custom
Cria um link com código personalizado.

**Body:**
```json
{
  "url": "https://exemplo.com/pagina",
  "code": "meu-link",
  "password": "opcional"
}
```

**Response (201):**
```json
{
  "_id": "...",
  "url": "https://exemplo.com/pagina",
  "code": "meu-link",
  "custom": true,
  "protected": false,
  "clicks": 0,
  "createdAt": "..."
}
```

**Response (409):** CODE_TAKEN - Código já está em uso

**Middlewares**: createLinkLimiter, validateLink

---

### GET /info/:code
Retorna informações públicas do link encurtado.

**Response (200):**
```json
{
  "protected": false,
  "url": "https://exemplo.com/pagina",
  "clicks": 5
}
```

Se o link for protegido, `url` retornará `null`.

---

### GET /:code
Acessa o link encurtado.

**Response (200) - Link desbloqueado:**
```json
{
  "originalUrl": "https://exemplo.com/pagina"
}
```

**Response (401) - Link protegido:**
```json
{
  "error": "PASSWORD_REQUIRED"
}
```

**Response (404)** - NOT_FOUND

---

### POST /:code/unlock
Desbloqueia um link protegido por senha.

**Body:**
```json
{
  "password": "senha-do-link"
}
```

**Response (200):**
```json
{
  "url": "https://exemplo.com/pagina"
}
```

**Responses de erro:**
- `404` - NOT_FOUND
- `409` - NOT_PROTECTED (link não tem senha)
- `401` - INVALID_PASSWORD

---

### DELETE /:code
Deleta um link encurtado.

**Response (204):** No Content

**Response (404):** NOT_FOUND

---

## Tratamento de Erros

A API utiliza códigos HTTP padrão para indicar sucesso ou erro:

| Código | Significado |
|--------|-------------|
| 200 | OK - Sucesso |
| 201 | Created - Recurso criado com sucesso |
| 204 | No Content - Recurso deletado |
| 400 | Bad Request - Validação falhou |
| 401 | Unauthorized - Autenticação necessária |
| 404 | Not Found - Recurso não encontrado |
| 409 | Conflict - Código já existe ou estado inválido |
| 500 | Internal Server Error - Erro no servidor |

---

## Variáveis de Ambiente

| Variável | Descrição |
|----------|-----------|
| `PORT` | Porta do servidor (padrão: 3000) |
| `FRONTEND_URL` | URL do frontend (para CORS) |
| `MONGO_URI` | URI de conexão MongoDB |
| `API_URL` | URL base da API (para validação de recursão) |
| `NODE_ENV` | Ambiente (development/production) |

---

## Estrutura do Projeto

```
src/
├── app.ts                # Configuração principal da aplicação
├── config/
│   └── env.ts            # Carregamento de variáveis de ambiente
├── controllers/          # Controladores dos endpoints
│   ├── random.ts
│   ├── custom.ts
│   ├── redirect.ts
│   ├── unlock.ts
│   ├── delete.ts
│   └── info.ts
├── services/             # Lógica de negócio
│   └── linkService.ts
├── repositories/         # Acesso aos dados
│   └── linkRepository.ts
├── database/             # Configuração MongoDB
│   ├── index.ts
│   └── models/
│       └── link.ts
├── middlewares/          # Middlewares Express
│   ├── validation.ts
│   ├── rateLimit.ts
│   └── errorHandler.ts
├── errors/               # Classes customizadas de erro
│   ├── AppError.ts
│   └── index.ts
├── types/                # Tipos TypeScript
│   └── index.ts
└── utils/                # Utilitários
    └── passwordUtils.ts
```

---

## Autenticação de Links

Links podem ser protegidos por senha:

1. Ao criar um link, forneça o parâmetro `password`
2. A senha é hasheada com bcrypt antes de ser armazenada
3. Para acessar um link protegido via `GET /:code`, será retornado erro 401
4. Use `POST /:code/unlock` com a senha para obter a URL real

---

## Rate Limiting

A API implementa rate limiting em duas camadas:

- **createLinkLimiter**: Limita requisições `POST` para criação de links
- **generalLimiter**: Limita requisições gerais da API

Isso previne abuso de recursos.

---

## Licença

MIT

---

## English

# Shortify (Backend)

A simple, fast, and secure URL shortener API built with **Node.js**, **Express**, and **MongoDB**.

Live demo: https://shortify-6s8t.vercel.app/

---

## Features

- ✨ Random link generation (Base36 - 8 characters)
- 🔗 Custom links with user-defined codes
- 🔐 Password protection with bcrypt hashing
- ✅ URL validation
- 🚫 Recursive link prevention
- ⚡ Rate limiting for link creation
- 🗄️ MongoDB persistence

---

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express v5
- **Database**: MongoDB with Mongoose
- **Language**: TypeScript
- **Authentication**: bcrypt for password hashing
- **Validation**: Joi
- **Rate Limiting**: express-rate-limit
- **CORS**: Enabled

---

## Installation

### Prerequisites
- Node.js (v18+)
- MongoDB

### Setup

1. Install dependencies:
```bash
npm install
```

2. Configure environment variables (create `.env.development` and `.env.production`):
```env
PORT=3000
FRONTEND_URL=http://localhost:5173
MONGO_URI=mongodb://localhost:27017/shortify
API_URL=http://localhost:3000
NODE_ENV=development
```

3. Start the server:

**Development (with watch mode):**
```bash
npm run dev
```

**Production:**
```bash
npm run build
npm start
```

The server will start on the port configured in your environment variables.

---

## Endpoints

### GET /health
Application health check.

**Response (200):**
```json
{
  "status": "ok",
  "uptime": 123.45,
  "timestamp": "2026-05-02T00:00:00.000Z"
}
```

---

### POST /random
Creates a link with an automatically generated Base36 code.

**Body:**
```json
{
  "url": "https://example.com/long-page",
  "password": "optional"
}
```

**Response (201):**
```json
{
  "_id": "...",
  "url": "https://example.com/long-page",
  "code": "a1b2c3d4",
  "custom": false,
  "protected": false,
  "clicks": 0,
  "createdAt": "..."
}
```

**Middlewares**: createLinkLimiter, validateLink

---

### POST /custom
Creates a link with a custom code.

**Body:**
```json
{
  "url": "https://example.com/page",
  "code": "my-link",
  "password": "optional"
}
```

**Response (201):**
```json
{
  "_id": "...",
  "url": "https://example.com/page",
  "code": "my-link",
  "custom": true,
  "protected": false,
  "clicks": 0,
  "createdAt": "..."
}
```

**Response (409):** CODE_TAKEN - Code already in use

**Middlewares**: createLinkLimiter, validateLink

---

### GET /info/:code
Returns public information for a shortened link.

**Response (200):**
```json
{
  "protected": false,
  "url": "https://example.com/page",
  "clicks": 5
}
```

If the link is protected, `url` will be `null`.

---

### GET /:code
Accesses the shortened link.

**Response (200) - Unlocked link:**
```json
{
  "originalUrl": "https://example.com/page"
}
```

**Response (401) - Protected link:**
```json
{
  "error": "PASSWORD_REQUIRED"
}
```

**Response (404)** - NOT_FOUND

---

### POST /:code/unlock
Unlocks a password-protected link.

**Body:**
```json
{
  "password": "link-password"
}
```

**Response (200):**
```json
{
  "url": "https://example.com/page"
}
```

**Error responses:**
- `404` - NOT_FOUND
- `409` - NOT_PROTECTED (link is not password protected)
- `401` - INVALID_PASSWORD

---

### DELETE /:code
Deletes a shortened link.

**Response (204):** No Content

**Response (404):** NOT_FOUND

---

## Error Handling

The API uses standard HTTP status codes for success and error states:

| Code | Meaning |
|------|---------|
| 200 | OK |
| 201 | Created |
| 204 | No Content |
| 400 | Bad Request |
| 401 | Unauthorized |
| 404 | Not Found |
| 409 | Conflict |
| 500 | Internal Server Error |

---

## Environment Variables

| Variable | Description |
|----------|-------------|
| `PORT` | Server port (default: 3000) |
| `FRONTEND_URL` | Frontend URL for CORS |
| `MONGO_URI` | MongoDB connection URI |
| `API_URL` | API base URL for recursive validation |
| `NODE_ENV` | Environment (development/production) |

---

## License

MIT
