import { fn, col, Op } from 'sequelize';
import Order from '../../models/order.js';
import Customer from '../../models/customer.js';

export const getStats = async (req, res) => {
  try {
    const ninetyDaysAgo = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000);

    const [totalRevenue, totalOrders, totalCustomers, pendingOrders, revenueByDay] = await Promise.all([
      Order.sum('total', { where: { paymentStatus: 'paid' } }),
      Order.count(),
      Customer.count(),
      Order.count({ where: { paymentStatus: 'pending' } }),
      Order.findAll({
        attributes: [
          [fn('DATE', col('createdAt')), 'date'],
          [fn('SUM', col('total')), 'revenue'],
          [fn('COUNT', col('id')), 'orders'],
        ],
        where: {
          paymentStatus: 'paid',
          createdAt: { [Op.gte]: ninetyDaysAgo },
        },
        group: [fn('DATE', col('createdAt'))],
        order: [[fn('DATE', col('createdAt')), 'ASC']],
        raw: true,
      }),
    ]);

    res.json({
      data: {
        totalRevenue: totalRevenue || 0,
        totalOrders,
        totalCustomers,
        pendingOrders,
        revenueByDay,
      },
    });
  } catch (error) {
    console.error('Dashboard stats error:', error);
    res.status(500).json({ message: 'Failed to fetch dashboard stats' });
  }
};
