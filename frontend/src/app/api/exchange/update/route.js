import connectDB from '../../utils/db';
import { ExchangeRequest } from '../../utils/models';
import { verifyToken } from '../../utils/auth';
import { NextResponse } from 'next/server';

export const PUT = verifyToken(async (req, decoded) => {
  try {
    await connectDB();

    // Extract from the URL, not req.params
    const { searchParams } = new URL(req.url);
    const exchangeRequestId = searchParams.get('exchangeRequestId');
    const { status, bookId } = await req.json(); // req.body equivalent

    if (!exchangeRequestId) {
      return NextResponse.json({ message: 'Missing exchangeRequestId' }, { status: 400 });
    }

    // Update the exchange request
    const updatedExchangeRequest = await ExchangeRequest.findByIdAndUpdate(
      exchangeRequestId,
      { status },
      { new: true }
    );

    if (!updatedExchangeRequest) {
      return NextResponse.json(
        { message: 'Exchange request not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: 'Exchange request status updated successfully',
      updatedExchangeRequest,
    });
  } catch (error) {
    console.error('Error updating exchange request status:', error);
    return NextResponse.json(
      { message: 'Error updating exchange request status', error: error.message },
      { status: 500 }
    );
  }
});
