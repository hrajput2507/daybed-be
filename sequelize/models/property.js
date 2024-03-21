'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class property extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  property.init({
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.TEXT,
      allowNull: false,
    },

    type: {
        type: DataTypes.ENUM('apartment', 'townhouse', 'duplex', 'single_family_house')
    },
    status: {
      type: DataTypes.ENUM('active', 'inactive')
    },
    description: {
        type: DataTypes.TEXT,
    },

      is_onsite_property_management: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      parking_type: {
        type: DataTypes.ENUM('street_parking', 'reserved_spots', 'undercover_secured_parking')
      },
      created_at: {
        allowNull: false,
        type: DataTypes.DATE
      },
      updated_at: {
        allowNull: false,
        type: DataTypes.DATE
      },
    created_by: {
        type: DataTypes.INTEGER,
        references: {
          model: "users",
          key: "id"
         }
      },
      landlord_id: {
        type: DataTypes.INTEGER,
        references: {
          model: "users",
          key: "id"
         }
      },
  }, {
    sequelize,
    modelName: 'property',
    freezeTableName: true,
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });
  return property;
};