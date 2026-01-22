import rateLimit from 'express-rate-limit'

export const generalLimiter = rateLimit({
    windowMs: 60 * 1000, // 1 min
    max: 100,
    message: {error: 'Too many attempts. Try again in 1 minute.'}
})

export const createLinkLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 min
    max: 50,
    message: { error: 'Too many requests. Try again in 15 minutes.'},
    standardHeaders: true,
    legacyHeaders: false
})
