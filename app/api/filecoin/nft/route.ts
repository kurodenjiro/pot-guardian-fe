
import {
  NextResponse
} from 'next/server';
import { MongoClient } from "mongodb";


export async function GET(request: Request) {
  const url = new URL(request.url);
  const searchParams = new URLSearchParams(url.search);
  let client = new MongoClient(`mongodb+srv://${process.env.MONGODB_USER}:${process.env.MONGODB_PASSWORD}@pot-guardian.taelj9r.mongodb.net/?retryWrites=true&w=majority&appName=pot-guardian`)
  let clientPromsie = await client.connect();
  let db = clientPromsie.db()
  let col = await db.collection("transactions")
  const data = await col.find({ method: { $eq: "mint" } }).toArray()
  return NextResponse.json({data,total: data.length})
}