import { Op, literal } from 'sequelize';
import Order from '../../models/order.js';
import OrderItem from '../../models/orderitem.js';
import Product from '../../models/product.js';
import Customer from '../../models/customer.js';

export const create = async (req, res) => {
  try {
    const { customerId, items } = req.body;
    const order = await Order.create({
      customerId,
      total: items.reduce((sum, item) => sum + item.price * item.qty, 0),
      paymentStatus: 'pending',
      items: items.map((item) => ({
        productId: item.id,
        qty: item.qty,
        price: item.price,
      })),
    }, { include: [{ model: OrderItem, as: 'items' }] });
    res.status(201).json({ message: 'Order created successfully', data: order });
  } catch (error) {
    res.status(500).json({ message: 'Failed to create order' });
  }
};

export const findAll = async (req, res) => {
  try {
    const {
      page = 1, limit = 10,
      sort = 'id', order = 'asc',
      q, customer, total, paymentStatus,
    } = req.query;

    const pageNum = Math.max(1, parseInt(page) || 1);
    const limitNum = Math.max(1, parseInt(limit) || 10);

    const allowedSorts = ['id', 'total', 'paymentStatus', 'createdAt'];
    const sortField = allowedSorts.includes(sort) ? sort : 'id';
    const sortOrder = order.toLowerCase() === 'desc' ? 'DESC' : 'ASC';

    const andConditions = [];
    if (q) {
      andConditions.push({
        [Op.or]: [
          literal(`CAST(\`Order\`.\`id\` AS CHAR) LIKE '%${String(q).replace(/[^0-9a-zA-Z]/g, '')}%'`),
          { paymentStatus: { [Op.like]: `%${q}%` } },
        ],
      });
    }
    if (total) {
      const safeTotal = String(total).replace(/[^0-9]/g, '');
      if (safeTotal) {
        andConditions.push(literal(`CAST(\`Order\`.\`total\` AS CHAR) LIKE '%${safeTotal}%'`));
      }
    }
    if (paymentStatus) {
      andConditions.push({ paymentStatus: { [Op.like]: `%${paymentStatus}%` } });
    }

    const orderWhere = andConditions.length > 0 ? { [Op.and]: andConditions } : {};
    const customerRequired = !!customer;
    const orderClause =
      sort === 'customer'
        ? [[{ model: Customer, as: 'customer' }, 'name', sortOrder]]
        : [[sortField, sortOrder]];

    const result = await Order.findAndCountAll({
      where: orderWhere,
      limit: limitNum,
      offset: (pageNum - 1) * limitNum,
      attributes: ['id', 'customerId', 'total', 'paymentStatus', 'createdAt'],
      include: [{
        model: Customer,
        as: 'customer',
        attributes: ['id', 'name', 'email'],
        where: customerRequired ? { name: { [Op.like]: `%${customer}%` } } : undefined,
        required: customerRequired,
      }],
      order: orderClause,
    });

    res.status(200).json({
      data: result.rows,
      meta: {
        total: result.count,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(result.count / limitNum),
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching orders' });
  }
};

export const findOne = async (req, res) => {
  try {
    const order = await Order.findByPk(req.params.id, {
      include: [
        {
          model: OrderItem,
          as: 'items',
          include: [{ model: Product, as: 'product' }],
        },
        { model: Customer, as: 'customer', attributes: ['id', 'name', 'email'] },
      ],
    });
    if (!order) return res.status(404).json({ message: 'Order not found' });
    res.status(200).json({ data: order });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching order' });
  }
};

export const update = async (req, res) => {
  try {
    const order = await Order.findByPk(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found.' });

    const { customerId, paymentStatus, items } = req.body;
    await order.update({
      ...(customerId !== undefined && { customerId }),
      ...(paymentStatus !== undefined && { paymentStatus }),
    });

    if (Array.isArray(items) && items.length > 0) {
      await OrderItem.destroy({ where: { orderId: order.id } });
      await OrderItem.bulkCreate(
        items.map((item) => ({
          orderId: order.id,
          productId: item.id,
          qty: item.qty,
          price: item.price,
        }))
      );
      const newTotal = items.reduce((sum, item) => sum + item.price * item.qty, 0);
      await order.update({ total: newTotal });
    }

    const updated = await Order.findByPk(order.id, {
      include: [{ model: OrderItem, as: 'items' }],
    });
    res.json({ data: updated });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update order' });
  }
};

export const remove = async (req, res) => {
  try {
    const order = await Order.findByPk(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found.' });
    await order.destroy();
    res.status(200).json({ message: `Order ${req.params.id} deleted successfully.` });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting order' });
  }
};

export const bulkRemove = async (req, res) => {
  try {
    const { ids } = req.body;
    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ error: 'No IDs provided' });
    }
    const deleted = await Order.destroy({ where: { id: { [Op.in]: ids } } });
    res.json({ message: `${deleted} order(s) deleted` });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting orders' });
  }
};
