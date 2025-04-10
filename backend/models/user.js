'use strict';
const { TE, to } = require("../services/util.service");
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
    }
  }
  User.init({
    age: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    location: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    height: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    salary: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    job: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    caste: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    education: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    expectation: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    marital_status: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    mobile: {
      type: DataTypes.BIGINT,
      allowNull: true,
    },
    photo: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    gender: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    deleted_at: {
      allowNull: true,
      type: DataTypes.DATE,
    }
  },
    {
    sequelize,
    modelName: 'User',
    tableName: "users",
    createdAt: "created_at",
    updatedAt: "updated_at",
    paranoid: true,
    underscored: true,
    indexes: [
      {
        fields: ['age']
      },
      {
        fields: ['location']
      },
      {
        fields: ['caste']
      },
      {
        fields: ['salary']
      },
      {
        fields: ['job']
      }
    ]
  });
  User.associate = function (models) {
    User.hasMany(models.UserRelation, {
      sourceKey: 'id',
      foreignKey: 'user_id',
      constraints: false,
      as: 'userList'
    })
  };
  return User;
};