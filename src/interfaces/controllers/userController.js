import {
  CreateReservation, GetReservationHistory, GetReservationById, UpdateReservation, CancelReservation
} from '../../application/use-cases/reservations/reservationUseCases.js';
import { MongoReservationRepository } from '../../infrastructure/database/repositories/MongoReservationRepository.js';
import { MongoTableRepository } from '../../infrastructure/database/repositories/MongoTableRepository.js';

const reservationRepo = new MongoReservationRepository();
const tableRepo = new MongoTableRepository();
const createUseCase = new CreateReservation(reservationRepo, tableRepo);
const historyUseCase = new GetReservationHistory(reservationRepo);
const getByIdUseCase = new GetReservationById(reservationRepo);
const updateUseCase = new UpdateReservation(reservationRepo, tableRepo);
const cancelUseCase = new CancelReservation(reservationRepo);

/**
 * @swagger
 * /api/user/reservations:
 *   post:
 *     tags: [Espace Client]
 *     summary: Effectuer une réservation
 *     description: L'utilisateur connecté réserve une table pour une date/heure spécifique. Valide la capacité et vérifie qu'aucun autre client n'a déjà réservé la table sur ce créneau.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ReservationInput'
 *     responses:
 *       201:
 *         description: Réservation confirmée et générée
 *       400:
 *         description: Conflit détecté (déjà réservée) ou erreur de capacité
 */
export const create = async (req, res, next) => {
  try {
    // Force affectation à l'utilisateur logué (sécurité)
    const result = await createUseCase.execute({ ...req.body, userId: req.user.id });
    res.status(201).json({ success: true, data: result });
  } catch (error) { next(error); }
};

/**
 * @swagger
 * /api/user/reservations/history:
 *   get:
 *     tags: [Espace Client]
 *     summary: Historique de mes réservations
 *     description: Retourne l'historique complet (passé, futur, annulé) des réservations de l'utilisateur demandeur _uniquement_.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema: { type: integer, default: 1 }
 *       - in: query
 *         name: limit
 *         schema: { type: integer, default: 10 }
 *     responses:
 *       200:
 *         description: Historique des listes réservations personnelles
 */
export const getMyHistory = async (req, res, next) => {
  try {
    const { page, limit } = req.pagination;
    const result = await historyUseCase.execute({ userId: req.user.id, page, limit });
    res.status(200).json({ success: true, ...result });
  } catch (error) { next(error); }
};

/**
 * @swagger
 * /api/user/reservations/{id}:
 *   get:
 *     tags: [Espace Client]
 *     summary: Consulter sa réservation
 *     description: Visualiser les détails d'une réservation. Le middleware s'assure d'office qu'elle appartient à l'utilisateur courant.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Réservation trouvée
 */
export const getMine = async (req, res, next) => {
  try {
    const result = await getByIdUseCase.execute(req.params.id);
    if (!result) return res.status(404).json({ success: false, message: 'Introuvable' });
    if (result.user._id.toString() !== req.user.id) return res.status(403).json({ success: false, message: 'Accès interdit' });

    res.status(200).json({ success: true, data: result });
  } catch (error) { next(error); }
};

/**
 * @swagger
 * /api/user/reservations/{id}:
 *   put:
 *     tags: [Espace Client]
 *     summary: Déplacer/Modifier sa réservation
 *     description: Permet au client de modifier la date, l'heure ou la table d'une réservation. Effectue un re-check complet de conflits.
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
 *             $ref: '#/components/schemas/ReservationUpdateInput'
 *     responses:
 *       200:
 *         description: Réservation modifiée
 */
export const updateMine = async (req, res, next) => {
  try {
    const result = await updateUseCase.execute(req.params.id, req.body, req.user.id, req.user.role);
    res.status(200).json({ success: true, data: result });
  } catch (error) { next(error); }
};

/**
 * @swagger
 * /api/user/reservations/{id}/cancel:
 *   patch:
 *     tags: [Espace Client]
 *     summary: Annuler sa réservation
 *     description: Modifie le statut de la réservation assignée en CANCELLED et libère la table sur le créneau. Ne supprime pas de la BDD pour l'historique.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Réservation annulée status "CANCELLED"
 */
export const cancelMine = async (req, res, next) => {
  try {
    const result = await cancelUseCase.execute(req.params.id, req.user.id, req.user.role);
    res.status(200).json({ success: true, data: result });
  } catch (error) { next(error); }
};
