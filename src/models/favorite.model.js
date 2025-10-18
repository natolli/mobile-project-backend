"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Favorite extends Model {
    static associate(models) {
      Favorite.belongsTo(models.User, { foreignKey: "userId" });
      Favorite.belongsTo(models.Car, { foreignKey: "carId" });
    }
  }
  Favorite.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      userId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: { model: "Users", key: "id" },
      },
      carId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: { model: "Cars", key: "id" },
      },
    },
    {
      sequelize,
      modelName: "Favorite",
      // Ensure a user can only favorite a car once
      indexes: [{ unique: true, fields: ["userId", "carId"] }],
    }
  );
  return Favorite;
};
