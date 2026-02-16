# Shortify (Backend)

API de encurtador de links simples, rápida e segura desenvolvida com **Node.js**, **Express** e **MongoDB**.

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
Health check da aplicação.

**Resposta:**
```
Shortify returns OK
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
Acessa/redireciona para o link encurtado.

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

Parâmetros: - code (string)

---

### POST /:code/unlock

Valida a senha de um link protegido.

Parâmetros: - code (string)

---

### GET /:code

Redireciona para a URL original associada ao código.

Parâmetros: - code (string)

---

### DELETE /:code

Remove o link encurtado.

Parâmetros: - code (string)

---

## Licença

MIT
