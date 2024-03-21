'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('property', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        allowNull: false,
        type: Sequelize.TEXT
      },
      type: {
        allowNull: false,
        type: Sequelize.ENUM('apartment', 'townhouse', 'duplex', 'single_family_house')
      },
      description: {
        allowNull: false,
        type: Sequelize.TEXT,
      },
      is_onsite_property_management: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      status: {
        type: Sequelize.ENUM('active', 'inactive'),
        defaultValue: 'active'
      },
      parking_type: {
        type: Sequelize.ENUM('street_parking', 'reserved_spots', 'undercover_secured_parking'),
        allowNull: true,
      },
      created_by: {
        type: Sequelize.INTEGER,
        references: {
          model: "users",
          key: "id"
         },
         allowNull: false,
      },
      landlord_id: {
        type: Sequelize.INTEGER,
        references: {
          model: "users",
          key: "id"
         },
         allowNull: false,
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
    await queryInterface.dropTable('property');

  }
};
