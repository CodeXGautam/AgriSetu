import User from '../models/user.model.js';
import { ChatMistralAI } from "@langchain/mistralai";
import { ChatPromptTemplate } from "@langchain/core/prompts";

// Initialize Mistral model using the same configuration
const mistral = new ChatMistralAI({
    apiKey: process.env.MISTRAL_API_KEY,
    model: "mistral-large-latest",
});

const analyzeCartCommand = async (req, res) => {
    try {
        const { transcript } = req.body;
        const userId = req.user._id;

        // Get current cart items and available products
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        // Prepare prompt for Mistral using ChatPromptTemplate
        const prompt = ChatPromptTemplate.fromMessages([
            [
                "system",
                `You are a smart shopping assistant that helps users manage their shopping cart. 
                First, determine if this is a search command or a response to your previous question.
                
                If it's a search command, extract the item name they're looking for.
                If it's a response to your question (like "yes", "no", "yeah", "nope"), interpret their intent.
                
                Return your analysis in this exact JSON format:
                {
                    "type": "search" | "response",
                    "action": "search" | "confirm" | "deny",
                    "item": "item name or null",
                    "confidence": 0.0 to 1.0
                }`
            ],
            [
                "human",
                `User command: "${transcript}"`
            ]
        ]);

        // Create chain and invoke Mistral
        const chain = prompt.pipe(mistral);
        const aiResponse = await chain.invoke({});

        // Parse the response
        let analysis;
        try {
            // Find the JSON in the response
            const jsonMatch = aiResponse.content.match(/\{[\s\S]*\}/);
            analysis = jsonMatch ? JSON.parse(jsonMatch[0]) : { action: "unknown", confidence: 0 };
        
        }
        catch (error) {
            return res.status(500).json({
                success: false,     
                message: "Error parsing AI response",
                error: error.message
            });
        }
        // Send back both the analysis and current cart state
        res.status(200).json({
            success: true,
            analysis: analysis,
            currentCart: user.cartItems
        });

    } catch (error) {
        console.error('Error in analyzeCartCommand:', error);
        res.status(500).json({
            success: false,
            message: "Error processing cart command",
            error: error.message
        });
    }
};

export { analyzeCartCommand };
