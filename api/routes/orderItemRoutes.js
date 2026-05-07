import express from 'express';
import * as ctrl from '../controllers/orderItemController.js';
import authMiddleware from '../middlewares/authMiddleware.js';

const router = express.Router({ mergeParams: true });

router.post('/', authMiddleware, ctrl.create);
router.get('/', authMiddleware, ctrl.findAll);
router.get('/:id', authMiddleware, ctrl.findOne);
router.patch('/:id', authMiddleware, ctrl.update);
router.delete('/:id', authMiddleware, ctrl.remove);

export default router;