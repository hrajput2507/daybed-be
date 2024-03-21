'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
      await queryInterface.addColumn('users', 'passport_url', {
        type: Sequelize.STRING, // Adjust the data type accordingly
        allowNull: true,
      });
  
      await queryInterface.addColumn('users', 'payslip_url', {
        type: Sequelize.STRING, // Adjust the data type accordingly
        allowNull: true,
      });
  },

  async down (queryInterface, Sequelize) {
       // If you ever need to rollback, Sequelize will automatically reverse these changes
       await queryInterface.removeColumn('users', 'passport_url');
       await queryInterface.removeColumn('users', 'payslip_url');
  }
};
