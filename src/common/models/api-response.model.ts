import type { ResponseType } from '@common/types/index'
export class ApiSuccessResponse<T> {
  constructor(
    public statusCode: number,
    public message: string,
    public data: ResponseType.SuccessData<T>,
    public path: string,
    public timestamp: string
  ) {}
}

export class ApiErrorResponse {
  constructor(
    public statusCode: number,
    public message: string,
    public path: string,
    public timestamp: string,
    public errors?: ResponseType.ValidationErrorItem[]
  ) {}
}
