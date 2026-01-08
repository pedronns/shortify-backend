import dotenv from 'dotenv'
import express from "express"
import cors from "cors"
import { json } from "express"

import { connectDatabase } from "./database/index.ts"

import { randomController } from "./controllers/random.ts"
import { customController } from "./controllers/custom.ts"
import { unlockController } from "./controllers/unlock.ts"
import { deleteController } from "./controllers/delete.ts"
import { infoController } from "./controllers/info.ts"
import { redirectController } from "./controllers/redirect.ts"

import { env } from "./config/env.ts"

const origin = env.frontendUrl || ''

const app = express()

app.use("/", cors())
app.use(json())

await connectDatabase()

app.get("/", (req, res) => {
    res.send('API returns OK')
})

app.post("/random", randomController)

app.post("/custom", customController)

app.get("/info/:code", infoController)
app.post("/:code/unlock", unlockController)

app.get("/:code", redirectController)

app.delete("/:code", deleteController)

app.listen(env.port, () => {
    console.log(`Server is listening on port ${env.port}`)
})
