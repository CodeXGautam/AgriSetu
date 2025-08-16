import { ChatMistralAI } from "@langchain/mistralai";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import Conversation from "../models/chat.model.js";
import fetch from "node-fetch";

// Load Mistral API key from environment
const mistralApiKey = process.env.MISTRAL_API_KEY;

if (!mistralApiKey) {
  console.error("❌ Please set MISTRAL_API_KEY in your environment");
  process.exit(1);
}

// Initialize Mistral model
const mistral = new ChatMistralAI({
  apiKey: mistralApiKey,
  model: "mistral-large-latest",
});

// Helper function to get current season based on month
const getCurrentSeason = () => {
  const month = new Date().getMonth() + 1; // 1-12
  if (month >= 4 && month <= 6) return 'summer';
  if (month >= 7 && month <= 10) return 'kharif';
  if (month >= 11 || month <= 3) return 'rabi';
  return 'year-round';
};

// Helper function to fetch weather data
const fetchWeatherData = async (location) => {
  try {
    const apikey = process.env.WEATHER_API_KEY;
    if (!apikey) {
      console.warn('Weather API key not found');
      return null;
    }
    
    const url = `http://api.weatherapi.com/v1/forecast.json?key=${apikey}&q=${location.lat},${location.lon}&days=7&aqi=no&alerts=yes`;
    const response = await fetch(url);
    
    if (!response.ok) {
      console.warn('Weather API request failed:', response.status);
      return null;
    }
    
    const weatherData = await response.json();
    return weatherData;
  } catch (error) {
    console.warn('Error fetching weather data:', error);
    return null;
  }
};

// Helper function to analyze user's farming interests from chat history
const analyzeFarmingInterests = async (userId) => {
  try {
    const recentConversations = await Conversation.find({ userId })
      .sort({ updatedAt: -1 })
      .limit(10);
    
    const chatContent = recentConversations
      .flatMap(conv => conv.messages.map(msg => msg.content))
      .join(' ')
      .toLowerCase();
    
    // Extract crop-related keywords
    const cropKeywords = [
      'rice', 'wheat', 'maize', 'corn', 'cotton', 'sugarcane', 'soybean', 
      'tomato', 'potato', 'onion', 'garlic', 'chili', 'pepper', 'cabbage',
      'cauliflower', 'broccoli', 'spinach', 'lettuce', 'carrot', 'radish',
      'beans', 'peas', 'lentils', 'chickpea', 'groundnut', 'sunflower',
      'mustard', 'sesame', 'barley', 'millet', 'jowar', 'bajra'
    ];
    
    const interests = cropKeywords.filter(crop => 
      chatContent.includes(crop)
    );
    
    return {
      totalChats: recentConversations.reduce((total, conv) => total + conv.messages.length, 0),
      cropInterests: interests,
      recentTopics: chatContent.substring(0, 500)
    };
  } catch (error) {
    console.error('Error analyzing farming interests:', error);
    return {
      totalChats: 0,
      cropInterests: [],
      recentTopics: ''
    };
  }
};

// Main crop pricing analytics endpoint
export const getCropPricingAnalytics = async (req, res) => {
  try {
    const { location } = req.body;
    const userId = req.user?.id;

    if (!location || !location.lat || !location.lon) {
      return res.status(400).json({
        success: false,
        error: "Location coordinates (lat, lon) are required"
      });
    }

    // Fetch weather data internally
    const weatherData = await fetchWeatherData(location);
    
    // Get current season
    const currentSeason = getCurrentSeason();
    
    // Analyze user's farming interests
    const farmingAnalysis = userId ? await analyzeFarmingInterests(userId) : {
      totalChats: 0,
      cropInterests: [],
      recentTopics: ''
    };

    // Prepare comprehensive prompt for Mistral
    const locationName = location?.city || 'India';
    const prompt = ChatPromptTemplate.fromMessages([
      [
        "system",
`Provide crop pricing for {locationName} in {currentSeason} season. Return ONLY valid JSON:
{{
  "pricingAnalytics": [
    {{"name": "Rice", "currentPrice": "1800-2200", "profitability": "Medium", "riskLevel": "Low", "priceTrend": "Stable", "demand": "High"}},
    {{"name": "Wheat", "currentPrice": "2000-2400", "profitability": "High", "riskLevel": "Low", "priceTrend": "Rising", "demand": "High"}},
    {{"name": "Maize", "currentPrice": "1900-2300", "profitability": "High", "riskLevel": "Medium", "priceTrend": "Stable", "demand": "High"}}
  ],
  "marketInsights": {{"seasonalAdvice": "Focus on seasonal crops", "priceVolatility": "Medium"}},
  "recommendations": {{"shortTerm": ["Plant seasonal crops", "Monitor market prices", "Consider storage options"]}}
}}`
      ],
      ["human", "Get pricing data"]
    ]);

    // Create chain and invoke Mistral
    const chain = prompt.pipe(mistral);
    const aiResponse = await chain.invoke({
      locationName,
      currentSeason
    });

    // Parse the JSON response
    let analyticsData;
    try {
      // Clean the response to ensure it's valid JSON
      let cleanedResponse = aiResponse.content.trim();
      
      // Remove any markdown code blocks if present
      cleanedResponse = cleanedResponse.replace(/```json\n?/g, '').replace(/```\n?/g, '');
      
      // Clean up problematic characters that cause JSON parsing issues
      cleanedResponse = cleanedResponse
        .replace(/[\u0000-\u001f\u007f-\u009f]/g, '') // Remove control characters
        .replace(/\\/g, '') // Remove problematic backslashes that aren't proper escapes
        .replace(/\n\s*\n/g, ' ') // Replace multiple newlines with space
        .replace(/\s+/g, ' ') // Normalize whitespace
        .replace(/,(\s*[}\]])/g, '$1'); // Remove trailing commas
      
      analyticsData = JSON.parse(cleanedResponse);
    } catch (parseError) {
      console.error('Error parsing Mistral response:', parseError);
      console.error('Raw response:', aiResponse.content);
      
      // Fallback response
      analyticsData = {
        pricingAnalytics: [
          {
            name: "Rice",
            currentPrice: "1800-2200",
            profitability: "Medium",
            riskLevel: "Low",
            priceTrend: "Stable demand with seasonal price variations",
            demand: "High"
          },
          {
            name: "Wheat",
            currentPrice: "2000-2400",
            profitability: "High",
            riskLevel: "Low",
            priceTrend: "Rising due to export demand",
            demand: "High"
          },
          {
            name: "Maize",
            currentPrice: "1900-2300",
            profitability: "High",
            riskLevel: "Medium",
            priceTrend: "Increasing with animal feed demand",
            demand: "High"
          }
        ],
        marketInsights: {
          seasonalAdvice: "Focus on seasonal crops for optimal returns",
          priceVolatility: "Medium"
        },
        recommendations: {
          shortTerm: ["Focus on current season crops", "Monitor market prices", "Consider high-demand crops"]
        }
      };
    }

    // Transform the data structure to match frontend expectations
    const transformedData = {
      crops: analyticsData.pricingAnalytics || analyticsData.crops || [],
      marketOutlook: analyticsData.marketInsights?.seasonalAdvice || "Market analysis available",
      weatherImpact: analyticsData.marketInsights?.priceVolatility || "Medium volatility",
      region: (location?.city || 'Your area') + ' - Agricultural Zone',
      currentSeason: getCurrentSeason(),
      recommendations: Array.isArray(analyticsData.recommendations?.shortTerm) 
        ? analyticsData.recommendations.shortTerm.map((rec, index) => ({
            crop: "Recommendation " + (index + 1),
            reason: rec
          }))
        : [
            { crop: "High Value Crops", reason: "Focus on crops with better market prices" },
            { crop: "Seasonal Crops", reason: "Plant according to current season for optimal yield" }
          ]
    };

    res.status(200).json({
      success: true,
      data: transformedData
    });

  } catch (error) {
    console.error('Crop pricing analytics error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get crop pricing analytics',
      message: error.message
    });
  }
};

// Get historical price trends for a specific crop
export const getCropPriceTrends = async (req, res) => {
  try {
    const { cropName, location } = req.body;

    if (!cropName) {
      return res.status(400).json({
        success: false,
        error: "Crop name is required"
      });
    }

    const prompt = ChatPromptTemplate.fromMessages([
      [
        "system",
        `You are an expert agricultural market analyst. Provide historical price trend analysis for the requested crop in JSON format only.

IMPORTANT: Respond with ONLY a valid JSON object. No additional text or formatting.

JSON structure:
{
  "cropName": "Crop Name",
  "location": "Location details",
  "priceHistory": [
    {
      "month": "Month Year",
      "price": number,
      "trend": "up|down|stable"
    }
  ],
  "analysis": {
    "averagePrice": number,
    "priceVolatility": "High|Medium|Low",
    "seasonalPattern": "description",
    "marketFactors": ["factor1", "factor2"],
    "forecast": "3-month price forecast"
  }
}`
      ],
      [
        "human",
        `Provide detailed price trend analysis for: {cropName}
        
Location: {locationName}, {locationState}

Include:
1. Monthly price data for the last 12 months
2. Price volatility analysis
3. Seasonal patterns
4. Key market factors affecting prices
5. 3-month price forecast

Use realistic Indian market prices in ₹ per quintal.`
      ]
    ]);

    const chain = prompt.pipe(mistral);
    const aiResponse = await chain.invoke({
      cropName,
      locationName: location?.city || 'India',
      locationState: location?.state || 'General'
    });

    let trendData;
    try {
      let cleanedResponse = aiResponse.content.trim();
      cleanedResponse = cleanedResponse.replace(/```json\n?/g, '').replace(/```\n?/g, '');
      trendData = JSON.parse(cleanedResponse);
    } catch (parseError) {
      console.error('Error parsing price trends response:', parseError);
      return res.status(500).json({
        success: false,
        error: 'Failed to parse price trend data'
      });
    }

    res.status(200).json({
      success: true,
      data: trendData
    });

  } catch (error) {
    console.error('Get crop price trends error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get crop price trends',
      message: error.message
    });
  }
};
