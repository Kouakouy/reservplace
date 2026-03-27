import { Router } from 'express';
import { 
  registerUser, loginUser, 
  requestAdminCode, loginAdmin, loginAdminSimple, 
  getMe 
} from '../controllers/authController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';

const router = Router();

// Routes Clients
router.post('/user/register', registerUser);
router.post('/user/login', loginUser);

// Routes Admins (Inscription en 2 étapes + Connexion classique)
router.post('/admin/register-step1', requestAdminCode);
router.post('/admin/register-step2', loginAdmin); // L'ancien MFA devient la validation
router.post('/admin/login', loginAdminSimple); // L'authentification classique

// Route Commune
router.get('/me', authMiddleware, getMe);

export default router;
