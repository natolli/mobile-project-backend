"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Car extends Model {
    static associate(models) {
      // A car belongs to one user (the owner)
      Car.belongsTo(models.User, {
        foreignKey: "userId",
        as: "owner",
      });
      // A car can be favorited by many users
      Car.hasMany(models.Favorite, {
        foreignKey: "carId",
        as: "favoritedBy",
      });
    }
  }
  Car.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      make: { type: DataTypes.STRING, allowNull: false },
      model: { type: DataTypes.STRING, allowNull: false },
      year: { type: DataTypes.INTEGER, allowNull: false },
      price: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
      mileage: DataTypes.INTEGER,
      color: DataTypes.STRING,
      transmission: {
        type: DataTypes.ENUM("automatic", "manual"),
        defaultValue: "automatic",
      },
      fuelType: {
        type: DataTypes.ENUM("petrol", "diesel", "electric", "hybrid"),
        defaultValue: "petrol",
      },
      bodyType: {
        type: DataTypes.ENUM("sedan", "suv", "truck", "coupe", "hatchback"),
        defaultValue: "sedan",
      },
      description: DataTypes.TEXT,
      features: { type: DataTypes.JSON, defaultValue: [] },
      images: { type: DataTypes.JSON, defaultValue: [] },
      location: DataTypes.STRING,
      status: {
        type: DataTypes.ENUM("available", "sold"),
        defaultValue: "available",
      },
      userId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: "Users",
          key: "id",
        },
      },
    },
    {
      sequelize,
      modelName: "Car",
    }
  );
  return Car;
};
