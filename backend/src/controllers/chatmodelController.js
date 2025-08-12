import fetch from "node-fetch";
import { ChatMistralAI } from "@langchain/mistralai";
import { ChatPromptTemplate } from "@langchain/core/prompts";

// Load from environment variables for security
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

// Disease detection endpoint
export const analyzePlantDisease = async (req, res) => {
  try {
    const { image_url } = req.body;
    
    if (!image_url) {
      return res.status(400).json({ 
        success: false,
        error: "image_url is required" 
      });
    }

    // Step 1: Call disease detection model
    const predictionRes = await fetch("https://agrisetu.onrender.com/predict", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ image_url }),
    });

    if (!predictionRes.ok) {
      throw new Error(`Disease detection API failed: ${predictionRes.status}`);
    }

    const predictionData = await predictionRes.json();
    const detectedDisease = predictionData.prediction;

    // Step 2: Prepare prompt for Mistral
    const prompt = ChatPromptTemplate.fromMessages([
      [
        "system",
        "You are an expert agricultural assistant. Provide concise, practical advice for farmers. Keep responses brief and to the point - maximum 3-4 sentences per section."
      ],
      [
        "human",
        `The detected plant disease is: ${detectedDisease}. Please provide a SHORT response with:
        1. Brief disease description (1-2 sentences)
        2. Key symptoms (2-3 bullet points)
        3. Quick treatment tips (2-3 bullet points)
        4. Prevention (1-2 sentences)
        Keep the total response under 150 words.`
      ],
    ]);

    // Step 3: Create chain and invoke Mistral
    const chain = prompt.pipe(mistral);
    const aiResponse = await chain.invoke({});

    // Step 4: Send combined result
    res.status(200).json({
      success: true,
      data: {
        disease: detectedDisease,
        advice: aiResponse.content,
        timestamp: new Date().toISOString()
      }
    });

  } catch (err) {
    console.error("Disease analysis error:", err);
    res.status(500).json({ 
      success: false,
      error: "Internal server error during disease analysis",
      message: err.message 
    });
  }
};

// Agricultural Chatbot endpoint
export const agriculturalChatbot = async (req, res) => {
  try {
    const { message, userLanguage = 'en', conversationHistory = [], location } = req.body;

    if (!message) {
      return res.status(400).json({
        success: false,
        error: "Message is required"
      });
    }

    // Prepare conversation context for Mistral
    const messages = [
      [
        "system",
        `You are an expert agricultural consultant named "Kisaan Guru" (Farmer's Teacher). You have decades of experience helping farmers across India and the world.

Your role is to:
- Provide practical, actionable farming advice
- Answer questions about crops, soil, weather, pests, and farming techniques
- Give responses in a warm, conversational, and human-like manner
- Keep responses concise but informative (2-4 sentences maximum)
- Respond in the user's preferred language when possible
- Never use markdown formatting, asterisks, or special characters
- Be encouraging and supportive, like talking to a friend
${location && location.latitude && location.longitude ? `- The user is located at coordinates: ${location.latitude}, ${location.longitude}` : ''}
${location && location.city ? `- The user is in: ${location.city}${location.state ? `, ${location.state}` : ''}${location.country ? `, ${location.country}` : ''}` : ''}
- Use location information when available to provide region-specific agricultural advice
- Consider local climate, soil conditions, and farming practices when giving recommendations

Current user language: ${userLanguage}
Respond in ${userLanguage === 'en' ? 'English' : 'the user\'s preferred language'}`
      ]
    ];

    // Add conversation history for context (last 5 messages)
    if (conversationHistory.length > 0) {
      const recentHistory = conversationHistory.slice(-5);
      recentHistory.forEach(({ role, content }) => {
        messages.push([role === 'user' ? 'human' : 'assistant', content]);
      });
    }

    // Add current user message
    messages.push(["human", message]);

    // Create prompt template
    const prompt = ChatPromptTemplate.fromMessages(messages);

    // Create chain and invoke Mistral
    const chain = prompt.pipe(mistral);
    const aiResponse = await chain.invoke({});

    // Clean the response to remove any special characters
    let cleanedResponse = aiResponse.content
      .replace(/\*\*/g, '')
      .replace(/\*/g, '')
      .replace(/`/g, '')
      .replace(/#{1,6}\s/g, '')
      .replace(/\n{3,}/g, '\n\n')
      .trim();

    res.status(200).json({
      success: true,
      data: {
        response: cleanedResponse,
        timestamp: new Date().toISOString(),
        userLanguage: userLanguage
      }
    });

  } catch (err) {
    console.error("Agricultural chatbot error:", err);
    res.status(500).json({
      success: false,
      error: "Internal server error during chat",
      message: err.message
    });
  }
};
