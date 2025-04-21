import connectDB from '../../utils/db';
import { Listing } from '../../utils/models';
import { verifyToken } from '../../utils/auth';

export const GET = verifyToken(async (req, decoded) => {
  await connectDB();
  const userId = decoded.userId; 

  const listings = await Listing.find({ userId });

  return new Response(JSON.stringify(listings), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
});

