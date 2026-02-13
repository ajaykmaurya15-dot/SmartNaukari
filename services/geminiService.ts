
import { GoogleGenAI, Type } from "@google/genai";
import { AnalysisResult } from "../types";

export const analyzeResume = async (
  base64Data: string | undefined,
  textData: string | undefined,
  mimeType: string,
  mode: 'pdf' | 'image' | 'docx',
  jobDescription?: string
): Promise<AnalysisResult> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const responseSchema = {
    type: Type.OBJECT,
    properties: {
      score: { type: Type.NUMBER, description: "General resume quality score (0-100)." },
      matchScore: { type: Type.NUMBER, description: "Match percentage (0-100) if a JD was provided, otherwise 0." },
      summary: { type: Type.STRING, description: "A brief professional summary." },
      strengths: { type: Type.ARRAY, items: { type: Type.STRING } },
      weaknesses: { type: Type.ARRAY, items: { type: Type.STRING } },
      improvements: { type: Type.ARRAY, items: { type: Type.STRING } },
      skillsFound: { type: Type.ARRAY, items: { type: Type.STRING } },
      keywordGaps: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Keywords from JD missing in resume." },
      roleMatch: { type: Type.STRING, description: "The likely job title this resume is targetting." },
    },
    required: ["score", "summary", "strengths", "weaknesses", "improvements", "skillsFound"],
  };

  const promptText = `
    You are a Senior Technical Recruiter. Analyze the provided resume.
    ${jobDescription ? `COMPARE IT AGAINST THIS JOB DESCRIPTION: \n"${jobDescription}"` : 'Evaluate it based on general industry standards for professional resumes.'}
    
    CRITIQUE CRITERIA:
    1. Clarity and Formatting.
    2. Quantifiable Impact (metrics, results).
    3. Keyword optimization ${jobDescription ? 'relative to the provided JD' : ''}.
    4. Action Verbs and Professionalism.

    If a Job Description is provided, calculate the 'matchScore' based on how well the skills and experience align.
  `;

  try {
    let parts;
    // Prepare message parts based on input modality
    if (mode === 'docx' && textData) {
      parts = [{ text: promptText }, { text: `RESUME TEXT:\n${textData}` }];
    } else if (base64Data) {
      parts = [
        { text: promptText },
        { inlineData: { mimeType, data: base64Data } }
      ];
    } else {
        throw new Error("No valid data provided");
    }

    // Always use ai.models.generateContent to query GenAI with both the model name and prompt
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: { parts },
      config: {
        responseMimeType: "application/json",
        responseSchema: responseSchema,
        temperature: 0.2,
      },
    });

    if (response.text) {
      // Use the text property directly and trim whitespace as recommended
      return JSON.parse(response.text.trim()) as AnalysisResult;
    } else {
        throw new Error("Analysis failed to generate text");
    }
  } catch (error) {
    console.error("Gemini Error:", error);
    throw error;
  }
};
