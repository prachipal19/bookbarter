import connectDB from '../../utils/db';
import { ExchangeRequest } from '../../utils/models';
import { verifyToken } from '../../utils/auth';
import { NextResponse } from 'next/server';

export const PUT = verifyToken(async (req, decoded) => {
  try {
    await connectDB();

    const { status } = req.body;
    const { exchangeRequestId } = req.params;

    // Update the status of the exchange request
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
      updatedExchangeRequest
    });

  } catch (error) {
    console.error('Error updating exchange request status:', error);
    return NextResponse.json(
      { message: 'Error updating exchange request status', error: error.message },
      { status: 500 }
    );
  }
});
