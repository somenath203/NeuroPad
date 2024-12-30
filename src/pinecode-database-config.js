import { Pinecone } from "@pinecone-database/pinecone";


const pinecone = new Pinecone({
    apiKey: process.env.PINECONEDB_API_KEY
});


export const notesIndex = pinecone.Index('nextjsainoteapp');

