import { QdrantClient } from "@qdrant/js-client-rest";
import { cleanPayload } from "./cleanPayload";
import { getEmbeddings } from "./TextEmbedding";
import dotenv from "dotenv";
dotenv.config();

function getClient(): QdrantClient | null {
    const url = process.env.QDRANT_URL;
    const apiKey = process.env.QDRANT_API_KEY;
    
    if (!url) {
        return null;
    }
    
    return new QdrantClient({ 
        url,
        apiKey
    });
}

async function ensureCollection(client: QdrantClient) {
    try {
        const collections = await client.getCollections();
        const exists = collections.collections.some(c => c.name === "bigBrain");
        if (!exists) {
            await client.createCollection("bigBrain", {
                vectors: { size: 1024, distance: "Cosine" }
            });
            console.log("Created Qdrant collection 'bigBrain'");
        }
    } catch (error) {
        console.error("Error ensuring collection:", error);
    }
}

export const QdrantUpsertPoints = async(data: { title: string; contentId?: string, tags?: string[] }) => {
    const client = getClient();
    if (!client) {
        console.warn("Qdrant not configured, skipping upsert");
        return;
    }

    await ensureCollection(client);

    const contentId = data.contentId || "";
    const payload = cleanPayload({ title: data.title, contentId, tags: data.tags });
    
    try {
        const embeddings = await getEmbeddings(payload);
        await client.upsert("bigBrain", {
            points: [{
                id: contentId,
                payload: payload,
                vector: embeddings,
            }]
        });
    } catch (error) {
        console.error("Error upserting points:", error);
    }
}

export const QdrantSearch = async (embeddings: number[]) => {
    const client = getClient();
    if (!client) {
        console.warn("Qdrant not configured, returning empty");
        return [];
    }

    try{
        const response = await client.search("bigBrain", {
            vector: embeddings,
            limit: 3
        })
        return response.map(response => response.id)
    } catch(error){
        console.error("Error searching for points:", error);
    }
}

export const QdrantDelete = async(contentId: string) => {
    const client = getClient();
    if (!client) {
        console.warn("Qdrant not configured, skipping delete");
        return;
    }

    try{
        await client.delete("bigBrain", {
            points: [contentId]
        })
        console.log("Qdrant Deleting id: ", contentId)
        return;
    } catch (error){
        console.error("Error deleting points:", error);
    }
}