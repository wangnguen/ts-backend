import { Response as ExpressResponse } from 'express'
import type { ResponseOptions } from '@common/types/index'

declare global {
  namespace Express {
    interface Response {
      ok<T>(data: T, options?: ResponseOptions): ExpressResponse
      created<T>(data: T, options?: ResponseOptions): ExpressResponse
      fail<T>(data: T, options?: ResponseOptions): ExpressResponse
      notFound<T>(data: T, options?: ResponseOptions): ExpressResponse
      unauthorized<T>(data: T, options?: ResponseOptions): ExpressResponse
      forbidden<T>(data: T, options?: ResponseOptions): ExpressResponse
      validationError<T>(data: T, options?: ResponseOptions): ExpressResponse
      internalError<T>(data: T, options?: ResponseOptions): ExpressResponse
    }
  }
}

export {}
