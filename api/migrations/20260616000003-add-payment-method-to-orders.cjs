'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('orders', 'paymentMethod', {
      type: Sequelize.ENUM('cash', 'qris', 'transfer'),
      allowNull: true,
    });
  },
  async down(queryInterface) {
    await queryInterface.removeColumn('orders', 'paymentMethod');
  },
};
