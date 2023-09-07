import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  private logger = new Logger('HTTP');
  use(req: Request, res: Response, next: NextFunction) {
    this.logger.log(
      `Logging ${req.method} ${req.baseUrl} status ${res.statusCode}`,
    );
    next();
  }
}
