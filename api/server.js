import express from 'express';
import Product from './models/product.js';

const app = express();
const port = 3000;
app.use(express.json());

app.get('/', async (req, res) => {
    try {
        const products = await Product.findAll();

        res.send({
            data: products,
        });
    } catch (error) {
        console.error('Error fetching products:', error);

        res.status(500).json({
            message: 'An error occurred while fetching products.',
        });
    }
})

//Product Routes
app.post('/products', async (req, res) => {
    try {
        const product = await Product.create(req.body);

        return res.status(201).json({
            message: `Product dengan berhasil ditambahkan`,
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
            return res.status(404).json({ message: "Product tidak ditemukan" });
        }

        return res.status(200).json({
            message: `Product dengan id ${req.params.id} berhasil diambil`,
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
            return res.status(404).json({ message: "Product tidak ditemukan" });
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
            return res.status(404).json({ message: "Product tidak ditemukan" });
        }

        await product.destroy();

        return res.status(200).json({
            message: `Product dengan id ${req.params.id} berhasil dihapus`
        });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
})