import connectDB from '../../utils/db';
import { User } from '../../utils/models';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

import { NextResponse } from 'next/server';


export async function POST(req) {
  await connectDB();

  const body = await req.json();
  const { email, password } = body;

  const existing = await User.findOne({ email });
  if (existing) {
    return NextResponse.json({ message: 'User already exists' }, { status: 400 });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = new User({ email, password: hashedPassword });
  await user.save();

  const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);

  return NextResponse.json(
    { message: 'User registered successfully', token, userId: user._id },
    { status: 201 }
  );
}
