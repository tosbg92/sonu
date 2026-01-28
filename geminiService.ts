
import { Question } from "./types";

/**
 * Simulates the generation of a quiz from text for offline use.
 * Instead of calling the Gemini API, this function returns a predefined
 * set of mock questions, allowing the app to function without an API key
 * or internet connection.
 * @param text The source text (from PDF or raw text), which is ignored in this mock version.
 * @param title The title for the new quiz set, used to make mock questions feel dynamic.
 * @param count The number of questions to generate.
 * @returns A promise that resolves to an array of mock Question objects.
 */
export const generateQuizFromText = async (text: string, title: string, count: number = 10): Promise<Question[]> => {
  console.log(`[OFFLINE MODE] Simulating quiz generation for: "${title}"`);

  // Create a set of generic, bilingual mock questions.
  const mockQuestions: Question[] = Array.from({ length: count }, (_, i) => ({
    id: `mock-q-${Date.now()}-${i}`,
    text: `Mock Question ${i + 1} for "${title}" / "${title}" के लिए मॉक प्रश्न ${i + 1}`,
    options: [
      `Sample Answer A / नमूना उत्तर ए`,
      `Sample Answer B / नमूना उत्तर बी`,
      `Correct Mock Answer / सही मॉक उत्तर`,
      `Sample Answer D / नमूना उत्तर डी`
    ],
    // Let's make the 3rd option (index 2) always correct for this mock.
    correctAnswerIndex: 2 
  }));
  
  // Simulate a brief delay to make the UX feel more natural, as if processing is happening.
  await new Promise(resolve => setTimeout(resolve, 1500));

  return mockQuestions;
};
