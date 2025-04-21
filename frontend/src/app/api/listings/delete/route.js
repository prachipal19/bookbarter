import connectDB from '../../utils/db';
import { Listing } from '../../utils/models';
import { verifyToken } from '../../utils/auth';

import { NextRequest, NextResponse } from 'next/server';

export const DELETE = verifyToken(async (req, decoded) => {
  try {
    await connectDB();

    const userId = decoded.userId;
    const { searchParams } = new URL(req.url);
    const isbn = searchParams.get('isbn');

    if (!isbn) {
      return NextResponse.json({ message: 'ISBN is required' }, { status: 400 });
    }

    const deleted = await Listing.findOneAndDelete({ userId, ISBN: isbn });

    if (!deleted) {
      return NextResponse.json({ message: 'Not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Deleted' }, { status: 200 });
  } catch (error) {
    console.error('Error deleting listing:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
});
