import connectDB from '../../utils/db';
import { User } from '../../utils/models';


import { NextResponse } from 'next/server';


export async function GET(req, { params }) {
  await connectDB();
  const { userId } = params;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error('Error fetching user:', error);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}
