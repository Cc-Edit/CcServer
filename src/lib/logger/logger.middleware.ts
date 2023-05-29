import { NextFunction, Request, Response } from 'express';
import { Logger } from './logger.util';

export function LoggerMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  next();
}
