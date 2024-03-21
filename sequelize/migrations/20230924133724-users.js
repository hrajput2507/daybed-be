"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("users", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      firstName: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      lastName: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      email: {
        allowNull: false,
        type: Sequelize.STRING,
        unique: true,
      },
      dateOfBirth: {
        allowNull: true,
        type: Sequelize.DATEONLY,
        unique: false,
      },
      phone: {
        allowNull: false,
        unique: true,
        type: Sequelize.STRING,
      },
      password: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      logo: {
        type: Sequelize.STRING,
      },
      membership_start_date: {
        type: Sequelize.DATE
      },
      membership_end_date: {
        type: Sequelize.DATE
      },
      membership_payment_id: {
        type: Sequelize.STRING,
      },
      stripe_user_id: {
        type: Sequelize.STRING,
      },
      phone_verified: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      email_verified: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      status: {
        type: Sequelize.ENUM("active", "inactive"),
        defaultValue: 'active'
      },
      role: {
        type: Sequelize.ENUM("admin", "landlord", "customer"),
      },
      application_status: {
        type: Sequelize.STRING,
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("users");
  },
};
