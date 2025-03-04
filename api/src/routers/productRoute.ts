import { Router } from 'express';
import { createProduct, getAllProducts, getProductById, updateProduct, deleteProducts } from '../controllers/productControl';
import {authMiddleware, adminMiddleware} from '../middlewares/authMiddleware'

const router = Router();


router.post('/create', authMiddleware, adminMiddleware, createProduct); // Only admin can create
router.get('/', getAllProducts);
router.get('/:id',  getProductById);
router.put('/:id', authMiddleware, adminMiddleware, updateProduct); // Only admin can update product
router.delete('/', authMiddleware, adminMiddleware, deleteProducts); // Only admin can delete product

export default router;
