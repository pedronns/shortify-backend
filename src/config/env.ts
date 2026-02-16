import dotenv from "dotenv"

const NODE_ENV = process.env.NODE_ENV || "development"

process.env.NODE_ENV = NODE_ENV

dotenv.config({
  path: `.env.${NODE_ENV}`
})

function requireEnv(name: string): string {
  const value = process.env[name]
  if (!value) {
    throw new Error(`Env ${name} não definida`)
  }
  return value
}

export const env = {
  nodeEnv: NODE_ENV,
  port: Number(process.env.PORT) || 3000,
  frontendUrl: requireEnv("FRONTEND_URL"),
  mongoUri: requireEnv("MONGO_URI"),
  apiUrl: requireEnv("API_URL"),
}
