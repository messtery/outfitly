import express from 'express'
import * as customerController from '../controllers/admin/customerController.js'
import * as orderController from '../controllers/admin/orderController.js'
import * as productController from '../controllers/admin/productController.js'
import * as roleController from '../controllers/admin/roleController.js'
import * as userController from '../controllers/admin/userController.js'
import * as adminAuthController from '../controllers/admin/adminAuthController.js'
import { upload } from '../middlewares/uploadMiddleware.js'
// import * as categoryController from '../controllers/admin/categoryController.js'

const router = express.Router()

router.get('/auth/me', adminAuthController.me);
router.patch('/auth/me', adminAuthController.updateMe);
router.patch('/auth/password', adminAuthController.changePassword);

router.post('/customers', customerController.create);
router.get('/customers', customerController.findAll);
router.delete('/customers/bulk', customerController.bulkRemove);
router.get('/customers/:id', customerController.findOne);
router.patch('/customers/:id', customerController.update);
router.delete('/customers/:id', customerController.remove);

router.post('/orders', orderController.create);
router.get('/orders', orderController.findAll);
router.delete('/orders/bulk', orderController.bulkRemove);
router.get('/orders/:id', orderController.findOne);
router.patch('/orders/:id', orderController.update);
router.delete('/orders/:id', orderController.remove);;

// router.use('/orders/:orderId/items', orderItemRoutes);
// router.use('/api', categoryRoutes);

router.post('/products', upload.single('image'), productController.createProduct);
router.get('/products', productController.getProducts);
router.delete('/products/bulk', productController.bulkDeleteProducts);
router.get('/products/:id', productController.getProductById);
router.put('/products/:id', upload.single('image'), productController.updateProduct);
router.delete('/products/:id', productController.deleteProduct);

router.get('/roles/all', roleController.findAllSimple);
router.get('/roles', roleController.findAll);
router.post('/roles', roleController.create);
router.delete('/roles/bulk', roleController.bulkRemove);
router.get('/roles/:id', roleController.findOne);
router.patch('/roles/:id', roleController.update);
router.delete('/roles/:id', roleController.remove);

router.get('/users', userController.findAll);
router.post('/users', userController.create);
router.delete('/users/bulk', userController.bulkRemove);
router.get('/users/:id', userController.findOne);
router.patch('/users/:id', userController.update);
router.delete('/users/:id', userController.remove);

export default router