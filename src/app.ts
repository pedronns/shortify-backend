import cors from 'cors'
import dotenv from 'dotenv'
import express, { json } from 'express'
import helmet from 'helmet'

import { env } from './config/env.ts'
import { connectDatabase } from './database/index.ts'

import { randomController } from './controllers/random.ts'
import { customController } from './controllers/custom.ts'
import { unlockController } from './controllers/unlock.ts'
import { deleteController } from './controllers/delete.ts'
import { infoController } from './controllers/info.ts'
import { redirectController } from './controllers/redirect.ts'

import { validateLink } from './middlewares/validation.ts'
import { createLinkLimiter, generalLimiter } from './middlewares/rateLimit.ts'
import { errorHandler } from './middlewares/errorHandler.ts'

const app = express()
app.use(helmet())

app.set('trust proxy', 1)

app.use(
  cors({
    origin: env.frontendUrl,
    credentials: true,
  }),
)

app.use(json({ limit: '10kb' }))
app.use(generalLimiter)

app.disable('x-powered-by')

app.get('/health', (_req, res) => {
  res.status(200).json({
    status: 'ok',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  })
})

app.post('/random', createLinkLimiter, validateLink, randomController)
app.post('/custom', createLinkLimiter, validateLink, customController)

app.get('/info/:code', infoController)
app.post('/:code/unlock', unlockController)

app.get('/:code', redirectController)
app.delete('/:code', deleteController)

app.use(errorHandler)

async function bootstrap() {
  try {
    await connectDatabase()
    app.listen(env.port, () => {
      console.log(`Server running on ${env.port}`)
    })
  } catch (error) {
    console.error('Failed to start server:', error)
    process.exit(1)
  }
}

bootstrap()
