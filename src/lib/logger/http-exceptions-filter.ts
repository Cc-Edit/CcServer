import {
  Catch,
  HttpException,
  ExceptionFilter,
  ArgumentsHost,
} from '@nestjs/common';
import { Logger } from './logger.util';

@Catch(HttpException)
export class HttpExceptionsFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();
    const status = exception.getStatus();
    const exceptionResponse = exception.getResponse();
    const logFormat = `.....................................................
    Request original url: ${request.originalUrl} - Method: ${request.method}
    IP: ${request.ip} - Status code: ${status}
    Response: ${
      exception.toString() +
      `（${exceptionResponse?.message || exception?.message}）`
    }
.....................................................`;
    status !== 200 && Logger.info(logFormat);
    response.status(status).json({
      code: status,
      error: exceptionResponse?.message || exception.message,
      msg: `${status >= 500 ? 'Service Error' : 'Client Error'}`,
    });
  }
}
