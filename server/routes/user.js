import express from 'express';
import { registerOrLogin, addVillage } from '../controllers/user.js';

const router = express.Router();

router.post('/registerOrLogin', registerOrLogin);
router.post('/addVillage', addVillage);

export default router;
