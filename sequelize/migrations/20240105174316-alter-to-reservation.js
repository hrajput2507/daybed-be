'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('reservations', 'is_deleted', {
      type: Sequelize.BOOLEAN,
      defaultValue: false
    });
  },


  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('reservations', 'is_deleted');

  }
}

