import { Router } from 'express';
import {
  createClient,getActiveClients,getClient,updateClient,
  toggleClientStatus,addOrderToHistory,removeOrderFromHistory} from '../controllers/clientControl';
import {adminMiddleware, authMiddleware} from '../middlewares/authMiddleware'; // Admin authentication middleware

const router = Router();

// Public routes
router.post('/create', createClient);
router.get('/active', authMiddleware, adminMiddleware, getActiveClients);
router.get('/:id', authMiddleware, adminMiddleware, getClient);
router.put('/:id', authMiddleware, updateClient);

// Admin-only routes - now passing 'admin' as the required role
router.put('/:id/status', authMiddleware, adminMiddleware, toggleClientStatus);
router.post('/:id/order', authMiddleware, adminMiddleware, addOrderToHistory);
router.delete('/:id/order', authMiddleware, adminMiddleware, removeOrderFromHistory);

export default router;
