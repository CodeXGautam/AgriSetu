import GoogleGenAI from '@google/genai';

const ai = new GoogleGenAI({});

async function main() {
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: "How are you",
  });
  console.log(response.text);
}