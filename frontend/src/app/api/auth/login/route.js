import connectDB from '../../utils/db';
import { User } from '../../utils/models';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

import { NextResponse } from 'next/server';
export async function POST(req) {
  await connectDB();

  const body = await req.json();
  const { email, password } = body;

  const user = await User.findOne({ email });

  if (!user || !(await bcrypt.compare(password, user.password))) {
    return NextResponse.json({ message: 'Invalid email or password' }, { status: 401 });
  }

  const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);

  return NextResponse.json({ token, userId: user._id });
}