// app/api/books/route.js
import connectDB from '../utils/db';
import { Book } from '../utils/models';

export async function GET(request) {
  await connectDB();
  const books = await Book.find();
  return new Response(JSON.stringify(books), {
    headers: { 'Content-Type': 'application/json' },
  });
}
