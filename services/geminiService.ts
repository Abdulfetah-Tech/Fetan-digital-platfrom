import { GoogleGenAI, Chat, Type } from "@google/genai";

const getClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    console.warn("API_KEY not found in environment variables");
    return null;
  }
  return new GoogleGenAI({ apiKey });
};

export const initializeChatSession = (): Chat | null => {
  const ai = getClient();
  if (!ai) return null;

  return ai.chats.create({
    model: 'gemini-3-pro-preview',
    config: {
      responseMimeType: 'application/json',
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          text: {
            type: Type.STRING,
            description: "Your conversational response to the user. Use natural language, markdown formatting is allowed."
          },
          suggestion: {
            type: Type.STRING,
            description: "The service category best matching the user's problem. STRICTLY use one of these exact values: 'Plumbing', 'Electrical', 'Painting', 'Carpentry', 'Cleaning', 'Installation'. If no specific service matches or it's just chit-chat, return null.",
            nullable: true
          }
        },
        required: ["text"]
      },
      systemInstruction: `You are Fetan's friendly and knowledgeable Home Renovation Consultant. Your name is Fetan AI.
      Your personality is warm, witty, and encouraging. You speak naturally, avoiding overly robotic phrasing or starting every sentence with "As an AI".
      
      Your primary goal is to guide homeowners through their maintenance issues, acting as a bridge to the professional experts on the Fetan platform.
      
      Guidelines for your responses:
      1.  **Be Conversational:** Use natural greetings, emojis, and transitions. Validate the user's situation (e.g., "Oh no, a leak is never fun! 💧").
      2.  **Diagnose First:** If the user's description is vague, ask a clarifying question before giving advice.
      3.  **Safety First:** When suggesting DIY fixes, always emphasize safety. If a task is dangerous (like major electrical work), strongly advise against DIY.
      4.  **Recommend Experts:** Clearly identify the professional category needed for the job.
      5.  **Service Suggestion:** If the user's problem maps to a specific service category (Plumbing, Electrical, Painting, Carpentry, Cleaning, Installation), you MUST include it in the 'suggestion' field of your JSON response. Use Title Case.

      Keep responses concise but not curt. Use formatting (bullet points, bold text) to make advice easy to read.`,
    }
  });
};
