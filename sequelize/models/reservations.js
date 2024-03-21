'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class reservations extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  reservations.init({
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    property_id: {
      allowNull: false,
        type: DataTypes.INTEGER,
        references: {
          model: "property",
          key: "id"
         }
      },
    unit_id: {
      allowNull: false,
    type: DataTypes.INTEGER,
    references: {
        model: "units",
        key: "id"
        }
    },
    room_id: {
    type: DataTypes.INTEGER,
    references: {
        model: "rooms",
        key: "id"
        }
    },

    existing_subscription_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
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
      start_date: {
        allowNull: false,
        type: DataTypes.DATE,
        require : false
      },
      end_date: {
        allowNull: true,
        type: DataTypes.DATE
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
    modelName: 'reservations',
    freezeTableName: true,
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });
  return reservations;
};