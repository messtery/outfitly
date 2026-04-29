import express from 'express';
import Product from './models/product.js';
import Order from './models/order.js';
import OrderItem from './models/orderItem.js';

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
            error: 'An error occurred while fetching products.',
        });
    }
})

// GET all orders
app.get('/orders', async (req, res) => {
    try {
        const orders = await Order.findAll({
            include: [{ model: OrderItem, as: 'items' }],
            order: [['createdAt', 'DESC']],
        });

        res.json({ data: orders });
    } catch (error) {
        console.error('Error fetching orders:', error);
        res.status(500).json({ error: 'An error occurred while fetching orders.' });
    }
});

// GET single order by id
app.get('/orders/:id', async (req, res) => {
    try {
        const order = await Order.findByPk(req.params.id, {
            include: [{ model: OrderItem, as: 'items' }],
        });

        if (!order) {
            return res.status(404).json({ error: 'Order not found.' });
        }

        res.json({ data: order });
    } catch (error) {
        console.error('Error fetching order:', error);
        res.status(500).json({ error: 'An error occurred while fetching the order.' });
    }
});

// POST create order
app.post('/orders', async (req, res) => {
    const { customerName, phone, shippingAddress, paymentStatus, date, time, items } = req.body;

    if (!customerName || !phone || !shippingAddress || !date || !Array.isArray(items) || items.length === 0) {
        return res.status(400).json({ error: 'customerName, phone, shippingAddress, date, and items are required.' });
    }

    try {
        const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

        const order = await Order.create({
            customerName,
            phone,
            shippingAddress,
            paymentStatus: paymentStatus || 'Pending',
            date,
            time: time || null,
            total,
        });

        const orderItems = await OrderItem.bulkCreate(
            items.map(item => ({
                orderId: order.id,
                productName: item.productName,
                quantity: item.quantity,
                price: item.price,
            }))
        );

        res.status(201).json({ data: { ...order.toJSON(), items: orderItems } });
    } catch (error) {
        console.error('Error creating order:', error);
        res.status(500).json({ error: 'An error occurred while creating the order.' });
    }
});

// PATCH update order
app.patch('/orders/:id', async (req, res) => {
    try {
        const order = await Order.findByPk(req.params.id);

        if (!order) {
            return res.status(404).json({ error: 'Order not found.' });
        }

        const { customerName, phone, shippingAddress, paymentStatus, date, time, items } = req.body;

        await order.update({
            ...(customerName !== undefined && { customerName }),
            ...(phone !== undefined && { phone }),
            ...(shippingAddress !== undefined && { shippingAddress }),
            ...(paymentStatus !== undefined && { paymentStatus }),
            ...(date !== undefined && { date }),
            ...(time !== undefined && { time }),
        });

        if (Array.isArray(items) && items.length > 0) {
            await OrderItem.destroy({ where: { orderId: order.id } });
            await OrderItem.bulkCreate(
                items.map(item => ({
                    orderId: order.id,
                    productName: item.productName,
                    quantity: item.quantity,
                    price: item.price,
                }))
            );

            const newTotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
            await order.update({ total: newTotal });
        }

        const updatedOrder = await Order.findByPk(order.id, {
            include: [{ model: OrderItem, as: 'items' }],
        });

        res.json({ data: updatedOrder });
    } catch (error) {
        console.error('Error updating order:', error);
        res.status(500).json({ error: 'An error occurred while updating the order.' });
    }
});

// DELETE order
app.delete('/orders/:id', async (req, res) => {
    try {
        const order = await Order.findByPk(req.params.id);

        if (!order) {
            return res.status(404).json({ error: 'Order not found.' });
        }

        await OrderItem.destroy({ where: { orderId: order.id } });
        await order.destroy();

        res.status(204).send();
    } catch (error) {
        console.error('Error deleting order:', error);
        res.status(500).json({ error: 'An error occurred while deleting the order.' });
    }
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
})