import express from 'express';
import * as ctrl from '../controllers/customerController.js';

const router = express.Router();

router.post('/', ctrl.create);
router.get('/', ctrl.findAll);
router.get('/:id', ctrl.findOne);
router.patch('/:id', ctrl.update);
router.delete('/:id', ctrl.remove);

export default router;