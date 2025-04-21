import connectDB from '../../utils/db';
import { Listing } from '../../utils/models';

export async function GET(request) {
  await connectDB();
  const listings = await Listing.find();
  return Response.json(listings);
}
