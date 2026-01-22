import type { Request, Response } from "express"
import { LinkService } from "../services/linkService.ts"
import { LinkRepository } from "../repositories/linkRepository.ts"

const linkService = new LinkService(new LinkRepository())

export async function redirectController(req: Request, res: Response) {
    const { code } = req.params

    if (!code) {
        return res.status(400).json({ error: "CODE_REQUIRED" })
    }

    try {
        const result = await linkService.handleRedirect(code)

        if (result.protected) {
            return res.status(200).json({ protected: true })
        }

        return res.redirect(301, result.url)
    } catch (error) {
        if (error instanceof Error && error.message === "NOT_FOUND") {
            return res.status(404).json({ error: "NOT_FOUND" })
        }

        console.error("Failed to redirect:", error)
        return res.status(500).json({ error: "SERVER_ERROR" })
    }
}

