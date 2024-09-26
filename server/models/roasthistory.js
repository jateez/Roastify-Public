'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class RoastHistory extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      RoastHistory.belongsTo(models.User)
    }
  }
  RoastHistory.init({
    UserId: DataTypes.INTEGER,
    roastType: DataTypes.STRING,
    roastData: DataTypes.JSONB,
    tracks: DataTypes.JSONB,
    artists: DataTypes.JSONB
  }, {
    sequelize,
    modelName: 'RoastHistory',
  });
  return RoastHistory;
};