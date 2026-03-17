import { Response as ExpressResponse } from 'express'

declare global {
  namespace Express {
    interface Response {
      ok<T>(data: T, options?: ResponseOptions | string): ExpressResponse
      created<T>(data: T, options?: ResponseOptions | string): ExpressResponse
      fail(error: string, statusCode?: number): ExpressResponse
      notFound(message?: string): ExpressResponse
      unauthorized(message?: string): ExpressResponse
      forbidden(message?: string): ExpressResponse
      validationError(errors: { path: string; message: string }[]): ExpressResponse
    }
  }
}

export {}
