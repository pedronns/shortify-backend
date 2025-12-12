require("dotenv").config()
const express = require("express")
const cors = require("cors")
const { json } = require("express")

const { randomRoute } = require("./routes/random.js")
const { customRoute } = require("./routes/custom.js")
const { unlockRoute } = require("./routes/unlock.js")
const { deleteRoute } = require("./routes/delete.js")
const { infoRoute } = require("./routes/info.js")
const { redirectRoute } = require("./routes/redirect.js")

const origin = process.env.FRONTEND_URL

const app = express()
app.use(
    cors({
        origin: origin,
    })
)
app.use(json())

const port = process.env.PORT

//
app.get("/", (req, res) => {
    res.send("Backend is running OK")
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
