import { Response as ExpressResponse } from 'express'
import type { SuccessPayload, ErrorPayload } from '@common/types/index'

declare global {
  namespace Express {
    interface Response {
      ok<T>(data: T, payload?: SuccessPayload<T>): ExpressResponse
      created<T>(data: T, payload?: SuccessPayload<T>): ExpressResponse
      fail(data: unknown, payload?: ErrorPayload): ExpressResponse
      notFound(data: unknown, payload?: ErrorPayload): ExpressResponse
      validationError(data: unknown, payload?: ErrorPayload): ExpressResponse
      internalError(data: unknown, payload?: ErrorPayload): ExpressResponse
    }
  }
}

export {}
