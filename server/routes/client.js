import express from 'express';
import { addClient, updateClient, getClients } from '../controllers/client.js';

const router = express.Router();

router.post('/addClient', addClient);
router.post('/updateClient', updateClient);
router.get('/:villageId', getClients);

export default router;
