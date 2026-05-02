'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */

    await queryInterface.bulkInsert('categories', [
      {
        name: 'Food',
        description: 'All food items',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Drinks',
        description: 'All drinks items',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Snacks',
        description: 'All snacks items',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ], {});
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
};
