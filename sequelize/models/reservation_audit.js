'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class reservation_audits extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  reservation_audits.init({
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },

    existing_subscription_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },

    reservation_id: {
        type: DataTypes.INTEGER,
        references: {
          model: "reservations",
          key: "id"
         },
         allowNull: false
      },

    type: {
      type: DataTypes.ENUM('application', 'transfer', 'cancellation'),
      defaultValue: 'application'
    },
    status: {
      type: DataTypes.ENUM('new', 'approved', 'declined'),
      defaultValue: 'new'
    },
    progress: {
      type: DataTypes.ENUM('completed', 'incomplete'),
      defaultValue: 'incomplete'
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
  }, {
    sequelize,
    modelName: 'reservation_audits',
    freezeTableName: true,
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });
  return reservation_audits;
};