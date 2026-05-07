import express from 'express';
import authMiddleware from './middlewares/authMiddleware.js';
import customerRoutes from './routes/customerRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import orderItemRoutes from './routes/orderItemRoutes.js';
import categoryRoutes from './routes/categoryRoutes.js';
import productRoutes from './routes/productRoutes.js';
import chatRoutes from './routes/chatRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import {checkout} from './controllers/checkoutController.js';
import {
  get as getCartItems,
  create as createCart,
  update as updateCartItem,
  remove as removeCartItem,
} from './controllers/cartItemController.js'
import {
  login,
  register,
} from './controllers/authController.js'
import cors from 'cors';

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(cors({
  origin: 'http://localhost:5173'
}))
app.use((req, res, next) => {
  res.setHeader('Content-Type', 'application/json');
  next();
});

app.use('/admin', adminRoutes)

app.post('/auth/login', login)
app.post('/auth/register', register)

app.use('/customers', customerRoutes);
app.use('/orders', orderRoutes);
app.use('/orders/:orderId/items', orderItemRoutes);
app.use('/api', categoryRoutes);
app.use('/products', productRoutes);
app.use('/chat', chatRoutes);

app.get('/cart-items', authMiddleware, getCartItems);
app.post('/cart-items', authMiddleware, createCart);
app.put('/cart-items', authMiddleware, updateCartItem);
app.delete('/cart-items/:id', authMiddleware, removeCartItem);

app.post('/checkout', authMiddleware, checkout)

app.get('/', (req, res) => {
  res.json({
    status: 200,
    message: 'API is running',
  });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
})
