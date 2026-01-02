import { createShortLink } from "../services/index.js"
import { isValidUrl, isValidCode, isValidPassword } from "../validators/index.js"

const port = process.env.PORT

export async function customRoute(req, res) {
    const { url, code, password } = req.body

    if (!isValidUrl(url)) {
        return res.status(400).json({ error: "INVALID_URL" })
    }

    if (!isValidCode(code)) {
        return res.status(400).json({ error: "INVALID_CODE_FORMAT" })
    }

    if (password && !isValidPassword(password)) {
        return res.status(400).json({ error: "INVALID_PASSWORD_FORMAT" })
    }

    try {
        const shortLink = await createShortLink(url, code, password, true)
        res.status(201).json(shortLink)
    } catch (error) {
        if (error.message === "CODE_TAKEN") {
            return res.status(409).json({ error: "CODE_TAKEN" })
        }

        console.error("Error creating custom link:", error.stack || error);
        res.status(500).json({ error: "SERVER_ERROR" })
    }
}
