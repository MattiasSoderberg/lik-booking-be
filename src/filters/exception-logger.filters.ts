import { Catch, ArgumentsHost, Logger, ExecutionContext } from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';

@Catch()
export class ExceptionLoggerFilter extends BaseExceptionFilter {
  private logger = new Logger(ExceptionLoggerFilter.name);
  catch(exception: ExecutionContext, host: ArgumentsHost) {
    const httpContext = host.switchToHttp();
    const request = httpContext.getRequest();
    const response = httpContext.getResponse();

    const { method, originalUrl } = request;
    const { status, message } = exception['response'];

    this.logger.error(`${method} ${originalUrl} ${status} ${message}`);
    super.catch(exception, host);
  }
}
