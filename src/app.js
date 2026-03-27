import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import swaggerUi from 'swagger-ui-express';

// Nouvelles Routes Segmentées
import authRoutes from './interfaces/routes/auth.routes.js';
import publicRoutes from './interfaces/routes/public.routes.js';
import userRoutes from './interfaces/routes/user.routes.js';
import adminRoutes from './interfaces/routes/admin.routes.js';

// Middlewares
import { errorHandler } from './interfaces/middlewares/errorHandler.js';
import { swaggerSpec } from './infrastructure/config/swagger.js';

const app = express();

// Middlewares globaux
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Documentation Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Routes de l'API restructurées
app.use('/api/auth', authRoutes);
app.use('/api/public', publicRoutes);
app.use('/api/user', userRoutes);
app.use('/api/admin', adminRoutes);

// Route d'accueil simple
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Bienvenue sur la ReservPlace API',
    documentation: '/api-docs',
  });
});

// Route non trouvée (404)
app.use((req, res, next) => {
  res.status(404).json({ success: false, message: 'Route introuvable' });
});

// Gestionnaire global d'erreurs
app.use(errorHandler);

export default app;
