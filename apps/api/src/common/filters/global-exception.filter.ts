import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { formatHumanFriendlyError } from '@hive/utilities';
import type { ApiResponse } from '@hive/types';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let errorPayload = formatHumanFriendlyError(exception);

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const res = exception.getResponse();
      if (typeof res === 'object' && res !== null) {
        const anyRes = res as any;
        errorPayload = {
          code: anyRes.error || `HTTP_${status}`,
          message: Array.isArray(anyRes.message) ? anyRes.message.join(', ') : anyRes.message,
          fieldErrors: anyRes.fieldErrors,
        };
      }
    }

    const standardResponse: ApiResponse = {
      success: false,
      data: null,
      meta: null,
      error: errorPayload,
    };

    response.status(status).json(standardResponse);
  }
}
