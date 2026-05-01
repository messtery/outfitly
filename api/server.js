import express from 'express';
import customerRoutes from './routes/customerRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import orderItemRoutes from './routes/orderItemRoutes.js';
import Product from './models/product.js';
import categoryRoutes from './routes/categoryRoutes.js';

const app = express();
const PORT = 5000;

app.use(express.json());
app.use((req, res, next) => {
  res.setHeader('Content-Type', 'application/json');
  next();
});

app.use('/customers', customerRoutes);
app.use('/orders', orderRoutes);
app.use('/orders/:orderId/items', orderItemRoutes);
app.use('/api', categoryRoutes);

app.get('/', (req, res) => {
  res.json({
    status: 200,
    message: 'API is running',
  });
});

//Product Routes
app.post('/products', async (req, res) => {
    try {
        const product = await Product.create(req.body);

        return res.status(201).json({
            message: `Product created successfully`,
            data: product
        });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
});

app.get('/products', async (req, res) => {
    try {
        const products = await Product.findAll();

        return res.status(200).json({
            message: "Products fetched successfully",
            data: products
        });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
});

app.get('/products/:id', async (req, res) => {
    try {
        const product = await Product.findByPk(req.params.id);

        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        return res.status(200).json({
            message: `Product with id ${req.params.id} fetched successfully`,
            data: product
        });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
});

app.patch('/products/:id', async (req, res) => {
    try {
        const product = await Product.findByPk(req.params.id);

        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        await product.update(req.body);

        return res.status(200).json({
            message: `Product dengan id ${req.params.id} berhasil diupdate`,
            data: product
        });
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
});

app.delete('/products/:id', async (req, res) => {
    try {
        const product = await Product.findByPk(req.params.id);

        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        await product.destroy();

        return res.status(200).json({
            message: `Product with id ${req.params.id} deleted successfully`
        });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
})