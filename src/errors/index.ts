import { AppError } from "./AppError.ts"

export class ConflictError extends AppError {
    constructor(message = "CODE_TAKEN") {
        super(message, 409)
    }
}

export class NotFoundError extends AppError {
    constructor(message = "NOT_FOUND") {
        super(message, 404)
    }
}

export class ValidationError extends AppError {
    constructor(message = "INVALID_DATA") {
        super(message, 400)
    }
}
