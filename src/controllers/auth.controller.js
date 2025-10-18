const authService = require("../services/auth.service");
const Response = require("../utils/response.util");

const register = async (req, res, next) => {
  try {
    const { user, token } = await authService.register(req.body);
    res
      .status(201)
      .json(new Response("User registered successfully", { user, token }));
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const { user, token } = await authService.login(email, password);
    res.status(200).json(new Response("Login successful", { user, token }));
  } catch (error) {
    next(error);
  }
};

const getProfile = async (req, res, next) => {
  try {
    // The user object is attached to the request by the authMiddleware
    // We can just return it
    const user = req.user;
    res
      .status(200)
      .json(new Response("Profile retrieved successfully", { user }));
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  login,
  getProfile,
};
