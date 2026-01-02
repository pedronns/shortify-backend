import { unlockLink } from "../services/index.ts"
import type { Request, Response } from "express"

export async function unlockController(req: Request, res: Response) {
    const { password } = req.body
    const { code } = req.params

    if (!code) {
        return res.status(400).json({ error: "Code required" })
    }

    if (password && typeof password !== "string") {
        return res.status(400).json({ error: "Invalid password format" })
    }

    try {
        const url = await unlockLink(code, password)
        return res.status(200).json({ url })
    } catch (error) {
        if (error instanceof Error) {
            if (error.message === "NOT_FOUND") {
                return res.status(404).json({ error: "Link not found" })
            }

            if (error.message === "NOT_PROTECTED") {
                return res
                    .status(400)
                    .json({ error: "This link is not protected" })
            }

            if (error.message === "INVALID_PASSWORD") {
                return res.status(401).json({ error: "Invalid password" })
            }
        }

        console.error(`Failed to unlock: ${error}`)
        return res.status(500).json({ error: "Server error" })
    }
}
