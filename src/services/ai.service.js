const { GoogleGenerativeAI } = require("@google/generative-ai");
const config = require("../config");
const carRepository = require("../repositories/car.repository");

// Initialize the Google Generative AI client
const genAI = new GoogleGenerativeAI(config.gemini.apiKey);

const getCarRecommendation = async (userMessage) => {
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

  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const prompt = `You are a helpful car shopping assistant for a used car marketplace. Your goal is to help users find the perfect car based on their needs.
  - Analyze the user's message to understand their requirements (e.g., budget, body type like SUV or sedan, features, family size).
  - Based on the user's request and the list of available cars provided, recommend the top 3-5 cars that are the best fit.
  - Your response should be a friendly, conversational message explaining why you chose those cars.
  - You MUST return a valid JSON object with two keys: "message" (your conversational response as a string) and "recommendedCarIds" (an array of the car ID strings you are recommending).
  - Do not recommend any cars that are not in the provided list.
  - If no cars match the user's request, explain that and suggest they broaden their search. The "recommendedCarIds" array should be empty in this case.
  - Do not make up car details. Use only the information provided.

  User message: "${userMessage}".
  
  Available cars: ${JSON.stringify(carsContext)}
  `;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Clean the response to ensure it's valid JSON
    const jsonString = text.replace(/^```json\n/, "").replace(/\n```$/, "");
    const parsedResponse = JSON.parse(jsonString);

    // Fetch full car details for the recommended IDs to return to the user
    const recommendedCars = await Promise.all(
      (parsedResponse.recommendedCarIds || []).map((id) =>
        carRepository.findById(id)
      )
    );

    return {
      message: parsedResponse.message,
      recommendedCars: recommendedCars.filter((car) => car !== null), // Filter out any nulls if an ID was invalid
    };
  } catch (error) {
    console.error("Error with Gemini API:", error);
    throw new Error("Failed to get recommendation from AI service.");
  }
};

module.exports = {
  getCarRecommendation,
};
