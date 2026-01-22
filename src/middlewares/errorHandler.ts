import { Request, Response, NextFunction } from "express"
import { AppError } from "../errors/AppError.ts"

export function errorHandler(
    err: unknown,
    _req: Request,
    res: Response,
    _next: NextFunction
) {
    console.error("Error caught:", err)

    if (err instanceof AppError) {
        return res.status(err.statusCode).json({
            error: err.message,
        })
    }

    if (err instanceof Error) {
        return res.status(500).json({
            error: err.message || "INTERNAL_SERVER_ERROR",
        })
    }

    return res.status(500).json({
        error: "UNKNOWN_ERROR",
    })
}
