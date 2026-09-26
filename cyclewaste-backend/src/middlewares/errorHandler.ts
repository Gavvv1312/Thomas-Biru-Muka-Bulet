import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/errors';
import { errorResponse } from '../utils/response';
import { ZodError } from 'zod';

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error('Error:', err);

  if (err instanceof ZodError) {
    const messages = err.errors.map((e) => `${e.path.join('.')}: ${e.message}`).join('; ');
    return res.status(400).json(errorResponse(messages));
  }

  if (err instanceof AppError) {
    return res.status(err.statusCode).json(errorResponse(err.message));
  }

  return res.status(500).json(errorResponse('Terjadi kesalahan server'));
};

export const notFoundHandler = (req: Request, res: Response) => {
  res.status(404).json(errorResponse(`Route ${req.method} ${req.path} tidak ditemukan`));
};