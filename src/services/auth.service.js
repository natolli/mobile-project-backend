const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const userRepository = require("../repositories/user.repository");
const config = require("../config");

/**
 * Creates a JWT for a given user ID.
 * @param {number} userId - The ID of the user.
 * @returns {string} The generated JWT.
 */
const generateToken = (userId) => {
  const payload = { id: userId };
  return jwt.sign(payload, config.jwt.secret, {
    expiresIn: config.jwt.expiresIn,
  });
};

/**
 * Register a new user.
 * @param {object} userData - The user data for registration.
 * @returns {Promise<{user: object, token: string}>}
 */
const register = async (userData) => {
  const { email, password, firstName, lastName } = userData;

  const existingUser = await userRepository.findByEmail(email);
  if (existingUser) {
    throw new Error("Email already in use"); // Or a custom error class
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = await userRepository.createUser({
    email,
    password: hashedPassword,
    firstName,
    lastName,
  });

  const token = generateToken(newUser.id);
  // Remove password from user object before returning
  delete newUser.dataValues.password;

  return { user: newUser, token };
};

/**
 * Login a user.
 * @param {string} email - The user's email.
 * @param {string} password - The user's password.
 * @returns {Promise<{user: object, token: string}>}
 */
const login = async (email, password) => {
  const user = await userRepository.findByEmail(email);
  if (!user) {
    throw new Error("Invalid email or password");
  }

  const isPasswordMatch = await bcrypt.compare(password, user.password);
  if (!isPasswordMatch) {
    throw new Error("Invalid email or password");
  }

  const token = generateToken(user.id);
  // Remove password from user object before returning
  delete user.dataValues.password;

  return { user, token };
};

module.exports = {
  register,
  login,
};
