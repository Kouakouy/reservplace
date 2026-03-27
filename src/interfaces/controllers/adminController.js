import {
  CreateRestaurant, UpdateRestaurant, DeleteRestaurant
} from '../../application/use-cases/restaurants/restaurantUseCases.js';
import {
  CreateTable, UpdateTable, DeleteTable
} from '../../application/use-cases/tables/tableUseCases.js';
import {
  GetAllReservations, GetReservationById, CancelReservation
} from '../../application/use-cases/reservations/reservationUseCases.js';

import { MongoRestaurantRepository } from '../../infrastructure/database/repositories/MongoRestaurantRepository.js';
import { MongoTableRepository } from '../../infrastructure/database/repositories/MongoTableRepository.js';
import { MongoReservationRepository } from '../../infrastructure/database/repositories/MongoReservationRepository.js';

const restaurantRepo = new MongoRestaurantRepository();
const tableRepo = new MongoTableRepository();
const reservationRepo = new MongoReservationRepository();

const createRest = new CreateRestaurant(restaurantRepo);
const updateRest = new UpdateRestaurant(restaurantRepo);
const deleteRest = new DeleteRestaurant(restaurantRepo);

const createTab = new CreateTable(tableRepo, restaurantRepo);
const updateTab = new UpdateTable(tableRepo);
const deleteTab = new DeleteTable(tableRepo);

const getAllResv = new GetAllReservations(reservationRepo);
const getByIdResv = new GetReservationById(reservationRepo);
const cancelResv = new CancelReservation(reservationRepo);

// --- RESTAURANTS ---
/**
 * @swagger
 * /api/admin/restaurants:
 *   post:
 *     tags: [Espace Admin]
 *     summary: Créer un établissement
 *     description: Permet à l'administrateur du système d'ajouter un nouveau restaurant franchisé au réseau.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RestaurantInput'
 *     responses:
 *       201:
 *         description: Restaurant sauvegardé
 */
export const createRestaurant = async (req, res, next) => {
  try { res.status(201).json({ success: true, data: await createRest.execute(req.body) }); } catch (error) { next(error); }
};

/**
 * @swagger
 * /api/admin/restaurants/{id}:
 *   put:
 *     tags: [Espace Admin]
 *     summary: Mettre à jour un établissement
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RestaurantInput'
 *     responses:
 *       200:
 *         description: Restaurant mis à jour
 */
export const updateRestaurant = async (req, res, next) => {
  try { res.status(200).json({ success: true, data: await updateRest.execute(req.params.id, req.body) }); } catch (error) { next(error); }
};

/**
 * @swagger
 * /api/admin/restaurants/{id}:
 *   delete:
 *     tags: [Espace Admin]
 *     summary: Supprimer un établissement
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Restaurant supprimé
 */
export const deleteRestaurant = async (req, res, next) => {
  try { res.status(200).json({ success: true, ...(await deleteRest.execute(req.params.id)) }); } catch (error) { next(error); }
};

// --- TABLES ---
/**
 * @swagger
 * /api/admin/tables:
 *   post:
 *     tags: [Espace Admin]
 *     summary: Ajouter une table
 *     description: Lie une nouvelle table avec sa capacité à un restaurant physique précis.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/TableInput'
 *     responses:
 *       201:
 *         description: Table associée
 */
export const createTable = async (req, res, next) => {
  try { res.status(201).json({ success: true, data: await createTab.execute(req.body) }); } catch (error) { next(error); }
};

/**
 * @swagger
 * /api/admin/tables/{id}:
 *   put:
 *     tags: [Espace Admin]
 *     summary: Modifier une table
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/TableInput'
 *     responses:
 *       200:
 *         description: Table modifiée
 */
export const updateTable = async (req, res, next) => {
  try { res.status(200).json({ success: true, data: await updateTab.execute(req.params.id, req.body) }); } catch (error) { next(error); }
};

/**
 * @swagger
 * /api/admin/tables/{id}:
 *   delete:
 *     tags: [Espace Admin]
 *     summary: Retirer une table
 *     description: Désactive logiquement (isActive=false) une table d'un restaurant pour qu'elle n'apparaisse plus en public lors des réservations.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Table désactivée
 */
export const deleteTable = async (req, res, next) => {
  try { res.status(200).json({ success: true, ...(await deleteTab.execute(req.params.id)) }); } catch (error) { next(error); }
};

// --- RESERVATIONS ---
/**
 * @swagger
 * /api/admin/reservations:
 *   get:
 *     tags: [Espace Admin]
 *     summary: Dashboard des réservations
 *     description: Permet à l'Administrateur de voir toutes les réservations passées ou futures du système, quel que soit l'utilisateur.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema: { type: integer, default: 1 }
 *       - in: query
 *         name: limit
 *         schema: { type: integer, default: 10 }
 *       - in: query
 *         name: status
 *         schema: { type: string, enum: [ACTIVE, CANCELLED] }
 *     responses:
 *       200:
 *         description: Réservations globales
 */
export const getAllReservations = async (req, res, next) => {
  try {
    const { page, limit } = req.pagination;
    const { date, status, restaurantId } = req.query;
    const filters = { page, limit, date, status, restaurantId };
    res.status(200).json({ success: true, ...(await getAllResv.execute(filters)) });
  } catch (error) { next(error); }
};

/**
 * @swagger
 * /api/admin/reservations/{id}:
 *   get:
 *     tags: [Espace Admin]
 *     summary: Forcer la vue d'une réservation tierce
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Détail
 */
export const getReservation = async (req, res, next) => {
  try { res.status(200).json({ success: true, data: await getByIdResv.execute(req.params.id) }); } catch (error) { next(error); }
};

/**
 * @swagger
 * /api/admin/reservations/{id}/cancel:
 *   patch:
 *     tags: [Espace Admin]
 *     summary: Forcer l'annulation d'une réservation client
 *     description: Règle métier - l'admin est capable d'annuler n'importe quelle réservation (force majeure, restaurant fermé).
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Réservation annulée administrativement
 */
export const overrideCancelReservation = async (req, res, next) => {
  try { res.status(200).json({ success: true, data: await cancelResv.execute(req.params.id, req.user.id, req.user.role) }); } catch (error) { next(error); }
};
