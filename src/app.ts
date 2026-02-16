import cors from "cors"
import dotenv from "dotenv"
import express, { json } from "express"

import { env } from "./config/env.ts"
import { connectDatabase } from "./database/index.ts"

import { randomController } from "./controllers/random.ts"
import { customController } from "./controllers/custom.ts"
import { unlockController } from "./controllers/unlock.ts"
import { deleteController } from "./controllers/delete.ts"
import { infoController } from "./controllers/info.ts"
import { redirectController } from "./controllers/redirect.ts"

import { validateLink } from "./middlewares/validation.ts"
import { createLinkLimiter, generalLimiter } from "./middlewares/rateLimit.ts"
import { errorHandler } from "./middlewares/errorHandler.ts"

dotenv.config()

const app = express() 

app.set('trust proxy', 1)

app.use("/", cors())
app.use(json())
app.use(errorHandler)
app.use(generalLimiter)

await connectDatabase()

app.get("/health", (_req, res) => {
    res.send("Shortify returns OK")
})

app.post("/random", createLinkLimiter, validateLink, randomController)
app.post("/custom", createLinkLimiter, validateLink, customController)

app.get("/info/:code", infoController)
app.post("/:code/unlock", unlockController)

app.get("/:code", redirectController)
app.delete("/:code", deleteController)

app.listen(env.port, () => {
    console.log(`Server is listening on port ${env.port}`)
})
