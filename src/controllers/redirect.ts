import { handleRedirect } from "../services/index.js"
import type { Request, Response } from "express"

export async function redirectController(req: Request, res: Response) {
    const { code } = req.params
    const { password } = req.query

    if (!code) {
        return res.status(400).json({ error: "Code required" })
    }

    if (password && typeof password !== "string") {
        return res.status(400).json({ error: "Invalid password format" })
    }

    try {
        const originalUrl = await handleRedirect(code, password)
        return res.redirect(301, originalUrl)
    } catch (error) {
        if (error instanceof Error) {
            if (error.message === "NOT_FOUND") {
                return res.status(404).json({ error: "Link not found" })
            }

            if (error.message === "NEED_PASSWORD") {
                return res
                    .status(401)
                    .json({ error: "Password required", protected: true })
            }
        }

        console.error(`Failed to redirect: ${error}`)
        return res.status(500).json({ error: "Server error" })
    }
}
