const express=require('express');
const mongoose=require('mongoose');
const bcrypt = require('bcrypt');
const jwt=require('jsonwebtoken');
const cors = require('cors');
const app=express();
const port=5000;
const Gamedate=require('./models/gameDateModel');
const ForwardPlayer = require('./models/forwardPlayerModel');
const DefensivePlayer = require('./models/defensivePlayerModel');
const Lineup = require('./models/lineupModel');
const GameLineup = require('./models/gameLineupModel');
const User = require('./models/userModel'); // Import your User model
const dotenv = require('dotenv');
dotenv.config();


  app.use(express.json());
  app.use(cors());

const uri = 'mongodb+srv://BinderAdmin:WUNnL7fL45mYMs@icehockey.zag8iyr.mongodb.net/IceHockeyDB?retryWrites=true&w=majority';

// Load the secret key from environment variables
const secretKey = process.env.JWT_SECRET;

mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected to MongoDB Atlas');
    app.listen(port, () => {
      console.log(`Example app listening on port ${port}`);
    });
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB Atlas:', error);
  });

  const verifyToken = (req, res, next) => {
    const token = req.headers.authorization && req.headers.authorization.split(' ')[1];
  
    if (!token) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
  
    jwt.verify(token, secretKey, (err, decoded) => {
      if (err) {
        return res.status(401).json({ message: 'Invalid token' });
      }
  
      // The token is valid; you can access the payload (e.g., decoded.userId)
      req.userId = decoded.userId;
      next();
    });
  };

  app.post('/registration', async (req, res) => {
    try {
      const { username, email, password } = req.body;
  
      // Check if the user already exists
    const existingUser = await User.findOne({ $or: [{ username }, { email }] });

    if (existingUser) {
      return res.status(200).json({ message: 'User already exists' });
    }
  
      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);
  
      // Create a new user
      const newUser = new User({
        username,
        email,
        password: hashedPassword,
      });
  
      // Save the user to the database
      await newUser.save();
  
      res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
      console.error('Registration error:', error);
      res.status(500).json({ error: 'Registration failed' });
    }
  });


app.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    // Find the user by username
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    // Compare the provided password with the hashed password stored in the database
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({ message: 'Incorrect password' });
    }

    // If the username and password are correct, create a JWT token
    const token = jwt.sign({ userId: user._id }, secretKey, {
      expiresIn: '1h', // Token expiration time
    });

    console.log('Token generated:', token);

    res.status(200).json({ message: 'Login successful', token, userId: user._id });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
});

app.get('/protected', verifyToken, (req, res) => {
  // Only authenticated users can access this route
  res.json({ message: 'This is a protected route', userId: req.userId });
});

//app.get('/login-status', (req, res) => {
  // Get the user's login status from the database
 // const isAuthenticated = User.findOne({ _id: req.userId }).then(
 //   user => user ? user.isAuthenticated : false
 // );

  // Return the user's login status to the client
 // res.json({ isAuthenticated });
//});
app.get('/login-status', verifyToken, (req, res) => {
  // The user is authenticated based on the token verification (verifyToken middleware)
  console.log('User ID:', req.userId);
  res.json({ isAuthenticated: true });
});

  app.get('/gamedates', (req, res) => {
    const { teamName } = req.query; 
    const query = teamName ? { teamName } : {};
    Gamedate.find(query)
      .then((dates) => {
        console.log('Game dates:', dates);
        res.json(dates);
      })
      .catch((error) => {
        console.error('Error fetching game dates:', error);
        res.status(500).json({ error: 'Failed to fetch game dates' });
      });
  });

  app.get('/forwardplayers', (req, res) => {
    const { gameDate, teamName } = req.query;
  
    // Construct the query object to filter by gameDate and teamName
    const query = {};
  
    if (gameDate) {
      query.gameDate = gameDate;
    }
  
    if (teamName) {
      query.teamName = teamName;
    }
  
    ForwardPlayer.find(query)
      .then((players) => {
        console.log('Forward players:', players);
        res.json(players);
      })
      .catch((error) => {
        console.error('Error fetching forward players:', error);
        res.status(500).json({ error: 'Failed to fetch forward players' });
      });
  });
  
  app.get('/defensiveplayers', (req, res) => {
    const { gameDate, teamName } = req.query;
  
    // Construct the query object to filter by gameDate and teamName
    const query = {};
  
    if (gameDate) {
      query.gameDate = gameDate;
    }
  
    if (teamName) {
      query.teamName = teamName;
    }
  
    DefensivePlayer.find(query)
      .then((players) => {
        console.log('Defensive players:', players);
        res.json(players);
      })
      .catch((error) => {
        console.error('Error fetching defensive players:', error);
        res.status(500).json({ error: 'Failed to fetch defensive players' });
      });
  });

  app.post('/saveSelection', verifyToken, async (req, res) => {
    try {
      const userId = req.userId; // User ID obtained from token
      console.log('User ID:', userId);
  
      console.log(req.body); // Check the received data in the server console
  
      // Include the user's ID in the lineup data
      const lineupData = {
        ...req.body,
        userId: userId,
      };
  
      const lineup = await Lineup.create(lineupData);
      console.log(lineup); // Check the saved product object in the server console
  
      res.status(200).json(lineup);
    } catch (error) {
      console.log(error.message); // Log the error message in the server console
      res.status(500).json({ message: error.message });
    }
  });
  
  

  app.get('/gamelineup', (req, res) => {
    GameLineup.find({})
      .then((lineup) => {
        console.log('Lineup:', lineup);
        res.json(lineup);
      })
      .catch((error) => {
        console.error('Error fetching lineup:', error);
        res.status(500).json({ error: 'Failed to fetch lineup' });
      });
  });




  
  

  