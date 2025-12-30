
import { GoogleGenAI } from "@google/genai";
import { EditorConfig } from "../types";
import { SYSTEM_PROMPT } from "../constants";

export const processPassportPhoto = async (
  base64Image: string,
  mimeType: string,
  config: EditorConfig
): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  
  const instruction = `
    ${SYSTEM_PROMPT}
    1. BACKGROUND: Remove existing background and set it to a solid ${config.bgColor} color.
    2. ATTIRE: ${config.dressType !== 'No Change' ? `Digitally replace the person's current clothing with a professional ${config.dressType} that fits naturally.` : "Keep original clothing."}
    3. FACE: ${config.enhanceFace ? "Slightly enhance facial details for high-definition clarity." : ""}
    4. SKIN: ${config.smoothSkin ? "Smooth skin textures while preserving natural features (moles, beauty marks)." : ""}
    5. LIGHTING: Adjust lighting to ${config.lightingAdjustment} quality, ensuring no harsh shadows on the face.
    OUTPUT: A single professional passport portrait with clean edges.
  `;

  const imagePart = {
    inlineData: {
      data: base64Image.split(',')[1],
      mimeType: mimeType,
    },
  };

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [{ text: instruction }, imagePart]
      },
      config: {
        imageConfig: {
          aspectRatio: "3:4"
        }
      }
    });

    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
    throw new Error("AI did not return an image.");
  } catch (error) {
    console.error("Gemini Error:", error);
    throw error;
  }
};
