"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Favorites", {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
      },
      userId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: { model: "Users", key: "id" },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      carId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: { model: "Cars", key: "id" },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      createdAt: { allowNull: false, type: Sequelize.DATE },
      updatedAt: { allowNull: false, type: Sequelize.DATE },
    });
    // Add unique constraint
    await queryInterface.addConstraint("Favorites", {
      fields: ["userId", "carId"],
      type: "unique",
      name: "user_car_favorite_unique",
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("Favorites");
  },
};
