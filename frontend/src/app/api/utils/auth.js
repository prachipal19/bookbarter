import jwt from 'jsonwebtoken';
import { NextResponse } from 'next/server';

export const verifyToken = (handler) => async (req) => {
  const token = req.headers.get('authorization');

  if (!token) {
    return NextResponse.json({ message: 'Token required' }, { status: 401 });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded.userId) {
      return NextResponse.json({ message: 'Invalid token payload' }, { status: 401 });
    }

    return handler(req, decoded);
  } catch (err) {
    return NextResponse.json({ message: 'Invalid token' }, { status: 401 });
  }
};
