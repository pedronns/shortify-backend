const db = require("../database/models/index")
const { Link } = db

async function deleteRoute (req, res) {
    const { code } = req.params

    try {
        const link = await Link.findOne({ where: { code } })
        if (!link) {
            return res.status(404).json({ error: "Link not found" })
        }

        console.log(`Deleting: ${code}, URL: ${link.url}`)
        await link.destroy()

        return res.sendStatus(204)
    } catch (error) {
        console.error(`Error deleting link: ${error}`)
        return res
            .status(500)
            .json({ error: "Error deleting the specified link" })
    }
}

module.exports = { deleteRoute }