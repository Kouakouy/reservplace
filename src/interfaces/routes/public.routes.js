import { Router } from 'express';
import { getRestaurants, getRestaurant, getRestaurantTables, getAvailable } from '../controllers/publicController.js';
import { paginate } from '../middlewares/paginate.js';

const router = Router();

// Routes Restaurants publics
router.get('/restaurants', paginate, getRestaurants);
router.get('/restaurants/:id', getRestaurant);
router.get('/restaurants/:id/tables', paginate, getRestaurantTables);

// Routes Tables publiques
router.get('/tables/available', getAvailable);

export default router;
