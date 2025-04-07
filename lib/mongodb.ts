import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI as string;
const options = {};

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

if (!process.env.MONGODB_URI) {
	throw new Error('Please define the MONGODB_URI environment variable');
}

// For dev mode — reuse client across hot reloads
if (process.env.NODE_ENV === 'development') {
	if (!(global as any)._mongoClientPromise) {
		client = new MongoClient(uri, options);
		(global as any)._mongoClientPromise = client.connect();
	}
	clientPromise = (global as any)._mongoClientPromise;
} else {
	// In production — no global
	client = new MongoClient(uri, options);
	clientPromise = client.connect();
}

export async function connectToMongoDB() {
	const client = await clientPromise;
	const db = client.db('newsletters');
	return { db };
}
