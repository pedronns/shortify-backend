import dotenv from 'dotenv'
import express from "express"
import cors from "cors"
import { json } from "express"

import { connectDatabase } from "./database/index.js"

import { randomRoute } from "./routes/random.js"
import { customRoute } from "./routes/custom.js"
import { unlockRoute } from "./routes/unlock.js"
import { deleteRoute } from "./routes/delete.js"
import { infoRoute } from "./routes/info.js"
import { redirectRoute } from "./routes/redirect.js"

const origin = process.env.FRONTEND_URL

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
app.post("/random", randomRoute)

// create link with custom code
app.post("/custom", customRoute)

// redirecting route
app.get("/:code", redirectRoute)

// checks if the link exists and if it's protected
app.get("/info/:code", infoRoute)

app.post("/:code/unlock", unlockRoute)

app.delete("/:code", deleteRoute)

app.listen(port, () => {
    console.log(`Server is listening on port ${port}`)
})
