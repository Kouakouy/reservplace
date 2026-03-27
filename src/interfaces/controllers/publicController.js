import { GetAllRestaurants, GetRestaurantById } from '../../application/use-cases/restaurants/restaurantUseCases.js';
import { GetAvailableTables, GetAllTables } from '../../application/use-cases/tables/tableUseCases.js';
import { MongoRestaurantRepository } from '../../infrastructure/database/repositories/MongoRestaurantRepository.js';
import { MongoTableRepository } from '../../infrastructure/database/repositories/MongoTableRepository.js';

const restaurantRepo = new MongoRestaurantRepository();
const tableRepo = new MongoTableRepository();
const getAllRestsUseCase = new GetAllRestaurants(restaurantRepo);
const getByIdRestUseCase = new GetRestaurantById(restaurantRepo);
const getAvailableTablesUseCase = new GetAvailableTables(tableRepo);
const getAllTablesUseCase = new GetAllTables(tableRepo);

/**
 * @swagger
 * /api/public/restaurants:
 *   get:
 *     tags: [Public]
 *     summary: Lister les restaurants 
 *     description: Permet à tout le monde de consulter le catalogue des restaurants. Supporte la recherche par texte (nom, adresse) et la pagination.
 *     parameters:
 *       - in: query
 *         name: page
 *         schema: { type: integer, default: 1 }
 *         description: Numéro de la page
 *       - in: query
 *         name: limit
 *         schema: { type: integer, default: 10 }
 *         description: Nombre de résultats par page
 *       - in: query
 *         name: search
 *         schema: { type: string }
 *         description: Texte de recherche
 *     responses:
 *       200:
 *         description: Liste paginée des restaurants
 */
export const getRestaurants = async (req, res, next) => {
  try {
    const { page, limit } = req.pagination;
    const { search } = req.query;
    const result = await getAllRestsUseCase.execute({ page, limit, search });
    res.status(200).json({ success: true, ...result });
  } catch (error) { next(error); }
};

/**
 * @swagger
 * /api/public/restaurants/{id}:
 *   get:
 *     tags: [Public]
 *     summary: Consulter un restaurant (Détail)
 *     description: Récupère la fiche détaillée d'un restaurant spécifique à l'aide de son ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Détail du restaurant
 *       404:
 *         description: Restaurant introuvable
 */
export const getRestaurant = async (req, res, next) => {
  try {
    const result = await getByIdRestUseCase.execute(req.params.id);
    res.status(200).json({ success: true, data: result });
  } catch (error) { next(error); }
};

/**
 * @swagger
 * /api/public/restaurants/{id}/tables:
 *   get:
 *     tags: [Public]
 *     summary: Lister toutes les tables d'un restaurant
 *     description: Liste la configuration physique des tables d'un restaurant donné.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Liste des tables
 */
export const getRestaurantTables = async (req, res, next) => {
  try {
    const { page, limit } = req.pagination;
    const result = await getAllTablesUseCase.execute({ page, limit, restaurantId: req.params.id });
    res.status(200).json({ success: true, ...result });
  } catch (error) { next(error); }
};

/**
 * @swagger
 * /api/public/tables/available:
 *   get:
 *     tags: [Public]
 *     summary: Rechercher des tables disponibles
 *     description: Permet aux clients de rechercher les tables libres sur le créneau horaire souhaité. Les tables déjà réservées (statut ACTIVE avec croisement d'horaire) sont exclues.
 *     parameters:
 *       - in: query
 *         name: date
 *         required: true
 *         schema: { type: string, format: date }
 *         example: "2026-04-15"
 *       - in: query
 *         name: startTime
 *         required: true
 *         schema: { type: string }
 *         example: "19:00"
 *       - in: query
 *         name: endTime
 *         required: true
 *         schema: { type: string }
 *         example: "21:00"
 *       - in: query
 *         name: capacity
 *         schema: { type: integer }
 *         description: Capacité minimale de convives
 *       - in: query
 *         name: restaurantId
 *         schema: { type: string }
 *         description: Restreindre la recherche à un restaurant spécifique
 *     responses:
 *       200:
 *         description: Liste des tables libres (non conflictuelles sur cet horaire précis)
 */
export const getAvailable = async (req, res, next) => {
  try {
    const { date, startTime, endTime, capacity, restaurantId } = req.query;
    const result = await getAvailableTablesUseCase.execute({ date, startTime, endTime, capacity, restaurantId });
    res.status(200).json({ success: true, data: result, count: result.length });
  } catch (error) { next(error); }
};
