import express from 'express';
import * as ctrl from '../controllers/orderController.js';
import authMiddleware from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/', authMiddleware, ctrl.create);
router.get('/', authMiddleware, ctrl.findAll);
router.get('/:id', authMiddleware, ctrl.findOne);
router.patch('/:id', authMiddleware, ctrl.update);
router.delete('/:id', authMiddleware, ctrl.remove);

export default router;