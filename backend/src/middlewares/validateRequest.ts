import { NextFunction, Request, Response } from 'express'
import { AnyZodObject, ZodError } from 'zod'

interface RequestValidators {
  body?: AnyZodObject
  params?: AnyZodObject
  query?: AnyZodObject
}

// prettier-ignore
const validateRequest =
  (validators: RequestValidators) =>
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        if (validators.body) {
          req.body = await validators.body.parseAsync(req.body)
        }
        if (validators.params) {
          req.params = await validators.params.parseAsync(req.params)
        }
        if (validators.query) {
          req.query = await validators.query.parseAsync(req.query)
        }

        return next()
      } catch (error) {
        if (error instanceof ZodError) {
          return res.status(422).json(error)
        }
        return next(error)
      }
    }

export default validateRequest
