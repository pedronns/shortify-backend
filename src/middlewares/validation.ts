import { Request, Response, NextFunction } from 'express'
import Joi from 'joi'

const linkSchema = Joi.object({
  url: Joi.string().uri({ allowRelative: true }).required(),
  password: Joi.string().min(8).max(50).optional(),
  code: Joi.string()
    .regex(/^[a-zA-z0-9_-]{6,20}$/)
    .optional(),
})

export const validateLink = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { error } = linkSchema.validate(req.body)
  if (error) return res.status(400).json({ error: error.details[0].message })
  next()
}
