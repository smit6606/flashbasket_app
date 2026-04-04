const { Order, User, Product, Category, Wallet, Address, sequelize } = require('../models');
const { Op } = require('sequelize');

class AdminService {
  async getDashboardStats() {
    const totalOrders = await Order.count();
    const totalUsers = await User.count({ where: { role: 'user' } });
    const totalProducts = await Product.count();
    const totalRevenue = await Order.sum('totalAmount', { where: { status: { [Op.ne]: 'Cancelled' } } }) || 0;

    return {
      totalOrders,
      totalUsers,
      totalProducts,
      totalRevenue
    };
  }

  async getRecentOrders() {
    const orders = await Order.findAll({
      limit: 10,
      order: [['createdAt', 'DESC']],
      include: [
        { model: User, as: 'user' },
        { model: Address, as: 'deliveryAddress' }
      ]
    });
    return orders;
  }

  async getSalesChartData() {
    // Current year sales data by month
    const currentYear = new Date().getFullYear();
    const sales = await Order.findAll({
      attributes: [
        [sequelize.fn('MONTH', sequelize.col('createdAt')), 'month'],
        [sequelize.fn('SUM', sequelize.col('totalAmount')), 'revenue']
      ],
      where: {
        createdAt: {
          [Op.gte]: new Date(`${currentYear}-01-01`),
          [Op.lte]: new Date(`${currentYear}-12-31`)
        },
        status: { [Op.ne]: 'Cancelled' }
      },
      group: [sequelize.fn('MONTH', sequelize.col('createdAt'))],
      order: [[sequelize.fn('MONTH', sequelize.col('createdAt')), 'ASC']]
    });

    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const formattedData = months.map((month, index) => {
      const monthData = sales.find(s => s.dataValues.month === index + 1);
      return {
        name: month,
        revenue: monthData ? parseFloat(monthData.dataValues.revenue) : 0
      };
    });

    return formattedData;
  }
}

module.exports = new AdminService();
