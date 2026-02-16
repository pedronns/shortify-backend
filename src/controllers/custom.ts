import type { Request, Response } from "express"
import { LinkService } from "../services/linkService.ts"
import { LinkRepository } from "../repositories/linkRepository.ts"

const linkService = new LinkService(new LinkRepository())

export async function customController(req: Request, res: Response) {
    const data = { ...req.body, custom: true }

    try {
        const shortLink = await linkService.createLink(data)
        return res.status(201).json(shortLink)
    } catch (err) {
        if (err instanceof Error) {
            if (err.message === "CODE_TAKEN") {
                return res.status(409).json({ error: "CODE_TAKEN" })
            }
            return res.status(400).json({ error: err.message })
        }

        res.status(500).json({ error: "SERVER_ERROR" })
    }
}
