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
const Message = require('./models/message'); // Import the Message model

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
      { userId: user._id.toString() }, // Convert ObjectId to string
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
app.get('/users/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;
    const users = await User.find({ _id: { $ne: userId } });

    res.json(users);
  } catch (error) {
    console.log('Error fetching users:', error);
    res.status(500).json({ message: 'Error fetching users' });
  }
});

// Send Friend Request API
app.post('/sendrequest', async (req, res) => {
  const { senderId, receiverId, message } = req.body;

  console.log(senderId);
  console.log(receiverId);
  console.log(message);

  const receiver = await User.findById(receiverId);
  if (!receiver) {
    return res.status(404).json({ message: 'Receiver not found' });
  }

  receiver.requests.push({ from: senderId, message });
  await receiver.save();

  res.status(200).json({ message: 'Request sent successfully' });
});

app.get('/getrequests/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;
    const user = await User.findById(userId).populate(
      'requests.from',
      'name email image'
    );

    if (user) {
      res.json(user.requests);
    } else {
      res.status(400);
      throw new Error('User not found');
    }
  } catch (error) {
    console.log('error', error);
  }
});

app.post('/acceptrequest', async (req, res) => {
  try {
    const { userId, requestId } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        $pull: { requests: { from: requestId } },
      },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: 'Request not found' });
    }

    await User.findByIdAndUpdate(userId, {
      $push: { friends: requestId },
    });

    const friendUser = await User.findByIdAndUpdate(requestId, {
      $push: { friends: userId },
    });

    if (!friendUser) {
      return res.status(404).json({ message: 'Friend not found' });
    }

    res.status(200).json({ message: 'Request accepted successfully' });
  } catch (error) {
    console.log('Error', error);
    res.status(500).json({ message: 'Server Error' });
  }
});

app.get('/user/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;

    const users = await User.findById(userId).populate(
      'friends',
      'name email image'
    );

    res.json(users.friends);
  } catch (error) {
    console.log('Error fetching user', error);
  }
});

// Start Server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

//socket io api
const http = require('http').createServer(app);

const io = require('socket.io')(http, {
  cors: {
    origin: '*',
  },
});

const userSocketMap = {};

io.on('connection', socket => {
  console.log('a user is connected', socket.id);

  const userId = socket.handshake.query.userId;

  console.log('userid', userId);

  if (userId !== 'undefined') {
    userSocketMap[userId] = socket.id;
  }

  console.log('user socket data', userSocketMap);

  socket.on('disconnect', () => {
    console.log('user disconnected', socket.id);
    delete userSocketMap[userId];
  });

  socket.on('sendMessage', ({ senderId, receiverId, message }) => {
    const receiverSocketId = userSocketMap[receiverId];

    console.log('receiver Id', receiverId);

    if (receiverSocketId) {
      io.to(receiverSocketId).emit('receiveMessage', {
        senderId,
        message,
      });
    }
  });
});

http.listen(6000, () => {
  console.log('Socket.IO running on port 6000');
});

app.post('/sendMessage', async (req, res) => {
  try {
    const { senderId, receiverId, message } = req.body;

    const newMessage = new Message({
      senderId,
      receiverId,
      message,
    });

    await newMessage.save();

    const receiverSocketId = userSocketMap[receiverId];

    if (receiverSocketId) {
      console.log('emitting recieveMessage event to the reciver', receiverId);
      io.to(receiverSocketId).emit('newMessage', newMessage);
    } else {
      console.log('Receiver socket ID not found');
    }

    res.status(201).json(newMessage);
  } catch (error) {
    console.log('ERROR', error);
  }
});

app.get('/messages', async (req, res) => {
  try {
    const { senderId, receiverId } = req.query;

    const messages = await Message.find({
      $or: [
        { senderId: senderId, receiverId: receiverId },
        { senderId: receiverId, receiverId: senderId },
      ],
    }).populate('senderId', '_id name');

    res.status(200).json(messages);
  } catch (error) {
    console.log('Error', error);
  }
});