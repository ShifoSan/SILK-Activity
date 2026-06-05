// api/search.js
import { MongoClient } from 'mongodb';

let cachedClient = null;

async function connectToDatabase() {
    if (cachedClient) return cachedClient;
    const uri = process.env.MONGO_URI;
    const client = new MongoClient(uri);
    await client.connect();
    cachedClient = client;
    return client;
}

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    try {
        const { query } = req.body;
        if (!query) return res.status(400).json({ error: 'Query text is required' });

        const geminiApiKey = process.env.GEMINI_API_KEY;
        
        // 1. Generate Vector Embedding using the exact gemini-embedding-2 model
        const aiResponse = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-embedding-2:embedContent?key=${geminiApiKey}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                // Per the docs: task_type is unsupported, so we include the task instruction directly in the text
                content: { parts: [{ text: `Find information about the item: ${query}` }] },
                // Explicitly requesting 3072 to match your database schema
                outputDimensionality: 3072
            })
        });
        
        const aiData = await aiResponse.json();
        
        if (!aiData.embedding || !aiData.embedding.values) {
            console.error("Gemini API Error:", aiData);
            return res.status(500).json({ error: 'Failed to generate embedding' });
        }
        
        const queryVector = aiData.embedding.values;

        // 2. Connect to MongoDB and run Vector Search
        const client = await connectToDatabase();
        const collection = client.db('silk_bot').collection('aotr_knowledge');

        const pipeline = [
            {
                "$vectorSearch": {
                    "index": "vector_index", // IMPORTANT: Must match your exact Atlas Search Index name
                    "path": "embedding",
                    "queryVector": queryVector,
                    "numCandidates": 20,
                    "limit": 1
                }
            }
        ];

        const results = await collection.aggregate(pipeline).toArray();

        // 3. Return the payload to the frontend
        if (results.length === 0) {
            return res.status(404).json({ message: 'Item not found in registry' });
        }

        const item = results[0];
        return res.status(200).json({
            item_name: item.item_name,
            image_link: item.image_link || null,
            content: item.content || 'No description available.'
        });

    } catch (error) {
        console.error('Vector query error:', error);
        return res.status(500).json({ error: 'Internal Server Error', details: error.message });
    }
}
