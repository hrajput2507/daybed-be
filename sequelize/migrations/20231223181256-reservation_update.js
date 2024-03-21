'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('reservations', 'old_entity_type', {
      type: Sequelize.TEXT,
      allowNull: true
    });

    await queryInterface.addColumn('reservations', 'old_entity_id', {
      type: Sequelize.INTEGER,
      allowNull: true
    });



    down: async (queryInterface, Sequelize) => {
      await queryInterface.removeColumn('reservations', 'old_entity_type');
      await queryInterface.removeColumn('reservations', 'old_entity_id');
      
    }
  }
}
