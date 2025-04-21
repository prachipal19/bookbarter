import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  email: String,
  password: String,
  listings: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Listing' }],
});
const ListingSchema = new mongoose.Schema({
  ISBN: String,
  img: String,
  title: String,
  author: String,
  inventory: Number,
  category: String,
  isExchange: Boolean,
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
});
const BookSchema = new mongoose.Schema({
  ISBN: String,
  img: String,
  title: String,
  author: String,
  inventory: Number,
  category: String,
});
const ExchangeRequestSchema = new mongoose.Schema({
  senderId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  senderEmail: String,
  receiverId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  receiverEmail: String,
  listingIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Listing' }],
  status: { type: String, enum: ['pending', 'accepted', 'rejected'], default: 'pending' },
  bookId: { type: mongoose.Schema.Types.ObjectId, ref: 'Listing' },
});

export const User = mongoose.models.User || mongoose.model('User', UserSchema);
export const Listing = mongoose.models.Listing || mongoose.model('Listing', ListingSchema);
export const Book = mongoose.models.Book || mongoose.model('Book', BookSchema, 'Books');
export const ExchangeRequest = mongoose.models.ExchangeRequest || mongoose.model('ExchangeRequest', ExchangeRequestSchema);
