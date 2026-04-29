import express from 'express';
import customerRoutes from './routes/customerRoutes.js';
import Product from './models/product.js';
import Order from './models/order.js';
import OrderItem from './models/orderitem.js';

const app = express();
const port = 3000;

app.use(express.json());
app.use('/customers', customerRoutes);

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

app.get('/orders', async (req, res) => {
    try {
        const orders = await Order.findAll();

        res.send({
            data: orders,
        })
    } catch (error) {
        console.error('Error fetching orders:', error);
        
        res.status(500).json({
            message: 'Something went wrong',
        })
    }
})

app.get('/orders/:id', async (req, res) => {
    try {
        const order = await Order.findByPk(req.params.id);

        res.send({
            data: order,
        })
    } catch (error) {
        console.error('Error fetching orders:', error);
        
        res.status(500).json({
            message: 'Something went wrong',
        })
    }
})

app.post('/orders', async (req, res) => {
    try {
        const { customerId, items } = req.body

        console.log({
            customerId,
            items,
        });

        const order = await Order.create({
            customerId,
            total: items.reduce((sum, item) => sum + item.price * item.quantity, 0),
            paymentStatus: 'pending',
            items: items.map(item => ({
                productId: item.id,
                qty: item.qty,
                price: item.price,
            }))
        }, {
            include: [
                {
                    model: OrderItem,
                    as: 'items',
                }
            ]
        })

        res.status(201).send({
            message: 'Order created successfully',
            data: order,
        })
    } catch (error) {
        console.error('Error fetching orders:', error);
        
        res.status(500).json({
            message: 'Something went wrong',
        })
    }
})

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
})
