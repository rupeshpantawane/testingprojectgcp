'use strict';
const { TE, to } = require("../services/util.service");
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class UserRelation extends Model {
    static associate(models) {
    }
  }
  UserRelation.init({
    user_id: {
      type: DataTypes.INTEGER,
      references: { model: "users", key: "id" },
      onDelete: "CASCADE",
      allowNull: false,
    },
    user_id2: {
      type: DataTypes.INTEGER,
      references: { model: "users", key: "id" },
      onDelete: "CASCADE",
      allowNull: false,
    },
    id1m: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    id1r: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    id1d: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    id2m: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    id2a: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    deleted_at: {
      allowNull: true,
      type: DataTypes.DATE,
    }
  },
    {
    sequelize,
    modelName: 'UserRelation',
    tableName: "user_relations",
    createdAt: "created_at",
    updatedAt: "updated_at",
    paranoid: true,
    underscored: true
  });
  UserRelation.associate = function (models) {
    UserRelation.belongsTo(models.User, {
      sourceKey: 'id',
      foreignKey: 'user_id2',
      constraints: false,
      as: 'userListRelation'
    })
  };
  return UserRelation;
};