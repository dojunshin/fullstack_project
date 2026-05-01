import { Router } from 'express';
import productApi from './product.api.js';
import danawaApi from './danawa.api.js';
import userApi from './user.api.js';

const router = Router();

router.use('/products', productApi);  // /api/products
router.use('/search', danawaApi);     // /api/search
router.use('/users', userApi);        // /api/users

export default router;
