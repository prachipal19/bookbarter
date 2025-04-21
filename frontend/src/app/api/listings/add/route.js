import connectDB from '../../utils/db';
import { Listing, User } from '../../utils/models'; // Import User model
import { verifyToken } from '../../utils/auth';
import { NextResponse } from 'next/server';

export const POST = verifyToken(async (req, decoded) => {
  try {
    await connectDB();

    const userId = decoded.userId;
    const body = await req.json(); // In App Router, req.json() parses the request body

    const { ISBN, img, title, author, inventory, category, isExchange } = body;

    // Step 1: Create the listing
    const listing = new Listing({
      ISBN,
      img,
      title,
      author,
      inventory,
      category,
      isExchange,
      userId,
    });

    // Save the listing in the listings collection
    await listing.save();

    // Step 2: Find the user and update the listings array
    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Add the new listing's ObjectId to the user's listings array
    user.listings.push(listing._id);

    // Save the updated user document
    await user.save();

    return NextResponse.json({ message: 'Listing added successfully to both collections' }, { status: 201 });
  } catch (error) {
    console.error('Error adding listing:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
});
