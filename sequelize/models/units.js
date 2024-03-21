'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class units extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  units.init({
    id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
      },
      property_id: {
        type: DataTypes.INTEGER,
        references: {
          model: "property",
          key: "id"
         }
      },
      ownership_status: {
        type: DataTypes.ENUM('owned', 'leased')
      },
      base_price: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      landlord_id: {
        type: DataTypes.INTEGER,
        references: {
          model: "users",
          key: "id"
         }
      },
      is_pets_accepted: {
        type: DataTypes.BOOLEAN,
    },
    unit_status: {
      type: DataTypes.ENUM('turnover', 'vacant', 'occupied', 'partially_occupied'),
      defaultValue: 'turnover'
    },

    pet_rent: {
        type: DataTypes.INTEGER,
      },
      util_price: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      street_address: {
        allowNull: false,
        type: DataTypes.TEXT
      },
      unit_num: {
        allowNull: true,
        type: DataTypes.TEXT
      },
      type: {
        allowNull: true,
        type: DataTypes.TEXT
      },
      city: {
        allowNull: false,
        type: DataTypes.TEXT
      },
      state: {
        allowNull: false,
        type: DataTypes.TEXT
      },
      suburb: {
        allowNull: false,
        type: DataTypes.TEXT
      },
      postcode: {
        allowNull: false,
        type: DataTypes.TEXT
      },
      area_description: {
        allowNull: false,
        type: DataTypes.TEXT
      },
      created_by: {
        type: DataTypes.INTEGER,
        references: {
          model: "users",
          key: "id"
         }
      },
      floor_level: {
        type: DataTypes.INTEGER,

      },
      bedroom_count: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      parking_count: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      bathroom_count: { 
        type: DataTypes.INTEGER,
        allowNull: false,

      },
      furnished_unit: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
      },
      max_occupants: {
        type: DataTypes.INTEGER,

      },
      minimum_stay_days: {
        type: DataTypes.INTEGER,
      },
      area_sqm: {
        type: DataTypes.INTEGER
      },
      description: {
        type: DataTypes.TEXT
      },

      unit_status: {
        type: DataTypes.ENUM('turnover', 'vacant', 'occupied', 'partially_occupied'),
        defaultValue: 'turnover'
      },
      status: {
        type: DataTypes.ENUM('active', 'inactive'),
        defaultValue: 'active'
      },
      created_at: {
        allowNull: false,
        type: DataTypes.DATE
      },
      updated_at: {
        allowNull: false,
        type: DataTypes.DATE
      },
      latitude: {
        type: DataTypes.STRING,
      },
      longitude: {
        type: DataTypes.STRING,
      }
  }, {
    sequelize,
    modelName: 'units',
    freezeTableName: true,
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });
  return units;
};