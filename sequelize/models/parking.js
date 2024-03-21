'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class parking extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  parking.init({
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    status: {
      type: DataTypes.ENUM('active', 'inactive')
    },
    type: {
      type: DataTypes.ENUM('room', 'unit'),
      defaultValue: 'unit'
    },
    unit_id: {
        type: DataTypes.INTEGER,
        references: {
          model: "units",
          key: "id"
         },
         allowNull: false,
      },
      room_id: {
        type: DataTypes.INTEGER,
        references: {
            model: "rooms",
            key: "id"
            },
            allowNull: true,

        },
    spot_number: {
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
  }, {
    sequelize,
    modelName: 'parking',
    freezeTableName: true,
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });
  return parking;
};