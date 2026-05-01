import { Op } from 'sequelize';
import Order from '../models/order.js';
import OrderItem from '../models/orderitem.js';
import Product from '../models/product.js';

export const create = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { productId, qty } = req.body;
    
    const product = await Product.findByPk(productId);
  
    if (!product) {
      return res.status(404).json({
        message: `Product id ${productId} not found.`,
      })
    }

    const price = product.price;
    
    const orderItem = await OrderItem.create({
      orderId,
      productId,
      qty,
      price,
    });

    res.status(201).json({
      message: 'Order item created successfully',
      data: orderItem,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: error.message
    });
  }
};

export const findAll = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { q, page, limit } = req.query;

    const pageNum = parseInt(page) || 1;
    const limitNum = parseInt(limit) || 10;

    const where = {
      ...(orderId && { orderId }),
      ...(q && { productId: { [Op.like]: `%${q}%` } }),
    };

    const result = await OrderItem.findAndCountAll({
      where,
      limit: limitNum,
      offset: (pageNum - 1) * limitNum,
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
      message: error.message
    });
  }
};

export const findOne = async (req, res) => {
  try {
    const { orderId, id } = req.params;

    const orderItem = await OrderItem.findOne({
      where: {
        id,
        orderId,
      },
    });

    if (!orderItem) {
      return res.status(404).json({
        status: 404,
        message: 'Order item not found',
      });
    }

    res.status(200).json({
      data: orderItem,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: error.message
    });
  }
};

export const update = async (req, res) => {
  try {
    const { orderId, id } = req.params;
    const { productId, qty } = req.body;

    const orderItem = await OrderItem.findOne({
      where: { id, orderId },
    });

    if (!orderItem) {
      return res.status(404).json({
        message: 'Order item not found.',
      });
    }

    let updatedData = {};

    if (productId !== undefined) {
      const product = await Product.findByPk(productId);

      if (!product) {
        return res.status(404).json({
          message: `Product id ${productId} not found.`,
        });
      }

      updatedData.productId = productId;
      updatedData.price = product.price;
    }

    if (qty !== undefined) {
      updatedData.qty = qty;
    }

    await orderItem.update(updatedData);

    res.status(200).json({
      message: 'Order item updated successfully',
      data: orderItem,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: error.message
    });
  }
};

export const remove = async (req, res) => {
  try {
    const { orderId, id } = req.params;

    const orderItem = await OrderItem.findOne({
      where: { id, orderId },
    });

    if (!orderItem) {
      return res.status(404).json({
        message: 'Order item not found.',
      });
    }

    await orderItem.destroy();

    res.status(200).json({
      message: `Order item with id ${id} deleted successfully.`,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: error.message
    });
  }
};