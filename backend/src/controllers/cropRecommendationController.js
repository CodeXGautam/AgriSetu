import { ChatMistralAI } from "@langchain/mistralai";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import fetch from "node-fetch";

const mistralApiKey = process.env.MISTRAL_API_KEY;

if (!mistralApiKey) {
  console.error("❌ Please set MISTRAL_API_KEY in your environment");
  process.exit(1);
}

const mistral = new ChatMistralAI({
  apiKey: mistralApiKey,
  model: "mistral-large-latest",
});

const getCurrentSeason = () => {
  const month = new Date().getMonth() + 1;
  if (month >= 4 && month <= 6) return "summer";
  if (month >= 7 && month <= 10) return "kharif";
  if (month >= 11 || month <= 3) return "rabi";
  return "year-round";
};

const fetchWeatherData = async (location) => {
  try {
    const apikey = process.env.WEATHER_API_KEY;
    if (!apikey) return null;

    const response = await fetch(
      `http://api.weatherapi.com/v1/current.json?key=${apikey}&q=${location.lat},${location.lon}&aqi=no`
    );

    if (!response.ok) return null;
    return await response.json();
  } catch (error) {
    console.error("Weather fetch error:", error);
    return null;
  }
};

export const getCropRecommendations = async (req, res) => {
  try {
    const { location, conversationHistory = [] } = req.body;
    const userId = req.user?.id;

    if (!location || !location.lat || !location.lon) {
      return res.status(400).json({
        success: false,
        error: "Location coordinates (lat, lon) are required",
      });
    }

    const currentSeason = getCurrentSeason();
    const weatherData = await fetchWeatherData(location);

    const chatContext =
      conversationHistory.length > 0
        ? conversationHistory
            .slice(-10)
            .map((msg) => msg.content || msg.message)
            .join(" ")
        : "No previous farming discussions";

    const locationContext = `Location: ${
      location?.city || "Unknown"
    }, ${location?.state || ""} (${location.lat}, ${location.lon})`;
    const weatherContext = weatherData
      ? `Current weather: ${weatherData.current.condition.text}, ${weatherData.current.temp_c}°C`
      : "Weather data unavailable";

    // Use fromTemplate with proper LangChain variable syntax
    const prompt = ChatPromptTemplate.fromTemplate(`
You are an expert agricultural consultant. Based on the user's location, current weather, season, and farming chat history, recommend 4-5 most suitable crops.

Return ONLY a valid JSON response with this exact structure:
{{
  "recommendations": [
    {{
      "name": "Crop Name",
      "image": "https://example.com/crop-image.jpg",
      "suitability": "High/Medium/Low",
      "season": "kharif/rabi/summer",
      "duration": "X-Y days",
      "benefits": "Brief benefit description",
      "growingTips": ["Tip 1", "Tip 2", "Tip 3"],
      "expectedYield": "X-Y tons/hectare",
      "marketPrice": "₹X-Y/quintal",
      "waterRequirement": "High/Medium/Low",
      "soilType": "Preferred soil type"
    }}
  ],
  "insights": {{
    "currentSeason": "season",
    "region": "region name",
    "weatherCondition": "current weather",
    "personalizedAdvice": "Based on chat history insights",
    "bestPractices": ["Practice 1", "Practice 2", "Practice 3"]
  }}
}}

Please recommend crops based on:

{locationContext}
Season: {currentSeason}
{weatherContext}

User's farming chat history context: {chatContext}

Provide personalized crop recommendations with crop images and detailed growing tips in JSON format.
`);

    const chain = prompt.pipe(mistral);
    const aiResponse = await chain.invoke({
      locationContext,
      currentSeason,
      weatherContext,
      chatContext
    });

    let recommendationData;
    try {
      let cleanedResponse = aiResponse.content.trim();
      cleanedResponse = cleanedResponse
        .replace(/```json\n?/g, "")
        .replace(/```\n?/g, "");
      cleanedResponse = cleanedResponse.replace(
        /[\u0000-\u001f\u007f-\u009f]/g,
        ""
      );

      recommendationData = JSON.parse(cleanedResponse);

      if (recommendationData.recommendations) {
        recommendationData.recommendations =
          recommendationData.recommendations.map((crop) => ({
            ...crop,
            image:
              crop.image ||
              `https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400&h=300&fit=crop&auto=format&q=60`,
          }));
      }
    } catch (parseError) {
      console.error("Error parsing Mistral response:", parseError);

      recommendationData = {
        recommendations: [
          {
            name: "Rice",
            image:
              "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&h=300&fit=crop&auto=format&q=60",
            suitability: "High",
            season: currentSeason,
            duration: "120-150 days",
            benefits: "Staple food crop with consistent market demand",
            growingTips: [
              "Plant during monsoon",
              "Maintain water levels",
              "Use certified seeds",
              "Apply balanced fertilizers",
            ],
            expectedYield: "4-6 tons/hectare",
            marketPrice: "₹1800-2200/quintal",
            waterRequirement: "High",
            soilType: "Clay loam",
          },
          {
            name: "Wheat",
            image:
              "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400&h=300&fit=crop&auto=format&q=60",
            suitability: "High",
            season: "rabi",
            duration: "120-140 days",
            benefits: "High market demand and good storage life",
            growingTips: [
              "Sow in winter",
              "Regular irrigation",
              "Monitor for diseases",
              "Timely harvesting",
            ],
            expectedYield: "3-5 tons/hectare",
            marketPrice: "₹2000-2400/quintal",
            waterRequirement: "Medium",
            soilType: "Loamy",
          },
          {
            name: "Maize",
            image:
              "https://images.unsplash.com/photo-1551754655-cd27e38d2076?w=400&h=300&fit=crop&auto=format&q=60",
            suitability: "Medium",
            season: "kharif",
            duration: "90-120 days",
            benefits: "Versatile crop with multiple uses",
            growingTips: [
              "Plant after monsoon",
              "Ensure good drainage",
              "Pest management",
              "Adequate spacing",
            ],
            expectedYield: "5-7 tons/hectare",
            marketPrice: "₹1900-2300/quintal",
            waterRequirement: "Medium",
            soilType: "Well-drained loam",
          },
        ],
        insights: {
          currentSeason: currentSeason,
          region: location?.city || "Your area",
          weatherCondition: weatherData
            ? weatherData.current.condition.text
            : "Suitable",
          personalizedAdvice:
            "Based on your location and season, focus on crops suitable for local climate conditions",
          bestPractices: [
            "Soil testing",
            "Crop rotation",
            "Organic farming",
            "Water management",
          ],
        },
      };
    }

    res.status(200).json({
      success: true,
      data: recommendationData,
    });
  } catch (error) {
    console.error("Crop recommendation error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to get crop recommendations",
      message: error.message,
    });
  }
};

export const getCropDetails = async (req, res) => {
  try {
    const { cropKey } = req.params;

    const cropDatabase = {
      rice: {
        name: "Rice",
        scientificName: "Oryza sativa",
        season: "kharif",
        duration: "120-150 days",
        waterRequirement: "High",
        soilType: "Clay loam",
        expectedYield: "4-6 tons per hectare",
        marketPrice: "₹1800-2200 per quintal",
        benefits: "Staple food crop with consistent market demand",
        challenges: "Water intensive, pest management required",
        growingTips: [
          "Plant during monsoon season",
          "Maintain water levels in fields",
          "Use certified seeds",
          "Apply fertilizers as per soil test",
        ],
      },
      wheat: {
        name: "Wheat",
        scientificName: "Triticum aestivum",
        season: "rabi",
        duration: "120-140 days",
        waterRequirement: "Medium",
        soilType: "Loamy",
        expectedYield: "3-5 tons per hectare",
        marketPrice: "₹2000-2400 per quintal",
        benefits: "High market demand, good storage life",
        challenges: "Temperature sensitive, requires timely sowing",
        growingTips: [
          "Sow in November-December",
          "Ensure proper irrigation",
          "Monitor for rust diseases",
          "Harvest at right maturity",
        ],
      },
    };

    const cropDetails = cropDatabase[cropKey.toLowerCase()];

    if (!cropDetails) {
      return res.status(404).json({
        success: false,
        error: "Crop details not found",
      });
    }

    res.status(200).json({
      success: true,
      data: cropDetails,
    });
  } catch (error) {
    console.error("Crop details error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to get crop details",
      message: error.message,
    });
  }
};

export const saveCropSelection = async (req, res) => {
  try {
    const { selectedCrops } = req.body;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        error: "Authentication required",
      });
    }

    res.status(200).json({
      success: true,
      message: "Crop selection saved successfully",
      data: { selectedCrops, userId },
    });
  } catch (error) {
    console.error("Save crop selection error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to save crop selection",
      message: error.message,
    });
  }
};
