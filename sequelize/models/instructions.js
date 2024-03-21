'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class instructions extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  instructions.init({
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    status: {
      type: DataTypes.ENUM('active', 'inactive')
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    entity_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      entity_type: {
        allowNull: false,
        type:  DataTypes.ENUM('room', 'unit', 'property', 'parking')
      },
      url: {
        allowNull: true,
        type: DataTypes.STRING,
      },

      description: {
        allowNull: true,
        type: DataTypes.TEXT,
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
    modelName: 'instructions',
    freezeTableName: true,
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });
  return instructions;
};