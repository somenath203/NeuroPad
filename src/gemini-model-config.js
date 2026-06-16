import { google } from "@ai-sdk/google";
import { streamText } from "ai";


export const generate_text_by_google_gemini = async (messages) => {

  try {

    return streamText({
      model: google('gemini-3.1-flash-lite'),
      messages: messages,
      temperature: 0.7
    });
    
  } catch (error) {
    
    console.log(error);
    
  }

}
