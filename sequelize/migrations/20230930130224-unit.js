'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('units', {
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
      minimum_stay_days: {
        type: Sequelize.INTEGER,
      },
      unit_status: {
        type: Sequelize.ENUM('turnover', 'vacant', 'occupied', 'partially_occupied'),
        defaultValue: 'turnover'
      },
      is_pets_accepted: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      pet_rent: {
        type: Sequelize.INTEGER,
      },
      util_price: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      type: {
        type: Sequelize.TEXT,
        allowNull: true, 
      },
      base_price: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      ownership_status: {
        type: Sequelize.ENUM('owned', 'leased')
      },
      street_address: {
        allowNull: false,
        type: Sequelize.TEXT
      },
      city: {
        allowNull: false,
        type: Sequelize.TEXT
      },
      state: {
        allowNull: false,
        type: Sequelize.TEXT
      },
      suburb: {
        allowNull: false,
        type: Sequelize.TEXT
      },
      postcode: {
        allowNull: false,
        type: Sequelize.TEXT
      },
      area_description: {
        allowNull: false,
        type: Sequelize.TEXT
      },
      unit_num: {
        type: Sequelize.STRING,

      },
      floor_level: {
        type: Sequelize.INTEGER,

      },
      bedroom_count: {
        type: Sequelize.INTEGER,
        allowNull: false

      },
      bathroom_count: {
        type: Sequelize.INTEGER,
        allowNull: false

      },
      parking_count: {
        type: Sequelize.INTEGER,
        allowNull: false

      },
      furnished_unit: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      max_occupants: {
        type: Sequelize.INTEGER,

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
      landlord_id: {
        type: Sequelize.INTEGER,
        references: {
          model: "users",
          key: "id"
         },
         allowNull: false,
      },
      latitude: {
        type: Sequelize.STRING,
      },
      longitude: {
        type: Sequelize.STRING,
      }
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('units');

  }
};
