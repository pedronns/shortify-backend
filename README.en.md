# Shortify (Backend)

A simple, fast, and secure URL shortener API built with **Node.js**, **Express**, and **MongoDB**.

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

**Response:**
```
Shortify returns OK
```

---

### POST /random
Creates a link with an auto-generated Base36 code.

**Body:**
```json
{
  "url": "https://example.com/very-long-page",
  "password": "optional"
}
```

**Response (201):**
```json
{
  "_id": "...",
  "url": "https://example.com/very-long-page",
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

**Response (409):** CODE_TAKEN - Code is already in use

**Middlewares**: createLinkLimiter, validateLink

---

### GET /info/:code
Returns public information about the shortened link.

**Response (200):**
```json
{
  "protected": false,
  "url": "https://example.com/page",
  "clicks": 5
}
```

If the link is protected, `url` will return `null`.

---

### GET /:code
Accesses/redirects to the shortened link.

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
- `409` - NOT_PROTECTED (link has no password)
- `401` - INVALID_PASSWORD

---

### DELETE /:code
Deletes a shortened link.

**Response (204):** No Content

**Response (404):** NOT_FOUND

---

## Error Handling

The API uses standard HTTP status codes to indicate success or error:

| Code | Meaning |
|------|---------|
| 200 | OK - Success |
| 201 | Created - Resource created successfully |
| 204 | No Content - Resource deleted |
| 400 | Bad Request - Validation failed |
| 401 | Unauthorized - Authentication required |
| 404 | Not Found - Resource not found |
| 409 | Conflict - Code already exists or invalid state |
| 500 | Internal Server Error - Server error |

---

## Environment Variables

| Variable | Description |
|----------|-------------|
| `PORT` | Server port (default: 3000) |
| `FRONTEND_URL` | Frontend URL (for CORS) |
| `MONGO_URI` | MongoDB connection URI |
| `API_URL` | Base API URL (for recursion validation) |
| `NODE_ENV` | Environment (development/production) |

---

## Project Structure

```
src/
├── app.ts                 # Main application configuration
├── config/
│   └── env.ts            # Environment variable loading
├── controllers/          # Endpoint controllers
│   ├── random.ts
│   ├── custom.ts
│   ├── redirect.ts
│   ├── unlock.ts
│   ├── delete.ts
│   └── info.ts
├── services/             # Business logic
│   └── linkService.ts
├── repositories/         # Data access layer
│   └── linkRepository.ts
├── database/             # MongoDB configuration
│   ├── index.ts
│   └── models/
│       └── link.ts
├── middlewares/          # Express middlewares
│   ├── validation.ts
│   ├── rateLimit.ts
│   └── errorHandler.ts
├── errors/               # Custom error classes
│   ├── AppError.ts
│   └── index.ts
├── types/                # TypeScript types
│   └── index.ts
└── utils/                # Utilities
    └── passwordUtils.ts
```

---

## Password-Protected Links

Links can be protected with a password:

1. When creating a link, provide the `password` parameter
2. The password is hashed with bcrypt before being stored
3. When accessing a protected link via `GET /:code`, a 401 error is returned
4. Use `POST /:code/unlock` with the password to retrieve the actual URL

---

## Rate Limiting

The API implements rate limiting in two layers:

- **createLinkLimiter**: Limits `POST` requests for link creation
- **generalLimiter**: Limits general API requests

This prevents resource abuse.
