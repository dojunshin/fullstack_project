import { Router } from 'express';
import danawaController from '../Controller/danawa.controller.js';

const router = Router();

router.get('/', danawaController.search); // GET /api/search?q=...

export default router;
