import { unlockLink } from "../services/index.ts"
import type { Request, Response } from "express"

export async function unlockController(req: Request, res: Response) {
    const { code } = req.params
    const { password } = req.body

    if (!code) {
        return res.status(400).json({ error: "Code required" })
    }

    if (!password || typeof password !== "string") {
        return res.status(400).json({ error: "Password required" })
    }

    try {
        const url = await unlockLink(code, password)
        return res.status(200).json({ url })
        
    } catch (error) {
        if (error instanceof Error) {
            switch (error.message) {
                case "NOT_FOUND":
                    return res.status(404).json({ error: "Link not found" })

                case "NOT_PROTECTED":
                    return res
                        .status(409)
                        .json({ error: "Link is not protected" })

                case "INVALID_PASSWORD":
                    return res.status(401).json({ error: "Invalid password" })
            }
        }

        console.error(`Failed to unlock: ${error}`)
        return res.status(500).json({ error: "Server error" })
    }
}
