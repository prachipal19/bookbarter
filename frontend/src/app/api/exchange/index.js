import connectDB from '../utils/db';
import { ExchangeRequest } from '../utils/models';
import { verifyToken } from '../utils/auth';

export default verifyToken(async function handler(req, res) {
  await connectDB();

  const userId = req.user.userId;

  const incoming = await ExchangeRequest.find({ receiverId: userId }).populate('listingIds').populate('bookId');
  const outgoing = await ExchangeRequest.find({ senderId: userId }).populate('listingIds').populate('bookId');

  res.json({ incomingRequests: incoming, outgoingRequests: outgoing });
});
