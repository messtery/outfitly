import { Op } from 'sequelize';
import Customer from '../models/customer.js';

export const create = async (req, res) => {
  try {
    const customer = await Customer.create(req.body);

    res.status(201).json({
      message: 'Customer created',
      data: customer,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: 'Failed to create customer',
      error: error.message,
    });
  }
};

export const findAll = async (req, res) => {
  try {
    const { q, page, limit } = req.query;
    const pageNum = parseInt(page) || 1;
    const limitNum = parseInt(limit) || 10;

    const where = q ? { name: { [Op.like]: `%${q}%` } } : {};

    const result = await Customer.findAndCountAll({
      where,
      limit: limitNum,
      offset: (pageNum - 1) * limitNum,
    });

    res.status(200).json({
      message: 'Success',
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
      message: 'Error fetching customers',
      error: error.message,
    });
  }
};

export const findOne = async (req, res) => {
  try {
    const customer = await Customer.findByPk(req.params.id);
    if (!customer) {
      return res.status(404).json({
        status: 404,
        message: 'Customer not found',
      });
    }
    res.status(200).json({
      message: 'Success',
      data: customer,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: 'Error fetching customer',
      error: error.message,
    });
  }
};

export const update = async (req, res) => {
  try {
    const customer = await Customer.findByPk(req.params.id);
    if (!customer) {
      return res.status(404).json({
        status: 404,
        message: 'Customer not found',
      });
    }
    await customer.update(req.body);
    res.status(200).json({
      message: 'Customer updated',
      data: customer,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Failed to update customer',
      error: error.message,
    });
  }
};

export const remove = async (req, res) => {
  try {
    const customer = await Customer.findByPk(req.params.id);
    if (!customer) {
      return res.status(404).json({
        status: 404,
        message: 'Customer not found',
      });
    }
    await customer.destroy();
    res.status(200).json({
      message: 'Customer deleted',
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: 'Error deleting customer',
      error: error.message,
    });
  }
};