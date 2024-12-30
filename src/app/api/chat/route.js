import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

import { generate_embeddings } from "@/gemini-embedding-model-config";
import { notesIndex } from "@/pinecode-database-config";
import prismaClientConfig from '@/prismaClientConfig';
import { generate_text_by_google_gemini } from "@/gemini-model-config";


export async function POST(req) {

    try {

        const body = await req.json();

        const { userId } = await auth();


        const allMessagesBetweenUserAndBot = body?.messages;

        const lastSixMessagesBetweenUserAndBot = allMessagesBetweenUserAndBot.slice(-6);


        const lastSixMessagesBetweenUserAndBotIntoOneSingleString = lastSixMessagesBetweenUserAndBot?.map((message) => message?.content).join('\n');

        const createEmbeddingForTheLastSixMessages = await generate_embeddings(lastSixMessagesBetweenUserAndBotIntoOneSingleString);


        const getSimilarEmbeddingsFromPinecone = await notesIndex.query({
            vector: createEmbeddingForTheLastSixMessages,
            topK: 1, 
            filter: { userId } 
        });
        

        const relevantNotesFromMongoDBBasedOnTheMongodbIdComingFromPinecone = await prismaClientConfig.note.findMany({
            where: {
                id: {
                    in: getSimilarEmbeddingsFromPinecone.matches.map((match) => match.id)
                }
            }
        });


        const pineconeVectorDbResPromptMessageString = `You are an intelligent notes taking app. You answer the user's question based on their existing notes. The relevant notes for the query are: ${relevantNotesFromMongoDBBasedOnTheMongodbIdComingFromPinecone.map((note) => `title: ${note?.title}\n\n content:\n${note?.content}`).join('\n\n')}`.trim();


        const messageFormatForGoogleGeminiAPI = [
            {
                role: "system",
                content: "You are an intelligent notes-taking app. You answer the user's questions based on their existing notes.",
            },
            {
                role: "system",
                content: pineconeVectorDbResPromptMessageString, // Ensure this is properly formatted
            },
            ...lastSixMessagesBetweenUserAndBot.map((msg) => ({
                role: msg.role === "assistant" ? "assistant" : "user",
                content: msg.content,
            })),
        ];
        
        

        const stream = await generate_text_by_google_gemini(messageFormatForGoogleGeminiAPI);

        return stream?.toDataStreamResponse();
        
    
    } catch (error) {
        
        console.log(error);
        
        return NextResponse.json({
            success: false,
            message: 'Internal Server Error'
        }, { status: 500 });

    }

}