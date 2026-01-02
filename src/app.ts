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

const origin = process.env.FRONTEND_URL || ''

dotenv.config()
const app = express()

app.use("/", cors())
app.use(json())

await connectDatabase()

const port = process.env.PORT

//
app.get("/", (req, res) => {
    res.redirect(origin)
})

// Create link with random code
app.post("/random", randomController)

// create link with custom code
app.post("/custom", customController)

// redirecting Controller
app.get("/:code", redirectController)

app.post("/:code/unlock", unlockController)

// checks if the link exists and if it's protected
app.get("/info/:code", infoController)

app.delete("/:code", deleteController)

app.listen(port, () => {
    console.log(`Server is listening on port ${port}`)
})
