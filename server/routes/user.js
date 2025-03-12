import express from 'express';

import { register,updateSubscription, verifyAppVersionAndUserSubscriptionPlan } from '../controllers/user.js';
import { getAllUsers } from '../controllers/admin.js'
import { authMiddleware } from '../middlewares/authMiddleware.js';

const router = express.Router();
router.post('/register', register);
router.get('/verify/:gmail', verifyAppVersionAndUserSubscriptionPlan);
router.post('/updateSubscription', updateSubscription);
router.get('/getAllUsers',authMiddleware,getAllUsers)

export default router;
