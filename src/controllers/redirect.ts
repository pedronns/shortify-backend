import { handleRedirect } from "../services/index.ts"
import type { Request, Response } from "express"

export async function redirectController(req: Request, res: Response) {
    const { code } = req.params

    if (!code) {
        return res.status(400).json({ error: "Code required" })
    }

    try {
        const result = await handleRedirect(code)

        if (result.protected) {
            return res.status(200).json({ protected: true })
        }

        return res.redirect(301, result.url)
    } catch (error) {
        if (error instanceof Error && error.message === "NOT_FOUND") {
            return res.status(404).json({ error: "Link not found" })
        }

        console.error(`Failed to redirect: ${error}`)
        return res.status(500).json({ error: "Server error" })
    }
}
