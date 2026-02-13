import { GoogleGenAI, Type } from "@google/genai";
import { AnalysisResult } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const analyzeResume = async (
  base64Data: string | undefined,
  textData: string | undefined,
  mimeType: string,
  mode: 'pdf' | 'image' | 'docx'
): Promise<AnalysisResult> => {
  
  // Define the structured output schema
  const responseSchema = {
    type: Type.OBJECT,
    properties: {
      score: { type: Type.NUMBER, description: "A score from 0 to 100 representing the quality of the resume." },
      summary: { type: Type.STRING, description: "A brief professional summary of the resume's content." },
      strengths: { 
        type: Type.ARRAY, 
        items: { type: Type.STRING },
        description: "List of 3-5 strong points about the resume." 
      },
      weaknesses: { 
        type: Type.ARRAY, 
        items: { type: Type.STRING },
        description: "List of 3-5 weak points or missing elements." 
      },
      improvements: { 
        type: Type.ARRAY, 
        items: { type: Type.STRING },
        description: "Specific actionable advice to improve the resume." 
      },
      skillsFound: { 
        type: Type.ARRAY, 
        items: { type: Type.STRING },
        description: "Key technical and soft skills identified in the document." 
      },
    },
    required: ["score", "summary", "strengths", "weaknesses", "improvements", "skillsFound"],
  };

  // Using gemini-3-flash-preview as per the latest guidelines for reliable text and multimodal tasks.
  // Previous model IDs (gemini-2.0-flash-exp) were causing 404 errors.
  const modelId = 'gemini-3-flash-preview'; 

  const promptText = `
    You are a world-class Senior Technical Recruiter and Resume Expert. 
    Analyze the attached resume. 
    Critique it based on formatting, clarity, impact, use of action verbs, quantification of results, and overall professionalism.
    Be strict but constructive. 
    If the input is text-only, judge based on content structure and clarity.
    
    IMPORTANT: Provide specific, actionable feedback that the candidate can use to improve their resume immediately.
  `;

  try {
    let contents;

    if (mode === 'docx' && textData) {
      // For DOCX, we send extracted text
      contents = [
        { role: 'user', parts: [{ text: promptText }, { text: `RESUME TEXT CONTENT:\n\n${textData}` }] }
      ];
    } else if (base64Data) {
      // For PDF and Images, we send base64 inline data
      contents = [
        {
          role: 'user',
          parts: [
            { text: promptText },
            {
              inlineData: {
                mimeType: mimeType,
                data: base64Data
              }
            }
          ]
        }
      ];
    } else {
        throw new Error("No valid data provided for analysis");
    }

    const response = await ai.models.generateContent({
      model: modelId,
      contents: contents,
      config: {
        responseMimeType: "application/json",
        responseSchema: responseSchema,
        temperature: 0.2,
      },
    });

    if (response.text) {
      return JSON.parse(response.text) as AnalysisResult;
    } else {
        throw new Error("Empty response from Gemini");
    }

  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    throw error;
  }
};