import express from 'express';
import { registerOrLogin, addVillage, getDaysDetails } from '../controllers/user.js';

const router = express.Router();

router.post('/registerOrLogin', registerOrLogin);
router.post('/addVillage', addVillage);
router.get('/getDaysDetails/:userId', getDaysDetails);

export default router;
