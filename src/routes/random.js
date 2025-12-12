const { isValidUrl, isValidPassword } = require("../validators")
const { createShortLink } = require("../services")

// const port = process.env.PORT

async function randomRoute(req, res) {
    const { url, password } = req.body
    const code = Math.random().toString(36).slice(2, 10)

    if (!isValidUrl(url)) {
        return res.status(400).json({ error: "Invalid URL" })
    }

    if (password && !isValidPassword(password)) {
        return res.status(400).json({ error: "Invalid password format" })
    }

    try {
        const shortLink = await createShortLink(url, code, password, false)
        res.status(201).json(shortLink)
    } catch (error) {
        console.error(`Error creating random link: ${error}`)
        res.status(500).json({ error: "SERVER_ERROR" })
    }
}

module.exports = { randomRoute }