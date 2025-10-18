"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Cars", {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
      },
      make: { type: Sequelize.STRING, allowNull: false },
      model: { type: Sequelize.STRING, allowNull: false },
      year: { type: Sequelize.INTEGER, allowNull: false },
      price: { type: Sequelize.DECIMAL(10, 2), allowNull: false },
      mileage: { type: Sequelize.INTEGER },
      color: { type: Sequelize.STRING },
      transmission: { type: Sequelize.ENUM("automatic", "manual") },
      fuelType: {
        type: Sequelize.ENUM("petrol", "diesel", "electric", "hybrid"),
      },
      bodyType: {
        type: Sequelize.ENUM("sedan", "suv", "truck", "coupe", "hatchback"),
      },
      description: { type: Sequelize.TEXT },
      features: { type: Sequelize.JSON },
      images: { type: Sequelize.JSON },
      location: { type: Sequelize.STRING },
      status: {
        type: Sequelize.ENUM("available", "sold"),
        defaultValue: "available",
      },
      userId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: { model: "Users", key: "id" },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      createdAt: { allowNull: false, type: Sequelize.DATE },
      updatedAt: { allowNull: false, type: Sequelize.DATE },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("Cars");
  },
};
