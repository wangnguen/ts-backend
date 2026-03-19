export class ResponseUtils {
  constructor(
    public statusCode: number,
    public message?: string,
    public data?: unknown,
    public meta?: unknown,
    public path?: string,
    public timestamp?: string
  ) {}
}
