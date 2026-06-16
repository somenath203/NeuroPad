import { GoogleGenerativeAI } from "@google/generative-ai";


const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_API_KEY);


const model = genAI.getGenerativeModel({ model: "gemini-embedding-2"});


export const generate_embeddings = async (string) => {

    const res = await model.embedContent(string);

    return res?.embedding?.values;
    
}

