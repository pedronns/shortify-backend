import { LinkModel } from "../database/models/link.js"
import type { Request, Response } from "express"

export async function deleteController(req: Request, res: Response) {
    const { code } = req.params

    if (!code) {
        return res.status(400).json({ error: "Code required" })
    }

    try {
        const result = await LinkModel.deleteOne({ code })

        if (result.deletedCount === 0) {
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
