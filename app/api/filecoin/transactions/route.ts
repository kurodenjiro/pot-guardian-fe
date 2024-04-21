
import {
  NextResponse
} from 'next/server';
import { MongoClient } from "mongodb";

export async function POST(request: any) {
  try {
    const newHeaders = new Headers(request.headers)
    newHeaders.set('x-version', '123')
    const data = await request.json()
    let client = new MongoClient(`mongodb+srv://${process.env.MONGODB_USER}:${process.env.MONGODB_PASSWORD}@pot-guardian.taelj9r.mongodb.net/?retryWrites=true&w=majority&appName=pot-guardian`)
    let clientPromsie = await client.connect();
    let db = clientPromsie.db()
    let col = await db.collection("transactions")
    await col.insertOne(data)
    return NextResponse.json({ status: "success" }, {
      status: 200,
      headers: {
        'content-type': 'application/json',
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error },
      {
        status: 400,
        headers: {
          'content-type': 'application/json',
        },
      },
    );
  }

}
export async function GET(request: Request) {
  const url = new URL(request.url);
  const searchParams = new URLSearchParams(url.search);
  const address = searchParams.get("address");

  let client = new MongoClient(`mongodb+srv://${process.env.MONGODB_USER}:${process.env.MONGODB_PASSWORD}@pot-guardian.taelj9r.mongodb.net/?retryWrites=true&w=majority&appName=pot-guardian`)
  let clientPromsie = await client.connect();
  let db = clientPromsie.db()
  let col = await db.collection("transactions")
  const data = await col.find({ address: { $eq: address } }).toArray()
  return NextResponse.json({data,total: data.length})
}