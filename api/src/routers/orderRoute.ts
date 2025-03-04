import express from 'express';
import {createOrder,getAllOrders,getOrderById, updateOrder, deleteOrder,
  getOrdersByClient,handleOrderStatusChange,} from '../controllers/orderControl'; 
import {authMiddleware, adminMiddleware} from '../middlewares/authMiddleware';'../middlewares/authMiddleware';

const router = express.Router();

// Apply authMiddleware to protected routes
router.post('/orders', authMiddleware, createOrder); 
router.get('/orders', authMiddleware, adminMiddleware, getAllOrders);

// Get order by ID
router.get('/orders/:id', authMiddleware, getOrderById);

// Update order 
router.put('/orders/:id', authMiddleware, updateOrder);

// Delete order
router.delete('/orders/:id', authMiddleware, adminMiddleware, deleteOrder);  // Only "admin" can delete orders

// Get orders by client 
router.get('/orders/client/:clientId', authMiddleware, getOrdersByClient);

// Handle order status change 
router.put('/orders/:id/status', authMiddleware, adminMiddleware, handleOrderStatusChange);  // Only "admin" can change status

export default router;