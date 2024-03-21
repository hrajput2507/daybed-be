'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('currentStays', 'userId', {
      type: Sequelize.INTEGER, // Assuming userId is an integer
      unique: false, // Setting unique constraint to false
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('currentStays', 'userId', {
      type: Sequelize.INTEGER, // Revert back to the original data type
      unique: true, // Set unique constraint back to true if it was previously unique
    });
  }
};
