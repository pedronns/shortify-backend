import type { Request, Response } from "express"
import { LinkService } from "../services/linkService.ts"
import { LinkRepository } from "../repositories/linkRepository.ts"

const linkService = new LinkService(new LinkRepository())

export async function deleteController(req: Request, res: Response) {
    const { code } = req.params

    if (!code) {
        return res.status(400).json({ error: "Code required" })
    }

    try {
        await linkService.deleteLink(code)
        return res.sendStatus(204)
    } catch (error) {
        if (error instanceof Error && error.message === "NOT_FOUND") {
            return res.status(404).json({ error: "NOT_FOUND" })
        }

        return res.status(500).json({ error: "SERVER_ERROR" })
    }
}
