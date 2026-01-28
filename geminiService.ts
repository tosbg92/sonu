
import { GoogleGenAI, Type } from "@google/genai";
import { Question } from "./types";

export const generateQuizFromText = async (text: string, title: string, count: number = 25): Promise<Question[]> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const prompt = `Based on the provided Industrial Robotic and Digital Manufacturing Technician MCQ data, generate exactly ${count} challenge questions.
  
  CORE INSTRUCTIONS:
  1. IDENTIFY ANSWERS: Look specifically for options that were bold, highlighted, or indicated as correct in the original PDF source text provided below.
  2. LANGUAGE: Every question and every option MUST be bilingual (English / Hindi).
  3. FORMAT: "Question in English / हिंदी में प्रश्न"
  4. SCOPE: Maintain focus on the technical robotics curriculum: Safety, PPE, 5S, GD&T, and Robot Configurations.
  
  SOURCE CONTENT:
  ${text.substring(0, 18000)}
  `;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: {
      systemInstruction: `You are an advanced Robotic Systems Diagnostic Analyst. 
      Analyze provided OCR text where correct answers are typically highlighted or bolded.
      Extract exactly 25 questions per set.
      Output ONLY a JSON array.
      Marks: Each question is exactly 1 mark.
      Example item: 
      {
        "id": "q_id",
        "text": "What is the full form of PPE? / PPE का पूर्ण रूप क्या है?",
        "options": [
          "Professional Protection Equipment / पेशेवर सुरक्षा उपकरण",
          "Personal Protective Equipment / व्यक्तिगत सुरक्षा उपकरण",
          "Primary Protection Essentials / प्राथमिक सुरक्षा आवश्यकताएँ",
          "Public Protection Entity / सार्वजनिक सुरक्षा इकाई"
        ],
        "correctAnswerIndex": 1
      }`,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            id: { type: Type.STRING },
            text: { type: Type.STRING },
            options: { 
              type: Type.ARRAY,
              items: { type: Type.STRING },
              minItems: 4,
              maxItems: 4
            },
            correctAnswerIndex: { type: Type.NUMBER }
          },
          required: ["id", "text", "options", "correctAnswerIndex"]
        }
      }
    }
  });

  try {
    const output = response.text;
    if (!output) throw new Error("Diagnostic link failure.");
    return JSON.parse(output);
  } catch (error) {
    console.error("AI Logic Error:", error);
    throw new Error("Unable to synthesize bilingual diagnostic data blocks.");
  }
};
