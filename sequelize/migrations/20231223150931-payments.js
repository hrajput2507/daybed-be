'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('payments', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      util_price: {
        type: Sequelize.FLOAT,
        allowNull: true,
      },
      base_price: {
        type: Sequelize.FLOAT,
        allowNull: true,
      },
      subscription_price: {
        type: Sequelize.FLOAT,
        allowNull: true,
      },
      total_amount: {
        type: Sequelize.FLOAT,
        allowNull: false,
      },
      payment_id: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      reservation_id: {
        allowNull: true,
        type: Sequelize.INTEGER,
        references: {
          model: 'reservations',
          key: 'id',
        },
      },
      type: {
        type: Sequelize.ENUM('Rent', 'Subscription', 'Transfer', 'Cancellation'),
        defaultValue: 'Subscription',
      },
      payment_status: {
        // type: Sequelize.ENUM('Paid', 'Failed', 'Refunded', 'Created'),
        type: Sequelize.STRING,
        defaultValue: 'created', // or any other valid enum value
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      created_by: {
        type: Sequelize.INTEGER,
        references: {
          model: 'users',
          key: 'id',
        },
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('payments');
  }
};
