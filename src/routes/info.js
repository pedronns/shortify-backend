import { Link } from "../database/models/Link.js"

export async function infoRoute(req, res) {
    const { code } = req.params

    try {
        const link = await Link.findOne({ code })
        if (!link) return res.status(404).json({ error: "NOT_FOUND" })

        res.json({
            protected: link.protected,
            url: link.protected ? null : link.url,
        })
    } catch (err) {
        console.error(err)
        res.status(500).json({ error: "Server error" })
    }
}
