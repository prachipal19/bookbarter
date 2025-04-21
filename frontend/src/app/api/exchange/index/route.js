import connectDB from '../../utils/db';
import { ExchangeRequest } from '../../utils/models';
import { verifyToken } from '../../utils/auth';
import { NextResponse } from 'next/server';
export const GET = verifyToken(async (req, decoded) => {
  try {
    await connectDB();

    // Use the decoded token to access userId
    const userId = decoded.userId;

    const incoming = await ExchangeRequest.find({ receiverId: userId }).populate('listingIds').populate('bookId');
    const outgoing = await ExchangeRequest.find({ senderId: userId }).populate('listingIds').populate('bookId');

    return NextResponse.json({ incomingRequests: incoming, outgoingRequests: outgoing });
  } catch (error) {
    console.error('Error fetching exchange requests:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
});
