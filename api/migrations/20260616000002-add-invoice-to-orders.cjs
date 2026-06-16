'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('orders', 'invoiceId', {
      type: Sequelize.STRING,
      allowNull: true,
    });
    await queryInterface.addColumn('orders', 'invoiceUrl', {
      type: Sequelize.TEXT,
      allowNull: true,
    });
  },
  async down(queryInterface) {
    await queryInterface.removeColumn('orders', 'invoiceId');
    await queryInterface.removeColumn('orders', 'invoiceUrl');
  },
};
