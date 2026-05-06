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

    await queryInterface.bulkInsert('products', [
      {
        name: 'Pizza',
        description: 'Classic cheese pizza with tomato sauce and melted mozzarella',
        price: 50_000,
        categoryId: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Burger',
        description: 'Juicy beef burger with lettuce, tomato, and special sauce',
        price: 30_000,
        categoryId: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Fried Chicken',
        description: 'Crispy deep-fried chicken with savory seasoning',
        price: 25_000,
        categoryId: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Spaghetti',
        description: 'Spaghetti pasta served with rich bolognese sauce',
        price: 35_000,
        categoryId: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Steak',
        description: 'Grilled beef steak cooked to perfection with black pepper sauce',
        price: 75_000,
        categoryId: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Nasi Goreng',
        description: 'Indonesian fried rice with egg, chicken, and spices',
        price: 20_000,
        categoryId: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Mie Goreng',
        description: 'Stir-fried noodles with vegetables, egg, and savory sauce',
        price: 18_000,
        categoryId: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    
      {
        name: 'Coke',
        description: 'Refreshing carbonated cola drink served cold',
        price: 10_000,
        categoryId: 2,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Sprite',
        description: 'Lemon-lime flavored soda with a crisp taste',
        price: 10_000,
        categoryId: 2,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Orange Juice',
        description: 'Freshly squeezed orange juice rich in vitamin C',
        price: 15_000,
        categoryId: 2,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Iced Tea',
        description: 'Chilled sweet tea perfect for refreshing moments',
        price: 8_000,
        categoryId: 2,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Coffee',
        description: 'Hot brewed coffee with a strong and bold flavor',
        price: 12_000,
        categoryId: 2,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Milkshake',
        description: 'Creamy milkshake blended with ice cream and milk',
        price: 20_000,
        categoryId: 2,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    
      {
        name: 'Chips',
        description: 'Crispy potato chips lightly salted',
        price: 5_000,
        categoryId: 3,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'French Fries',
        description: 'Golden fried potato sticks with a crispy texture',
        price: 12_000,
        categoryId: 3,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Onion Rings',
        description: 'Deep-fried onion rings with crunchy coating',
        price: 15_000,
        categoryId: 3,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Popcorn',
        description: 'Light and fluffy popcorn with buttery flavor',
        price: 10_000,
        categoryId: 3,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Nachos',
        description: 'Tortilla chips served with cheesy dip',
        price: 18_000,
        categoryId: 3,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Chocolate Bar',
        description: 'Sweet chocolate snack perfect for quick cravings',
        price: 7_000,
        categoryId: 3,
        createdAt: new Date(),
        updatedAt: new Date(),
      }
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
