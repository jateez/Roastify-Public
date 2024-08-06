'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Artist extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Artist.belongsTo(models.User)
    }
  }
  Artist.init({
    UserId: DataTypes.INTEGER,
    artistId: DataTypes.STRING,
    artistData: DataTypes.JSONB
  }, {
    sequelize,
    modelName: 'Artist',
  });
  return Artist;
};