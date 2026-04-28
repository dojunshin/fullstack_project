import { Router } from 'express';
import productApi from './product.api.js';
import danawaApi from './danawa.api.js';

const router = Router();

router.use('/products', productApi);  // /api/products
router.use('/search', danawaApi);     // /api/search

export default router;
