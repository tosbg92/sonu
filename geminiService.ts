
import { GoogleGenAI, Type } from "@google/genai";
import { Question } from "./types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const QUIZ_SCHEMA = {
  type: Type.ARRAY,
  items: {
    type: Type.OBJECT,
    properties: {
      text: { type: Type.STRING, description: "The question text, bilingual in English and Hindi if possible." },
      options: { 
        type: Type.ARRAY, 
        items: { type: Type.STRING },
        description: "Exactly 4 options, bilingual."
      },
      correctAnswerIndex: { type: Type.INTEGER, description: "Index of the correct option (0-3)." }
    },
    required: ["text", "options", "correctAnswerIndex"]
  }
};

export const generateQuizFromText = async (text: string, title: string, count: number = 25): Promise<Question[]> => {
  if (!text || text.trim().length < 50) {
    throw new Error("Source content is too brief to generate a high-quality quiz. Please provide more text.");
  }

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `You are a professional ITI examiner. Create a comprehensive MCQ quiz based on the following content titled "${title}". 
      Generate exactly ${count} questions. 
      Format: Each question and option must be bilingual (English / Hindi).
      Source Content: ${text.substring(0, 15000)}`, // Limit text to avoid token overflow
      config: {
        responseMimeType: "application/json",
        responseSchema: QUIZ_SCHEMA,
      },
    });

    const result = JSON.parse(response.text || "[]");
    
    if (!Array.isArray(result) || result.length === 0) {
      throw new Error("AI failed to generate a valid question array.");
    }

    return result.map((q: any, i: number) => ({
      ...q,
      id: `ai-q-${Date.now()}-${i}`
    }));
  } catch (error: any) {
    console.error("Gemini Synthesis Error:", error);
    if (error.message?.includes("API_KEY")) {
      throw new Error("AI Service authorization failed. Please check system configuration.");
    }
    throw new Error(`Synthesis Failed: ${error.message || "Unknown error during AI generation."}`);
  }
};
