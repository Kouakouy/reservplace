import swaggerJSDoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'ReservPlace API',
      version: '1.0.0',
      description: 'API du système de réservation de tables de restaurants (Architecture Clean/DDD)',
      contact: {
        name: 'API Support',
        email: 'support@reservplace.com',
      },
    },
    servers: [
      {
        url: process.env.API_URL || 'http://localhost:5000',
        description: process.env.NODE_ENV === 'production' ? 'Serveur de production' : 'Serveur de développement',
      },
    ],
    tags: [
      { name: 'Auth (Client)',  description: 'Inscription et connexion des clients' },
      { name: 'Auth (Admin)',   description: "Inscription (2 étapes par email) et connexion des administrateurs" },
      { name: 'Auth (Commun)', description: 'Profil de l\'utilisateur connecté' },
      { name: 'Public',        description: 'Endpoints accessibles sans authentification' },
      { name: 'Espace Admin',  description: 'Gestion des restaurants, tables et réservations (Admin uniquement)' },
      { name: 'Espace Client', description: 'Réservations personnelles du client connecté' },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Fournir le token JWT obtenu avec /api/auth/login',
        },
      },
      schemas: {
        AuthResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: true },
            data: {
              type: 'object',
              properties: {
                token: { type: 'string', example: 'eyJhbGciOiJIUzI1NiIsIn...' },
                user: {
                  type: 'object',
                  properties: {
                    id: { type: 'string', example: '65eaf1234567890abc' },
                    name: { type: 'string', example: 'Jean Dupont' },
                    email: { type: 'string', example: 'jean@example.com' },
                    role: { type: 'string', example: 'CLIENT' },
                  },
                },
              },
            },
          },
        },
        RestaurantInput: {
          type: 'object',
          required: ['name', 'address'],
          properties: {
            name: { type: 'string', example: 'Le Gourmet' },
            address: { type: 'string', example: '123 Avenue des Champs' },
            description: { type: 'string', example: 'Restaurant français' },
            phone: { type: 'string', example: '+33123456789' },
            openingHours: {
              type: 'object',
              example: {
                lundi: { open: '12:00', close: '23:00' },
                mardi: { open: '12:00', close: '23:00' },
              },
            },
          },
        },
        TableInput: {
          type: 'object',
          required: ['restaurant', 'number', 'capacity'],
          properties: {
            restaurant: { type: 'string', description: 'ID du restaurant', example: '65eaf1234567890abc' },
            number: { type: 'integer', example: 12 },
            capacity: { type: 'integer', example: 4 },
            description: { type: 'string', example: 'Près de la fenêtre' },
          },
        },
        ReservationInput: {
          type: 'object',
          required: ['tableId', 'date', 'startTime', 'endTime'],
          properties: {
            tableId: { type: 'string', example: '65eb123456789abc' },
            date: { type: 'string', format: 'date', example: '2026-04-15' },
            startTime: { type: 'string', example: '19:00' },
            endTime: { type: 'string', example: '21:00' },
            guestCount: { type: 'integer', example: 2 },
            notes: { type: 'string', example: 'Anniversaire' },
          },
        },
        ReservationUpdateInput: {
          type: 'object',
          properties: {
            date: { type: 'string', format: 'date', example: '2026-04-16' },
            startTime: { type: 'string', example: '20:00' },
            endTime: { type: 'string', example: '22:00' },
            guestCount: { type: 'integer', example: 4 },
            notes: { type: 'string', example: 'Un peu de retard prévu' },
            tableId: { type: 'string', example: '65eb123456789abc' },
          },
        },
      },
    },
  },
  apis: ['./src/interfaces/routes/*.js', './src/interfaces/controllers/*.js'],
};

export const swaggerSpec = swaggerJSDoc(options);
