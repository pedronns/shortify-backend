import { LinkModel } from "../database/models/link.ts"
import type { Request, Response } from "express"

export async function infoController(req: Request, res: Response) {
    const { code } = req.params

    if (!code) {
        return res.status(400).json({ error: "Code is required" })
    }

    try {
        const link = await LinkModel.findOne({ code })
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
