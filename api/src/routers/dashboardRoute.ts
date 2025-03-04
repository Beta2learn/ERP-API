import express from 'express';
import { getStockReport, getMonthlyRevenue } from '../controllers/dashboardcontrol';
import { authMiddleware } from '../middlewares/authMiddleware';

const router = express.Router();

// Protected routes for dashboard reports
 router.get('/stock', authMiddleware, getStockReport);
 router.get('/revenue', authMiddleware, getMonthlyRevenue);

export default router;
