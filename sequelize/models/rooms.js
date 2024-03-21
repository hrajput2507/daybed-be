'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class rooms extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  rooms.init({
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },

    base_price: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    util_price: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    property_id: {
      type: DataTypes.INTEGER,
      references: {
        model: "property",
        key: "id"
       }
    },
    unit_id: {
      type: DataTypes.INTEGER,
      references: {
        model: "units",
        key: "id"
       }
    },
    type: {
        type: DataTypes.ENUM('single', 'twin', 'double', 'queen', 'king', 'super_king')
    },
    status: {
      type: DataTypes.ENUM('active', 'inactive')
    },
    description: {
        type: DataTypes.TEXT,
    },
    area_sqm: {
      type: DataTypes.STRING,
  },
  created_at: {
    allowNull: false,
    type: DataTypes.DATE
  },
  updated_at: {
    allowNull: false,
    type: DataTypes.DATE
  },
    room_status: {
      type: DataTypes.ENUM('turnover', 'vacant', 'occupied', 'partially_occupied'),
      defaultValue: 'vacant'
    },
    created_by: {
        type: DataTypes.INTEGER,
        references: {
          model: "users",
          key: "id"
         }
      },
  }, {
    sequelize,
    modelName: 'rooms',
    freezeTableName: true,
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });
  return rooms;
};