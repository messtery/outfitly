import Cart from '../models/cart.js';
import CartItem from '../models/cartitem.js';
import Order from '../models/order.js';
import OrderItem from '../models/orderitem.js';

export const checkout = async (req, res) => {
  try {
    const { customerId } = req.body
    const cart = await Cart.findOne({
      where: {
        customerId,
      },
      include: [
        {
          model: CartItem,
          as: 'items',
        }
      ]
    })

    const order = await Order.create({
      customerId,
      total: cart.items.reduce((sum, item) => sum + item.price * item.qty, 0),
      paymentStatus: 'pending',
      items: cart.items.map(item => ({
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

    await Cart.destroy({
      where: {
        id: cart.id,
      }
    })

    res.status(201).json({
      data: order,
    })
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: 'Failed to create order',
    });
  }
};