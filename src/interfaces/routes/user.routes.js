import { Router } from 'express';
import { create, getMyHistory, getMine, updateMine, cancelMine } from '../controllers/userController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';
import { roleMiddleware } from '../middlewares/roleMiddleware.js';
import { paginate } from '../middlewares/paginate.js';

const router = Router();

// Toutes les routes user nécessitent d'être identifié
router.use(authMiddleware);
// Optionnellement, bloquer certains types, mais par défaut CLIENT et ADMIN peuvent au moins réserver comme client normal
router.use(roleMiddleware('CLIENT', 'ADMIN'));

// Priorité statique
router.get('/reservations/history', paginate, getMyHistory);
router.post('/reservations', create);
router.get('/reservations/:id', getMine);
router.put('/reservations/:id', updateMine);
router.patch('/reservations/:id/cancel', cancelMine);

export default router;
