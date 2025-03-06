import express from 'express';

import { register } from '../controllers/user.js';
import { getAllUsers } from '../controllers/admin.js'
import { authMiddleware } from '../middlewares/authMiddleware.js';

const router = express.Router();
router.post('/register', register);
router.get('/getAllUsers',authMiddleware,getAllUsers)

export default router;
