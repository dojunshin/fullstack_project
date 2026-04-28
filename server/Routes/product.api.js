import { Router } from 'express';
import productController from '../Controller/product.controller.js';

const router = Router();

router.get('/', productController.searchProducts);    // GET /api/products?q=...
router.get('/:id', productController.getProductById); // GET /api/products/:id

export default router;
