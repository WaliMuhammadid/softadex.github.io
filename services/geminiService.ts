
import { GoogleGenAI } from "@google/genai";
import { ChatMessage, GroundingSource } from "../types";

// Always use const ai = new GoogleGenAI({apiKey: process.env.API_KEY});
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getAIStrategyResponse = async (userPrompt: string): Promise<ChatMessage> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: userPrompt,
      config: {
        systemInstruction: "You are the Lead Strategist at NEBULA WEB3, a futuristic digital agency. You specialize in Blockchain, NFTs, DAOs, and AI integration. Provide sharp, futuristic, and professional advice. Use Google Search to find current web3 market trends if the user asks for data. Be concise but deep in your insights.",
        tools: [{ googleSearch: {} }],
        thinkingConfig: { thinkingBudget: 4000 }
      },
    });

    const text = response.text || "I'm processing the data stream...";
    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
    
    const sources: GroundingSource[] = [];
    if (groundingChunks) {
      groundingChunks.forEach((chunk: any) => {
        if (chunk.web) {
          sources.push({
            title: chunk.web.title,
            uri: chunk.web.uri
          });
        }
      });
    }

    return {
      role: 'model',
      text,
      sources: sources.length > 0 ? sources : undefined
    };
  } catch (error) {
    console.error("Gemini Pro API Error:", error);
    return {
      role: 'model',
      text: "System error in the neural link. The high-fidelity model is currently recalibrating. Please try re-initializing.",
    };
  }
};

export const fetchWeb3Trends = async (): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: "List 3 high-impact Web3 and AI design trends happening right now in 2024-2025. Keep it very brief, under 15 words.",
      config: {
        tools: [{ googleSearch: {} }],
      },
    });
    return response.text || "Decentralized identity, AI-generative UI, and Spatial Web protocols.";
  } catch (error) {
    return "The future is unfolding in real-time.";
  }
};
