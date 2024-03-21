'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('currentStays', 'status', { 
      type: Sequelize.ENUM('staying', 'vacating',),
      defaultValue: 'staying',
      allowNull: false 
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('currentStays', 'status'); 
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_currentStays_status";'); 
  }
};
