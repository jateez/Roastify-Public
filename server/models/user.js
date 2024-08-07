'use strict';
const {
  Model
} = require('sequelize');
const { hashPassword } = require('../helpers/bcrypt');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      User.hasMany(models.Artist);
      User.hasMany(models.Song);
      User.hasMany(models.RoastHistory);
    }
  }
  User.init({
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: {
          msg: "Please use a valid email"
        },
        notNull: {
          msg: "Email must not null"
        },
        notEmpty: {
          msg: "Email must not empty"
        }
      }
    },
    fullName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: "Name must not null"
        },
        notEmpty: {
          msg: "Name must not empty"
        }
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: "Password must not null"
        },
        notEmpty: {
          msg: "Password must not empty"
        }
      }
    },
    googleId: DataTypes.STRING,
    spotifyId: DataTypes.STRING,
    lastRoastDate: DataTypes.DATE,
    imageUrl: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'User',
  });

  User.beforeCreate((instance) => {
    instance.password = hashPassword(instance.password)
  })
  return User;
};