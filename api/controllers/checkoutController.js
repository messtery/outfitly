import { Xendit } from 'xendit-node';
import Cart from '../models/cart.js';
import CartItem from '../models/cartitem.js';
import Order from '../models/order.js';
import OrderItem from '../models/orderitem.js';
import Customer from '../models/customer.js';

const xendit = new Xendit({ secretKey: process.env.XENDIT_KEY });

const XENDIT_PAYMENT_METHODS = {
  cash: ['RETAIL_OUTLET'],
  qris: ['QRIS'],
  transfer: ['CALLBACK_VIRTUAL_ACCOUNT'],
};

export const checkout = async (req, res) => {
  try {
    const customerId = req.user.id;
    const { paymentMethod } = req.body;

    if (!paymentMethod || !XENDIT_PAYMENT_METHODS[paymentMethod]) {
      return res.status(400).json({ message: 'Invalid payment method. Choose cash, qris, or transfer.' });
    }

    const cart = await Cart.findOne({
      where: { customerId },
      include: [{ model: CartItem, as: 'items' }],
    });

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: 'Cart is empty' });
    }

    const customer = await Customer.findByPk(customerId);
    const total = cart.items.reduce((sum, item) => sum + item.price * item.qty, 0);

    const order = await Order.create({
      customerId,
      total,
      paymentStatus: 'pending',
      items: cart.items.map((item) => ({
        productId: item.productId,
        qty: item.qty,
        price: item.price,
      })),
    }, {
      include: [{ model: OrderItem, as: 'items' }],
    });

    const invoice = await xendit.Invoice.createInvoice({
      data: {
        externalId: `order-${order.id}`,
        amount: total,
        currency: 'IDR',
        payerEmail: customer.email,
        description: `Payment for Order #${order.id} at Mikro Canteen`,
        customer: {
          givenNames: customer.name,
          email: customer.email,
        },
        paymentMethods: XENDIT_PAYMENT_METHODS[paymentMethod],
        successRedirectUrl: `http://localhost:5173/ordertracking/${order.id}`,
        failureRedirectUrl: `http://localhost:5173/ordertracking/${order.id}`,
      },
    });

    await order.update({
      invoiceId: invoice.id,
      invoiceUrl: invoice.invoiceUrl,
    });

    await Cart.destroy({ where: { id: cart.id } });

    res.status(201).json({
      data: {
        ...order.toJSON(),
        invoiceUrl: invoice.invoiceUrl,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to create order' });
  }
};
