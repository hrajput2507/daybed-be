'use strict';
const {
  Model
} = require('sequelize');

// Define the PaymentState object
const PaymentState = {
  SUCCEEDED: 'SUCCEEDED',
  CREATED: 'Created',
  ATTACHED: 'ATTACHED',
  FAILED: 'FAILED'
};

module.exports = (sequelize, DataTypes) => {
  class payments extends Model {
    /**
    * Helper method for defining associations.
    * This method is not a part of Sequelize lifecycle.
    * The models/index file will call this method automatically.
    */
    static associate(models) {
      // define association here
    }
  }
  payments.init({
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    util_price: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    base_price: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    subscription_price: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    total_amount: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    payment_id: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    reservation_id: {
      allowNull: true,
      type: DataTypes.INTEGER,
      references: {
        model: "reservations",
        key: "id"
      }
    },
    type: {
      type: DataTypes.ENUM('Rent', 'Subscription', 'Transfer', 'Cancellation'),
      allowNull: true,
    },
    payment_status: {
      type: DataTypes.ENUM,
      values: Object.values(PaymentState),
      defaultValue : PaymentState.CREATED,
      allowNull: false,
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
    modelName: 'payments',
    freezeTableName: true,
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });
  return payments;
};
