import { Router } from 'express';
import { 
  createRestaurant, updateRestaurant, deleteRestaurant,
  createTable, updateTable, deleteTable,
  getAllReservations, getReservation, overrideCancelReservation
} from '../controllers/adminController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';
import { roleMiddleware } from '../middlewares/roleMiddleware.js';
import { paginate } from '../middlewares/paginate.js';

const router = Router();
import { registerAdmin } from '../controllers/authController.js';

// Toutes les routes admin nécessitent d'être un ADMIN authentifié
router.use(authMiddleware);
router.use(roleMiddleware('ADMIN'));

// --- UTILISATEURS ADMINS ---
router.post('/users/admin', registerAdmin);

// --- RESTAURANTS ---
router.post('/restaurants', createRestaurant);
router.put('/restaurants/:id', updateRestaurant);
router.delete('/restaurants/:id', deleteRestaurant);

// --- TABLES ---
router.post('/tables', createTable);
router.put('/tables/:id', updateTable);
router.delete('/tables/:id', deleteTable);

// --- RESERVATIONS ---
router.get('/reservations', paginate, getAllReservations);
router.get('/reservations/:id', getReservation);
router.patch('/reservations/:id/cancel', overrideCancelReservation);

export default router;
