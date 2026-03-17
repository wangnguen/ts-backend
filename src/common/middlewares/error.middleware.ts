import { NextFunction, Request, Response } from 'express'
import env from '~/common/config/env.js'

const notFound = (req: Request, res: Response) => {
  res.status(404).json({ error: 'Not Found' })
}

const errorHandler = (err: Error, req: Request, res: Response, _next: NextFunction) => {
  console.error(err.stack)
  res.status(500).json({
    error: 'Internal Server Error',
    ...(env.NODE_ENV === 'development' && {
      message: err.message,
      stack: err.stack
    })
  })
}

export { notFound, errorHandler }
