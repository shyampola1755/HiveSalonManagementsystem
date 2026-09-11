import express from 'express';
import http from 'http';
import { Server as SocketIOServer } from 'socket.io';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import mongoose from 'mongoose';
import { ENV } from './config/env';
import { connectDB } from './config/db';
import { errorHandler } from './middleware/rbac';

// Routes
import authRoutes from './routes/auth.routes';
import branchesRoutes from './routes/branches.routes';
import customersRoutes from './routes/customers.routes';
import servicesRoutes from './routes/services.routes';
import staffRoutes from './routes/staff.routes';
import appointmentsRoutes from './routes/appointments.routes';
import posRoutes from './routes/pos.routes';
import inventoryRoutes from './routes/inventory.routes';
import membershipsRoutes from './routes/memberships.routes';
import financeRoutes from './routes/finance.routes';
import reportsRoutes from './routes/reports.routes';

const app = express();
const server = http.createServer(app);

// Initialize Socket.IO
export const io = new SocketIOServer(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
  },
});

io.on('connection', (socket) => {
  console.log(`[Socket.io] Client connected: ${socket.id}`);

  socket.on('join_branch', (branchId: string) => {
    socket.join(`branch_${branchId}`);
    console.log(`[Socket.io] ${socket.id} joined branch room: branch_${branchId}`);
  });

  socket.on('disconnect', () => {
    console.log(`[Socket.io] Client disconnected: ${socket.id}`);
  });
});

// Middlewares
app.use(helmet({ contentSecurityPolicy: false }));
app.use(cors({ origin: true, credentials: true }));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

if (ENV.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}

// Health Check API
app.get('/api/v1/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'Hive Salon MERN API Server',
    environment: ENV.NODE_ENV,
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
    timestamp: new Date().toISOString(),
  });
});

// API Routes Mounting
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/branches', branchesRoutes);
app.use('/api/v1/customers', customersRoutes);
app.use('/api/v1/services', servicesRoutes);
app.use('/api/v1/staff', staffRoutes);
app.use('/api/v1/appointments', appointmentsRoutes);
app.use('/api/v1/pos', posRoutes);
app.use('/api/v1/inventory', inventoryRoutes);
app.use('/api/v1/memberships', membershipsRoutes);
app.use('/api/v1/finance', financeRoutes);
app.use('/api/v1/reports', reportsRoutes);

// Error Handling Middleware
app.use(errorHandler);

// Connect Database & Start Server
const startServer = async () => {
  try {
    await connectDB();
  } catch (err) {
    console.warn('[Server] Starting in degraded mode (MongoDB not reachable immediately, will retry)');
  }

  server.listen(ENV.PORT, () => {
    console.log(`
=====================================================
  🚀 HIVE SALON MERN API SERVER RUNNING
  📡 Port: http://localhost:${ENV.PORT}
  🛠️ Health: http://localhost:${ENV.PORT}/api/v1/health
  🌍 Environment: ${ENV.NODE_ENV}
=====================================================
    `);
  });
};

if (require.main === module) {
  startServer();
}

export { app, server };
