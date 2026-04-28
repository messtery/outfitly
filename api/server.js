import express from 'express';
import Product from './models/product.js';

const app = express();
const port = 3000;

app.get('/', async (req, res) => {
    try {
        const products = await Product.findAll();

        res.send({
            data: products,
        });
    } catch (error) {
        console.error('Error fetching products:', error);

        res.status(500).json({
            error: 'An error occurred while fetching products.',
        });
    }
})

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
})