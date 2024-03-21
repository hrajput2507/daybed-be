"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class users extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  users.init(
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      firstName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      lastName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      email: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      dateOfBirth: {
        allowNull: true,
        type: DataTypes.DATEONLY,
      },
      phone: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      password: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      logo: {
        type: DataTypes.STRING,
      },
      application_status: {
        type: DataTypes.STRING,
      },
      membership_start_date: {
        type: DataTypes.DATE
      },
      membership_end_date: {
        type: DataTypes.DATE
      },
      membership_payment_id: {
        type: DataTypes.STRING,
      },
      stripe_user_id: {
        type: DataTypes.STRING,
      },
      phone_verified: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
      },
      email_verified: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
      },
      created_at: {
        allowNull: false,
        type: DataTypes.DATE
      },
      updated_at: {
        allowNull: false,
        type: DataTypes.DATE
      },
      role: {
        type: DataTypes.ENUM("admin", "landlord", "customer"),
      },
      status: {
        type: DataTypes.ENUM("active", "inactive"),
      }     
    },
    {
      sequelize,
      modelName: "users",
      freezeTableName: true,
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at'
    }
  );
  return users;
};
