'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class currentStay extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */ 
    static associate(models) {
      // Define associations here
      currentStay.belongsTo(models.users, { foreignKey: 'userId' });
      currentStay.belongsTo(models.reservations, { foreignKey: 'reservationId' });
      currentStay.belongsTo(models.property, { foreignKey: 'propertyId' });
      currentStay.belongsTo(models.units, { foreignKey: 'unitId' });
      currentStay.belongsTo(models.rooms, { foreignKey: 'roomId' });
    }
  }
  currentStay.init({
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
      references: {
        model: 'users',
        key: 'id',
      },
    },
    reservationId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'reservations',
        key: 'id',
      },
    },
    propertyId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'property',
        key: 'id',
      },
    },
    unitId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'units',
        key: 'id',
      },
    },
    roomId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'rooms',
        key: 'id',
      },
    },
    status: {
      type: DataTypes.ENUM('staying',"vaccating"),
      defaultValue: 'new'
    },
    // Additional fields can be added as needed
  }, {
    sequelize,
    modelName: 'currentStay',
    freezeTableName: true,
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });

  return currentStay;
};
