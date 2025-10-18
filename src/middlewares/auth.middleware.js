const jwt = require("jsonwebtoken");
const config = require("../config");
const userRepository = require("../repositories/user.repository");
const logger = require("../utils/logger");

const authMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized: No token provided" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, config.jwt.secret);
    const user = await userRepository.findById(decoded.id);

    if (!user) {
      return res.status(401).json({ message: "Unauthorized: User not found" });
    }

    // Attach user to the request object, excluding the password
    req.user = user;
    next();
  } catch (error) {
    logger.error("Authentication error:", error);
    if (error instanceof jwt.TokenExpiredError) {
      return res
        .status(401)
        .json({ message: "Unauthorized: Token has expired" });
    }
    return res.status(401).json({ message: "Unauthorized: Invalid token" });
  }
};

module.exports = authMiddleware;
