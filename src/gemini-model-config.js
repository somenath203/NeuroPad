import { google } from "@ai-sdk/google";
import { streamText } from "ai";


// in .env, the key needs to be named as "GOOGLE_GENERATIVE_AI_API_KEY" in order for this to work

export const generate_text_by_google_gemini = async (messages) => {

  try {

    return streamText({
      model: google('gemini-1.5-flash'),
      messages: messages,
      temperature: 0.7
    });
    
  } catch (error) {
    
    console.log(error);
    
  }

}