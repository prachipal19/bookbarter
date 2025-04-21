import connectDB from '../../utils/db';
import { User, ExchangeRequest } from '../../utils/models';
import { verifyToken } from '../../utils/auth';

import { NextResponse } from 'next/server';


export const POST = verifyToken(async (req, user) => {
  await connectDB();

  const body = await req.json();
  const { receiverEmail, receiverId, bookId } = body;

  const senderId = user.userId;
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

  return NextResponse.json({ message: 'Exchange request sent' }, { status: 201 });
});
