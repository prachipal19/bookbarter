import connectDB from '../utils/db';
import { User, ExchangeRequest } from '../utils/models';
import { verifyToken } from '../utils/auth';

export default verifyToken(async function handler(req, res) {
  await connectDB();

  const { receiverEmail, receiverId, bookId } = req.body;
  const senderId = req.user.userId;

  const sender = await User.findById(senderId);
  const exchangeRequest = new ExchangeRequest({
    senderId,
    senderEmail: sender.email,
    receiverId,
    receiverEmail,
    listingIds: sender.listings,
    bookId,
  });

  await exchangeRequest.save();
  res.status(201).json({ message: 'Exchange request sent' });
});
