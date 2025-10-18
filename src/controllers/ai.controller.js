const aiService = require("../services/ai.service");
const Response = require("../utils/response.util");

const getChatRecommendation = async (req, res, next) => {
  try {
    const { message } = req.body;
    if (!message) {
      return res
        .status(400)
        .json(new Response("Message is required", null, false));
    }
    const result = await aiService.getCarRecommendation(message);
    res.status(200).json(new Response("AI recommendation received", result));
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getChatRecommendation,
};
