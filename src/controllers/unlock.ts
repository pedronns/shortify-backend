import type { Request, Response } from "express"
import { LinkService } from "../services/linkService.ts"
import { LinkRepository } from "../repositories/linkRepository.ts"

const linkService = new LinkService(new LinkRepository())

export async function unlockController(req: Request, res: Response) {
    const { code } = req.params
    const { password } = req.body

    if (!code) {
        return res.status(400).json({ error: "CODE_REQUIRED" })
    }

    if (!password || typeof password !== "string") {
        return res.status(400).json({ error: "PASSWORD_REQUIRED" })
    }

    try {
        const url = await linkService.unlockLink(code, password)
        return res.status(200).json({ url })
    } catch (error) {
        if (error instanceof Error) {
            switch (error.message) {
                case "NOT_FOUND":
                    return res.status(404).json({ error: "NOT_FOUND" })

                case "NOT_PROTECTED":
                    return res
                        .status(409)
                        .json({ error: "NOT_PROTECTED" })

                case "INVALID_PASSWORD":
                    return res.status(401).json({ error: "INVALID_PASSWORD" })
            }
        }

        console.error("Failed to unlock:", error)
        return res.status(500).json({ error: "SERVER_ERROR" })
    }
}

