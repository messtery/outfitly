import express from 'express'
import * as customerController from '../controllers/admin/customerController.js'
import * as orderController from '../controllers/admin/orderController.js'
import * as productController from '../controllers/admin/productController.js'
// import * as categoryController from '../controllers/admin/categoryController.js'

const router = express.Router()

router.post('/customers', customerController.create);
router.get('/customers', customerController.findAll);
router.get('/customers/:id', customerController.findOne);
router.patch('/customers/:id', customerController.update);
router.delete('/customers/:id', customerController.remove);

router.post('/orders', orderController.create);
router.get('/orders', orderController.findAll);
router.get('/orders/:id', orderController.findOne);
router.patch('/orders/:id', orderController.update);
router.delete('/orders/:id', orderController.remove);

// router.use('/orders/:orderId/items', orderItemRoutes);
// router.use('/api', categoryRoutes);

router.post('/products', productController.createProduct);
router.get('/products', productController.getProducts);
router.get('/products/:id', productController.getProductById);
router.put('/products/:id', productController.updateProduct);
router.delete('/products/:id', productController.deleteProduct);

export default router