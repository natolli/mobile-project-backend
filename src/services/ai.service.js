const { GoogleGenerativeAI } = require("@google/generative-ai");
const config = require("../config");
const carRepository = require("../repositories/car.repository");

// Initialize the Google Generative AI client
const genAI = new GoogleGenerativeAI(config.gemini.apiKey);

const getCarRecommendation = async (userMessage) => {
  try {
    // 1. Fetch a sample of available cars to provide context to the AI
    const { rows: cars } = await carRepository.findAllAndCount({
      limit: 50,
      status: "available",
    });

    const carsContext = cars.map((car) => ({
      id: car.id,
      make: car.make,
      model: car.model,
      year: car.year,
      price: car.price,
      bodyType: car.bodyType,
      description: car.description,
    }));

    // With SDK 0.24.1, use gemini-2.5-flash (latest and fastest model)
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
      generationConfig: {
        temperature: 0.7,
        topP: 0.8,
        topK: 40,
        maxOutputTokens: 2048,
      },
    });

    const prompt = `You are a helpful car shopping assistant for a used car marketplace. Your goal is to help users find the perfect car based on their needs.

INSTRUCTIONS:
- Analyze the user's message to understand their requirements (budget, body type, features, family size, etc.)
- Based on the user's request and the list of available cars provided, recommend the top 3-5 cars that are the best fit
- Your response should be a friendly, conversational message explaining why you chose those cars
- Return ONLY a valid JSON object with two keys:
  1. "message": your conversational response as a string
  2. "recommendedCarIds": an array of the car ID strings you are recommending
- Do not recommend any cars that are not in the provided list
- If no cars match the user's request, explain that and suggest they broaden their search. The "recommendedCarIds" array should be empty in this case
- Do not make up car details. Use only the information provided
- IMPORTANT: Return ONLY the JSON object, nothing else. No markdown, no code blocks, no explanations

User message: "${userMessage}"

Available cars: ${JSON.stringify(carsContext)}

Return format example:
{"message": "Based on your needs, here are my recommendations...", "recommendedCarIds": ["id1", "id2", "id3"]}`;

    console.log("Sending request to Gemini API...");
    const result = await model.generateContent(prompt);
    const response = result.response;
    let text = response.text();

    console.log("Received response from Gemini API");
    console.log("Raw response:", text.substring(0, 200) + "...");

    // Clean up the response text - remove markdown code blocks if present
    text = text.trim();
    if (text.startsWith("```json")) {
      text = text
        .replace(/```json\n?/g, "")
        .replace(/```\n?$/g, "")
        .trim();
    } else if (text.startsWith("```")) {
      text = text
        .replace(/```\n?/g, "")
        .replace(/```\n?$/g, "")
        .trim();
    }

    // Parse the JSON response
    let parsedResponse;
    try {
      parsedResponse = JSON.parse(text);
    } catch (parseError) {
      console.error("Failed to parse AI response as JSON:", text);
      console.error("Parse error:", parseError.message);

      // Fallback: return a generic message if parsing fails
      return {
        message:
          "I'm having trouble processing your request right now. Could you please rephrase what kind of car you're looking for? For example, you can tell me your budget, preferred body type (SUV, sedan, etc.), or specific features you need.",
        recommendedCars: [],
      };
    }

    // Validate the response structure
    if (
      !parsedResponse.message ||
      !Array.isArray(parsedResponse.recommendedCarIds)
    ) {
      console.warn("Invalid response structure from AI:", parsedResponse);
      return {
        message:
          parsedResponse.message ||
          "I'm here to help you find the perfect car. What are you looking for?",
        recommendedCars: [],
      };
    }

    // Fetch full car details for the recommended IDs
    const recommendedCars = await Promise.all(
      parsedResponse.recommendedCarIds.map((id) => carRepository.findById(id))
    );

    return {
      message: parsedResponse.message,
      recommendedCars: recommendedCars.filter((car) => car !== null),
    };
  } catch (error) {
    console.error("Full error object:", error);
    console.error("Error status:", error.status);
    console.error("Error message:", error.message);

    // Provide specific error messages based on error type
    if (error.status === 400) {
      throw new Error(
        "Bad request to Gemini API. This might be a billing issue. Please check if you have billing enabled at https://console.cloud.google.com/billing"
      );
    }

    if (error.status === 401 || error.message.includes("API_KEY_INVALID")) {
      throw new Error(
        "Invalid API key. Please verify your API key is correct and active at https://aistudio.google.com/app/apikey"
      );
    }

    if (error.status === 404 || error.message.includes("not found")) {
      throw new Error(
        "Model not found. Your API key might not have access to Gemini models. Please:\n1. Go to https://aistudio.google.com/app/apikey\n2. Delete your old API key\n3. Create a brand NEW API key\n4. Update your config with the new key\n5. Make sure you're signed into a Google account that has access to Gemini"
      );
    }

    if (error.status === 403) {
      throw new Error(
        "Access forbidden. This usually means:\n1. Billing is not enabled (even for free tier)\n2. Or your API key doesn't have permission\nPlease check: https://console.cloud.google.com/apis/library/generativelanguage.googleapis.com"
      );
    }

    if (error.status === 429) {
      throw new Error(
        "Rate limit exceeded. Please wait a moment and try again."
      );
    }

    throw new Error(
      `Gemini API error (${error.status || "unknown"}): ${error.message}`
    );
  }
};

module.exports = {
  getCarRecommendation,
};
