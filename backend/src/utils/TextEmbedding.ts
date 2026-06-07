import { CohereClient } from "cohere-ai";
import { CleanedPayload } from "./cleanPayload";
import dotenv from "dotenv";
dotenv.config();

const cohere = new CohereClient({
    token: process.env.COHERE_API_KEY
})

type InputType = 'search_document' | 'search_query';

export const getEmbeddings = async (data: CleanedPayload | string, inputType: InputType = 'search_document'): Promise<number[]> => {
    let stagedData: string;

    if (typeof data === "string") {
        stagedData = data.trim();
    } else {
        stagedData = (data.title + " " + data.tagTitles.join(" ")).trim();
    }

    if (!stagedData) {
        throw new Error("Staged data is empty, cannot generate embeddings");
    }

    try {
        const embed = await cohere.v2.embed({
            model: 'embed-english-v3.0',
            inputType,
            embeddingTypes: ['float'],
            texts: [stagedData]
        });
        const vector = embed.embeddings.float![0];
        return vector;
    } catch (err) {
        console.error("Error in generating embeddings: "+err);
        throw new Error("Error in embeddings: "+ err);
    }
}