import type { Request, Response } from "express"
import { LinkService } from "../services/linkService.ts"
import { LinkRepository } from "../repositories/linkRepository.ts"

const linkService = new LinkService(new LinkRepository())

export async function randomController(req: Request, res: Response) {
    const code = Math.random().toString(36).slice(2, 10)
    const data = { ...req.body, code, custom: false }

    try {
        const shortLink = await linkService.createLink(data)
        return res.status(201).json(shortLink)
    } catch (err) {
        if (err instanceof Error) {
            return res.status(400).json({ error: err.message })
        }

        return res.status(500).json({ error: "INTERNAL_SERVER_ERROR" })
    }
}
