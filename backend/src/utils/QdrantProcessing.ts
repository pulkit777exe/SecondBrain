import { QdrantClient } from "@qdrant/js-client-rest";
import { cleanPayload } from "./cleanPayload";
import { getEmbeddings } from "./TextEmbedding";
import { createHash } from "crypto";
import dotenv from "dotenv";
dotenv.config();

const USERS_PER_GROUP = 20;

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

function getGroupNumber(userId: string): number {
    const hash = createHash("md5").update(userId).digest("hex");
    const num = parseInt(hash.slice(0, 8), 16);
    return Math.floor(num / USERS_PER_GROUP);
}

function getCollectionName(userId: string): string {
    return `group_${getGroupNumber(userId)}`;
}

async function ensureCollection(client: QdrantClient, collectionName: string) {
    try {
        const collections = await client.getCollections();
        const exists = collections.collections.some(c => c.name === collectionName);
        if (!exists) {
            await client.createCollection(collectionName, {
                vectors: { size: 1024, distance: "Cosine" }
            });
            console.log(`Created Qdrant collection '${collectionName}'`);
        }
    } catch (error) {
        console.error("Error ensuring collection:", error);
    }
}

export const QdrantUpsertPoints = async(userId: string, data: { title: string; contentId?: string, tags?: string[] }) => {
    const client = getClient();
    if (!client) {
        console.warn("Qdrant not configured, skipping upsert");
        return;
    }

    const collectionName = getCollectionName(userId);
    await ensureCollection(client, collectionName);

    const contentId = data.contentId || "";
    const payload = cleanPayload({ title: data.title, contentId, tags: data.tags, userId });
    
    try {
        const embeddings = await getEmbeddings(payload);
        await client.upsert(collectionName, {
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

export const QdrantSearch = async (userId: string, embeddings: number[]) => {
    const client = getClient();
    if (!client) {
        console.warn("Qdrant not configured, returning empty");
        return [];
    }

    const collectionName = getCollectionName(userId);

    try{
        const response = await client.search(collectionName, {
            vector: embeddings,
            limit: 3,
            filter: {
                must: [
                    {
                        key: "userId",
                        match: { value: userId }
                    }
                ]
            }
        })
        return response.map(response => response.id)
    } catch(error){
        console.error("Error searching for points:", error);
        return [];
    }
}

export const QdrantDelete = async(userId: string, contentId: string) => {
    const client = getClient();
    if (!client) {
        console.warn("Qdrant not configured, skipping delete");
        return;
    }

    const collectionName = getCollectionName(userId);

    try{
        await client.delete(collectionName, {
            points: [contentId]
        })
        console.log(`Qdrant Deleting id: ${contentId} from ${collectionName}`)
        return;
    } catch (error){
        console.error("Error deleting points:", error);
    }
}
