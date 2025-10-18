const express = require("express");
const aiController = require("../controllers/ai.controller");
const authMiddleware = require("../middlewares/auth.middleware");

const router = express.Router();

router.post("/chat", authMiddleware, aiController.getChatRecommendation);

module.exports = router;
