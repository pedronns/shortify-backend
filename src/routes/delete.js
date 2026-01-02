import { Link } from "../database/models/link.js"

export async function deleteRoute(req, res) {
    const { code } = req.params

    try {
        console.log(`Deleting: ${code}, URL: ${link.url}`)
        const link = await Link.deleteOne({ code })
        if (!link) {
            return res.status(404).json({ error: "Link not found" })
        }

        return res.sendStatus(204)
    } catch (error) {
        console.error(`Error deleting link: ${error}`)
        return res
            .status(500)
            .json({ error: "Error deleting the specified link" })
    }
}
