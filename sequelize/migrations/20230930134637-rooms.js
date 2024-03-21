'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('rooms', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      property_id: {
        type: Sequelize.INTEGER,
        references: {
          model: "property",
          key: "id"
         },
         allowNull: false
      },
      unit_id: {
        type: Sequelize.INTEGER,
        references: {
          model: "units",
          key: "id"
         },
         allowNull: false
      },
      type: {
        type: Sequelize.ENUM('single', 'twin', 'double', 'queen', 'king', 'super_king')

      },
      area_sqm: {
        type: Sequelize.INTEGER
      },
      description: {
        type: Sequelize.TEXT
      },
      status: {
        type: Sequelize.ENUM('active', 'inactive'),
        defaultValue: 'active'
      },
      base_price: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      room_status: {
        type: Sequelize.ENUM('turnover', 'vacant', 'occupied', 'partially_occupied'),
        defaultValue: 'turnover'
      },
      util_price: {
        type: Sequelize.INTEGER,
        allowNull: true,
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
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  }
};
