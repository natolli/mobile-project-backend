const express = require("express");

// Import all route modules
const authRoutes = require("./auth.routes");
const carRoutes = require("./car.routes");
const favoriteRoutes = require("./favorite.routes");
const aiRoutes = require("./ai.routes");

const router = express.Router();

// Define all routes in this array
const allRoutes = [
  {
    path: "/auth",
    route: authRoutes,
  },
  {
    path: "/cars",
    route: carRoutes,
  },
  {
    path: "/favorites",
    route: favoriteRoutes,
  },
  {
    path: "/ai",
    route: aiRoutes,
  },
];

// Register all routes from the array
allRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

module.exports = router;
