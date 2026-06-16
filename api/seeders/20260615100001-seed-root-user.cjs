'use strict';

require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const bcrypt = require('bcrypt');

module.exports = {
  async up(queryInterface) {
    const email = process.env.ROOT_EMAIL;
    const password = process.env.ROOT_PASSWORD;

    if (!email || !password) {
      throw new Error('ROOT_EMAIL and ROOT_PASSWORD must be set in .env');
    }

    const now = new Date();
    const hashedPassword = await bcrypt.hash(password, 10);

    const [existingUser] = await queryInterface.sequelize.query(
      'SELECT id FROM users WHERE email = ? LIMIT 1',
      { replacements: [email], type: queryInterface.sequelize.QueryTypes.SELECT }
    );

    if (existingUser) {
      await queryInterface.sequelize.query(
        'UPDATE users SET password = ?, isRoot = 1, updatedAt = ? WHERE id = ?',
        { replacements: [hashedPassword, now, existingUser.id] }
      );
    } else {
      await queryInterface.bulkInsert('users', [{
        name: 'Root',
        email,
        password: hashedPassword,
        isRoot: true,
        roleId: null,
        createdAt: now,
        updatedAt: now,
      }]);
    }

    console.log(`Root user seeded: ${email}`);
  },

  async down(queryInterface) {
    const email = process.env.ROOT_EMAIL;
    if (email) {
      await queryInterface.sequelize.query(
        'DELETE FROM users WHERE email = ?',
        { replacements: [email] }
      );
    }
  },
};
