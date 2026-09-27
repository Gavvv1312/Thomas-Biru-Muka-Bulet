import 'express-async-errors';
import express from 'express';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import { config } from './config';
import { errorHandler, notFoundHandler } from './middlewares/errorHandler';
import { successResponse } from './utils/response';

import authRoutes from './routes/auth';
import deviceRoutes from './routes/devices';
import transactionRoutes from './routes/transactions';
import usersRoutes from './routes/users';
import dropoffRoutes from './routes/dropoff';
import { swaggerSpec } from './docs/swagger';

const app = express();

app.use(cors({
  origin: true,
  credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check
app.get('/api/health', (req, res) => {
  res.json(successResponse({ status: 'ok', timestamp: new Date().toISOString() }, 'Server aktif'));
});

// Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/devices', deviceRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/dropoff-points', dropoffRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

export default app;
