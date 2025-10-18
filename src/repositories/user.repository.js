const { User } = require("../models");

/**
 * Find a user by their email address.
 * @param {string} email - The user's email.
 * @returns {Promise<User|null>} The user object or null if not found.
 */
const findByEmail = (email) => {
  return User.findOne({ where: { email } });
};

/**
 * Find a user by their ID.
 * @param {number} id - The user's ID.
 * @returns {Promise<User|null>} The user object or null if not found.
 */
const findById = (id) => {
  return User.findByPk(id, {
    // Exclude the password hash by default
    attributes: { exclude: ["password"] },
  });
};

/**
 * Create a new user.
 * @param {object} userData - The data for the new user.
 * @returns {Promise<User>} The newly created user object.
 */
const createUser = (userData) => {
  return User.create(userData);
};

module.exports = {
  findByEmail,
  findById,
  createUser,
};
