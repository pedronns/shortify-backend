import { unlockLink } from "../services/index.js"

export async function unlockRoute(req, res) {
    const { password } = req.body
    const { code } = req.params

    try {
        const url = await unlockLink(code, password)
        return res.status(200).json({ url })
    } catch (error) {
        if (error.message === "NOT_FOUND") {
            return res.status(404).json({ error: "Link not found" })
        }

        if (error.message === "NOT_PROTECTED") {
            return res.status(400).json({ error: "This link is not protected" })
        }

        if (error.message === "INVALID_PASSWORD") {
            return res.status(401).json({ error: "Invalid password" })
        }

        console.error(`Failed to unlock: ${error}`)
        return res.status(500).json({ error: "Server error" })
    }
}