const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const app = express();
const port = 4000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('Connected to MongoDB'))
  .catch(error => console.log('Error connecting to MongoDB:', error));

// Import Models
const User = require('./models/user');

// Register API
app.post('/register', async (req, res) => {
  try {
    const { name, email, password, image } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already in use' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = new User({ name, email, password: hashedPassword, image });
    await newUser.save();

    res.status(201).json({ message: 'User registered successfully!' });
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ message: 'Error registering the user' });
  }
});

// Login API
// Login API
app.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id.toString() }, // 🔹 Convert ObjectId to string
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    console.log('✅ Login Successful, Token Generated:', token);

    res.status(200).json({ token, userId: user._id.toString(), user });
  } catch (error) {
    console.error('❌ Error logging in:', error);
    res.status(500).json({ message: 'Error logging in' });
  }
});


// Get Users API (Excluding Current User)
// const mongoose = require('mongoose');

// Get Users API (Including Current User)
app.get('/users/:userId', async (req, res) => {
  try {
    const users = await User.find(); // ✅ अब यह सभी users को return करेगा
    res.json(users);
  } catch (error) {
    console.log('Error fetching users:', error);
    res.status(500).json({ message: 'Error fetching users' });
  }
});


// Send Friend Request API
app.post('/sendrequest', async (req, res) => {
    const { senderId, receiverId, message } = req.body;

    const receiver = await User.findById(receiverId);
    if (!receiver) {
      return res.status(400).json({ message: 'Receiver not found' });
    }

    receiver.requests.push({ from: senderId, message });
    await receiver.save();

    res.status(200).json({ message: 'Request sent successfully!' });
  } 
);

// Start Server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
