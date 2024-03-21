'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('reservation_audits', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      reservation_id: {
        type: Sequelize.INTEGER,
        references: {
          model: "reservations",
          key: "id"
         },
         allowNull: false
      },
      existing_subscription_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
  
      type: {
        type: Sequelize.ENUM('application', 'transfer', 'cancellation'),
        defaultValue: 'application'
      },
      status: {
        type: Sequelize.ENUM('new', 'approved', 'declined'),
        defaultValue: 'new'
      },
      progress: {
        type: Sequelize.ENUM('completed', 'incomplete'),
        defaultValue: 'incomplete'
      },
      created_by: {
        type: Sequelize.INTEGER,
        references: {
          model: "users",
          key: "id"
         },
         allowNull: false
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE
      },
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('reservation_audits');

  }
};
