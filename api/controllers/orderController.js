import { Op } from 'sequelize';
import Order from '../models/order.js';
import OrderItem from '../models/orderitem.js';
import Product from '../models/product.js';

export const create = async (req, res) => {
  try {
    const { customerId, items } = req.body

    const order = await Order.create({
      customerId,
      total: items.reduce((sum, item) => sum + item.price * item.qty, 0),
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

    res.status(201).json({
      message: 'Order created successfully',
      data: order,
    })
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: 'Failed to create order',
    });
  }
};

export const findAll = async (req, res) => {
  try {
    const customerId = req.user.id
    const { q, page, limit } = req.query;
    const pageNum = parseInt(page) || 1;
    const limitNum = parseInt(limit) || 10;

    const where = q ? { id: { [Op.like]: `%${q}%` } } : {};

    const result = await Order.findAndCountAll({
      where: {
        customerId,
      },
      limit: limitNum,
      offset: (pageNum - 1) * limitNum,
      attributes: ['id', 'customerId', 'total', 'paymentStatus', 'paymentMethod', 'createdAt'],
      order: [['createdAt', 'DESC']],
      include: [
        {
          model: OrderItem,
          as: 'items',
          include: [
            {
              model: Product,
              as: 'product',
            }
          ]
        }
      ],
    });

    res.status(200).json({
      data: result.rows,
      meta: {
        total: result.count,
        page: pageNum,
        limit: limitNum,
      },
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: 'Error fetching orders',
    });
  }
};

export const findOne = async (req, res) => {
  try {
    const order = await Order.findByPk(req.params.id, {
      include: [
        {
          model: OrderItem,
          as: 'items',
          include: [
            {
              model: Product,
              as: 'product',
            },
          ],
        },
      ],
    });
    if (!order) {
      return res.status(404).json({
        status: 404,
        message: 'Order not found',
      });
    }
    res.status(200).json({
      data: order,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: 'Error fetching order',
    });
  }
};

export const update = async (req, res) => {
  try {
    const order = await Order.findByPk(req.params.id);

    if (!order) {
      return res.status(404).json({ message: 'Order not found.' });
    }

    const { customerId, paymentStatus, items } = req.body;

    await order.update({
      ...(customerId !== undefined && { customerId }),
      ...(paymentStatus !== undefined && { paymentStatus }),
    });

    if (Array.isArray(items) && items.length > 0) {
      await OrderItem.destroy({ where: { orderId: order.id } });
      await OrderItem.bulkCreate(
        items.map(item => ({
          orderId: order.id,
          productId: item.id,
          qty: item.qty,
          price: item.price,
        }))
      );

      const newTotal = items.reduce((sum, item) => sum + (item.price * item.qty), 0);
      await order.update({ total: newTotal });
    }

    const updatedOrder = await Order.findByPk(order.id, {
      include: [{ model: OrderItem, as: 'items' }],
    });

    res.json({ data: updatedOrder });
  } catch (error) {
    console.log(error);
    
    res.status(500).json({
      message: 'Failed to update order',
    });
  }
};

export const remove = async (req, res) => {
  try {
      const order = await Order.findByPk(req.params.id);

      if (!order) {
          return res.status(404).json({ message: 'Order not found.' });
      }

      await order.destroy();

      res.status(200).json({
        message: `Order with id ${req.params.id} deleted successfully.`,
      });
  } catch (error) {
      console.error('Error deleting order:', error);
      res.status(500).json({
        message: 'An error occurred while deleting the order.'
      });
  }
};