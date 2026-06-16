import express from 'express';
import authMiddleware from './middlewares/authMiddleware.js';
import adminAuthMiddleware from './middlewares/adminAuthMiddleware.js';
import customerRoutes from './routes/customerRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import orderItemRoutes from './routes/orderItemRoutes.js';
import categoryRoutes from './routes/categoryRoutes.js';
import productRoutes from './routes/productRoutes.js';
import chatRoutes from './routes/chatRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import {checkout} from './controllers/checkoutController.js';
import { checkPaymentStatus } from './controllers/paymentController.js';
import {
  get as getCartItems,
  create as createCart,
  update as updateCartItem,
  remove as removeCartItem,
} from './controllers/cartItemController.js'
import {
  login,
  register,
  updateMe,
  changePassword,
} from './controllers/authController.js'
import { login as adminLogin } from './controllers/admin/adminAuthController.js';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(cors({
  origin: 'http://localhost:5173'
}));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const api = express.Router();

api.post('/admin/auth/login', adminLogin);
api.use('/admin', adminAuthMiddleware, adminRoutes);

api.post('/auth/login', login);
api.post('/auth/register', register);
api.patch('/auth/me', authMiddleware, updateMe);
api.patch('/auth/password', authMiddleware, changePassword);

api.use('/customers', customerRoutes);
api.use('/orders', orderRoutes);
api.use('/orders/:orderId/items', orderItemRoutes);
api.use(categoryRoutes);
api.use('/products', productRoutes);
api.use('/chat', chatRoutes);

api.get('/cart-items', authMiddleware, getCartItems);
api.post('/cart-items', authMiddleware, createCart);
api.put('/cart-items', authMiddleware, updateCartItem);
api.delete('/cart-items/:id', authMiddleware, removeCartItem);

api.post('/checkout', authMiddleware, checkout);
api.get('/orders/:id/payment-status', authMiddleware, checkPaymentStatus);

app.use('/api', api);

app.get('/', (req, res) => {
  res.json({
    status: 200,
    message: 'API is running',
  });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
})
