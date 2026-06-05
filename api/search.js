// api/search.js
import { MongoClient } from 'mongodb';

// Cache the database connection across serverless invocations
let cachedClient = null;

async function connectToDatabase() {
    if (cachedClient) {
        return cachedClient;
    }
    
    const uri = process.env.MONGO_URI;
    if (!uri) {
        throw new Error('Please define the MONGO_URI environment variable inside .env');
    }

    const client = new MongoClient(uri);
    await client.connect();
    cachedClient = client;
    return client;
}

export default async function handler(req, res) {
    // Only allow POST requests from your frontend search panel
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    try {
        const { query } = req.body;
        if (!query) {
            return res.status(400).json({ error: 'Query text is required' });
        }

        const client = await connectToDatabase();
        const db = client.db('silk_bot');
        const collection = db.collection('aotr_knowledge');

        // Performs a case-insensitive fuzzy match on the 'item_name' field
        const item = await collection.findOne({
            item_name: { $regex: new RegExp(query, 'i') }
        });

        if (!item) {
            return res.status(404).json({ message: 'Item not found in registry' });
        }

        // Return the exact fields your frontend UI component expects to ingest
        return res.status(200).json({
            item_name: item.item_name,
            image_link: item.image_link || null,
            content: item.content || 'No description available.'
        });

    } catch (error) {
        console.error('Database query error:', error);
        return res.status(500).json({ error: 'Internal Server Error', details: error.message });
    }
}
