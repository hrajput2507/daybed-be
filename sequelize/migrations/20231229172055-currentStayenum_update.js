'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.query('ALTER TABLE "currentStays" DROP CONSTRAINT "currentStays_userId_key";');
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.query('ALTER TABLE "currentStays" ADD CONSTRAINT "currentStays_userId_key" UNIQUE ("userId");');
  }
};
