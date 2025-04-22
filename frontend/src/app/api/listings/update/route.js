import connectDB from '../../utils/db';
import { Listing } from '../../utils/models';
import { verifyToken } from '../../utils/auth';

import { NextRequest, NextResponse } from 'next/server';

export const PUT = verifyToken(async (req, decoded) => {
  try {
    await connectDB();

    const userId = decoded.userId;
    const { searchParams } = new URL(req.url);
    const isbn = searchParams.get('isbn');

    if (!isbn) {
      return NextResponse.json({ message: 'ISBN is required' }, { status: 400 });
    }

    const body = await req.json(); // 👈 This is the important part

    const updated = await Listing.findOneAndUpdate(
      { userId, ISBN: isbn },
      body,
      { new: true }
    );

    if (!updated) {
      return NextResponse.json({ message: 'Not found' }, { status: 404 });
    }

    return NextResponse.json(updated, { status: 200 });
  } catch (error) {
    console.error('Error updating listing:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
});
