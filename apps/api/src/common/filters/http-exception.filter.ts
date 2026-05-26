import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

interface ErrorBody {
  code: string;
  message: string;
  fields?: Record<string, string>;
}

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const exceptionResponse =
      exception instanceof HttpException
        ? exception.getResponse()
        : null;

    this.logger.error(
      `${request.method} ${request.url}`,
      exception instanceof Error ? exception.stack : exception,
    );

    const error = this.buildErrorBody(status, exceptionResponse, exception);

    response.status(status).json({
      ok: false,
      error,
    });
  }

  private buildErrorBody(
    status: number,
    exceptionResponse: unknown,
    exception: unknown,
  ): ErrorBody {
    const codeMap: Record<number, string> = {
      [HttpStatus.BAD_REQUEST]: 'bad_request',
      [HttpStatus.UNAUTHORIZED]: 'unauthorized',
      [HttpStatus.FORBIDDEN]: 'forbidden',
      [HttpStatus.NOT_FOUND]: 'not_found',
      [HttpStatus.CONFLICT]: 'conflict',
      [HttpStatus.UNPROCESSABLE_ENTITY]: 'validation_failed',
      [HttpStatus.TOO_MANY_REQUESTS]: 'rate_limited',
      [HttpStatus.INTERNAL_SERVER_ERROR]: 'internal_error',
    };

    const code = codeMap[status] || 'unknown_error';

    if (!exceptionResponse) {
      return {
        code,
        message:
          exception instanceof Error
            ? exception.message
            : 'Internal server error',
      };
    }

    const resp = exceptionResponse as Record<string, unknown>;

    let message = 'Internal server error';
    if (typeof resp === 'string') {
      message = resp;
    } else if (typeof resp.message === 'string') {
      message = resp.message;
    } else if (Array.isArray(resp.message)) {
      message = (resp.message as string[]).join('; ');
    }

    let fields: Record<string, string> | undefined;
    if (Array.isArray(resp.message)) {
      const msgs = resp.message as string[];
      fields = {};
      for (const msg of msgs) {
        const match = msg.match(/^(\w+)\s/);
        if (match) {
          fields[match[1]] = msg;
        }
      }
      if (Object.keys(fields).length === 0) fields = undefined;
    }

    return { code, message, ...(fields ? { fields } : {}) };
  }
}
