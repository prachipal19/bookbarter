/*
   CRUD API Endpoints for Listings, Users, and Books
*/

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');
require('dotenv').config(); // Load environment variables

const app = express();
app.use(bodyParser.json());
app.use(cors()); // Enable CORS for all routes
app.use(bodyParser.json());



// Connect to MongoDB Atlas
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log('Connected to MongoDB'))
.catch(error => console.error('Error connecting to MongoDB: ', error));

// Define User model
const User = mongoose.model('User', {
  email: String,
  password: String,
  listings: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Listing' }] // Array of listing references
});

// Define Listing model
const Listing = mongoose.model('Listing', {
  ISBN: String,
  img: String,
  title: String,
  author: String,
  inventory: Number,
  category: String,
  isExchange: Boolean,
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' } // Reference to the user who created the listing
});

// Define Book model
const Book = mongoose.model('Book', {
    _id: { type: mongoose.Schema.Types.ObjectId }, 
    ISBN: String,
    img: String,
    title: String,
    author: String,
    inventory: Number,
    category: String
}, 'Books');

// Define ExchangeRequest model
const ExchangeRequestSchema = mongoose.Schema({
  senderId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, 
  senderEmail: String,
  receiverId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  receiverEmail: String,
  listingIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Listing' }],
  status: { type: String, enum: ['pending', 'accepted', 'rejected'], default: 'pending' },
  bookId: { type: mongoose.Schema.Types.ObjectId, ref: 'Listing' } 
});

const ExchangeRequest = mongoose.model('ExchangeRequest', ExchangeRequestSchema);


// Middleware for verifying JWT token
const verifyToken = (req, res, next) => {
  const token = req.headers['authorization'];
  if (!token) return res.status(401).json({ message: 'Access denied. Token is required.' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(400).json({ message: 'Invalid token.' });
  }
};

// Login endpoint
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (!user) {
    return res.status(401).json({ message: 'Invalid email or password' });
  } 

  const isValidPassword = await bcrypt.compare(password, user.password);
  if (!isValidPassword) {
    return res.status(401).json({ message: 'Invalid email or password' });
  }

  const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET); // Use environment variable for JWT secret
  res.json({ token, userId: user._id }); // Send back user ID along with the token
});

// Register endpoint
app.post('/api/register', async (req, res) => {
  const { email, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const user = new User({ email, password: hashedPassword });
    await user.save();
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);
    res.status(201).json({ message: 'User registered successfully', token, userId: user._id });
  } catch (error) {
    res.status(500).json({ message: 'Error registering user' });
  }
});

// Add listing endpoint (protected)
app.post('/api/add-listing', verifyToken, async (req, res) => {
  try {
    const {ISBN,
      img,
      title,
      author,
      inventory,
      category,
      isExchange} = req.body;
    console.log( ISBN,
      img,
      title,
      author,
      inventory,
      category,
      isExchange)
    const userId = req.user.userId;

    // Create the listing
    const listing = new Listing({ ISBN,
      img,
      title,
      author,
      inventory,
      category,
      isExchange, userId });
    await listing.save();

    // Add the listing to the user's listings array
    const user = await User.findById(userId);
    user.listings.push(listing);
    await user.save();

    res.status(201).json({ message: 'Listing added successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error adding listing' });
  }
});

// Fetch all listings endpoint
app.get('/api/all-listings', async (req, res) => {
  try {
    const listings = await Listing.find(); // Fetch all listings
    res.json(listings);
  } catch (error) {
    console.error('Error fetching listings:', error);
    res.status(500).json({ message: 'Error fetching listings', error: error.message }); // Send the actual error message
  }
});

//prachi
// Fetch user details by ID endpoint
app.get('/api/user/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    console.error('Error fetching user details:', error);
    res.status(500).json({ message: 'Error fetching user details', error: error.message });
  }
});




// Get all books
app.get('/api/books', async (req, res) => {
  try {
    const books = await Book.find();
    res.json(books);
  } catch (error) {
    console.error('Error fetching books:', error);
    res.status(500).json({ message: 'Error fetching books' });
  }
});


//USERRRRRRRRRRRRRRr
app.get('/api/user-listings', verifyToken, async (req, res) => {
  try {
    const userId = req.user.userId; // Extract user ID from decoded token
    const listings = await Listing.find({ userId });
    res.json(listings);
  } catch (error) {
    console.error('Error fetching user listings:', error);
    res.status(500).json({ message: 'Error fetching user listings', error: error.message });
  }
});
// Update user's listing by ISBN
app.put('/api/update-user-listing/:isbn', verifyToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    const { isbn } = req.params;
    const updateData = req.body; // Data to update
    const updatedListing = await Listing.findOneAndUpdate({ userId, ISBN: isbn }, updateData, { new: true });
    if (!updatedListing) {
      return res.status(404).json({ message: 'Listing not found' });
    }
    res.json(updatedListing);
  } catch (error) {
    console.error('Error updating user listing:', error);
    res.status(500).json({ message: 'Error updating user listing', error: error.message });
  }
});
// Delete user's listing by ISBN
app.delete('/api/delete-user-listing/:isbn', verifyToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    const { isbn } = req.params;
    const deletedListing = await Listing.findOneAndDelete({ userId, ISBN: isbn });
    if (!deletedListing) {
      return res.status(404).json({ message: 'Listing not found' });
    }
    res.json({ message: 'Listing deleted successfully' });
  } catch (error) {
    console.error('Error deleting user listing:', error);
    res.status(500).json({ message: 'Error deleting user listing', error: error.message });
  }
});


//Prachi

// Endpoint for sending exchange requests
app.post('/api/send-exchange-request', verifyToken, async (req, res) => {
  try {
    console.log('Received request to send exchange request');
    
    const { receiverEmail, receiverId, bookId } = req.body;

    const senderId = req.user.userId; // Extract senderId from decoded token
    
    // Fetch sender details to get senderEmail and listingIds
    const sender = await User.findById(senderId);
    const senderEmail = sender.email;
    const listingIds = sender.listings;
    
    // Create a new ExchangeRequest document with status set to 'pending'
    const exchangeRequest = new ExchangeRequest({
      receiverEmail,
      receiverId,
      senderId,
      senderEmail,
      listingIds,
      bookId,
      status: 'pending'
    });
    
    await exchangeRequest.save();
    console.log('Exchange request saved successfully',bookId);
    
    // Respond with success message
    res.status(201).json({ message: 'Exchange request sent successfully' });
  } catch (error) {
    console.error('Error sending exchange request:', error);
    res.status(500).json({ message: 'Error sending exchange request', error: error.message });
  }
});

// Fetch exchange requests for a user's listings
app.get('/api/exchange-requests', verifyToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    const incomingRequests = await ExchangeRequest.find({ receiverId: userId }).populate({
      path: 'listingIds',
      model: 'Listing'
    }).populate('bookId'); // Populate the bookId field
   
    const outgoingRequests = await ExchangeRequest.find({ senderId: userId }).populate({
      path: 'listingIds',
      model: 'Listing'
    }).populate('bookId'); // Populate the bookId field
    
    res.json({ incomingRequests, outgoingRequests });
  } catch (error) {
    console.error('Error fetching exchange requests:', error);
    res.status(500).json({ message: 'Error fetching exchange requests', error: error.message });
  }
});



// Endpoint for updating the status of an exchange request
app.put('/api/update-exchange-request/:exchangeRequestId', verifyToken, async (req, res) => {
  try {
    const { status } = req.body;
    const { exchangeRequestId } = req.params;
    
    // Update the status of the exchange request
    await ExchangeRequest.findByIdAndUpdate(exchangeRequestId, { status }, { new: true });
    
    res.status(200).json({ message: 'Exchange request status updated successfully' });
  } catch (error) {
    console.error('Error updating exchange request status:', error);
    res.status(500).json({ message: 'Error updating exchange request status', error: error.message });
  }
});





const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
  