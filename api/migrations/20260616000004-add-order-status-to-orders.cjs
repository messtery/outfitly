'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('orders', 'orderStatus', {
      type: Sequelize.ENUM('processing', 'ready', 'completed'),
      allowNull: true,
      defaultValue: null,
    });
  },
  async down(queryInterface) {
    await queryInterface.removeColumn('orders', 'orderStatus');
  },
};
