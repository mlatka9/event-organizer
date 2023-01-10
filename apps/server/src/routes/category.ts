import { Router } from 'express';
import categoriesRouter from './../controllers/categories';

const router = Router();

router.get('/', categoriesRouter.getAll);
router.post('/', categoriesRouter.create);

export default router;
