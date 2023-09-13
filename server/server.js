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
const User = require('./models/userModel'); 
const dotenv = require('dotenv');
dotenv.config();


  app.use(express.json());
  app.use(cors());

const uri = 'mongodb+srv://BinderAdmin:WUNnL7fL45mYMs@icehockey.zag8iyr.mongodb.net/IceHockeyDB?retryWrites=true&w=majority';

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
      req.userId = decoded.userId;
      console.log('Token verification successful. User ID:', req.userId);
      next();
    });
  };
  

  app.post('/registration', async (req, res) => {
    try {
      const { username, email, password } = req.body;

    const existingUser = await User.findOne({ $or: [{ username }, { email }] });

    if (existingUser) {
      return res.status(200).json({ message: 'User already exists' });
    }
      const hashedPassword = await bcrypt.hash(password, 10);
  
      const newUser = new User({
        username,
        email,
        password: hashedPassword,
      });
  
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
  
      const user = await User.findOne({ username });
  
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      const passwordMatch = await bcrypt.compare(password, user.password);
  
      if (!passwordMatch) {
        return res.status(401).json({ message: 'Incorrect password' });
      }
  
      const token = jwt.sign({ userId: user._id }, secretKey, {
        expiresIn: '1h', 
      });
  
      res.status(200).json({ message: 'Login successful', userId: user._id, token });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ error: 'Login failed' });
    }
  });
  

app.get('/getUsername', async (req, res) => {
  const userId = req.query.userId; 

  try {
    const user = await User.findOne({ _id: userId });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ username: user.username });
  } catch (error) {
    console.error('Error fetching username:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

  app.get('/gamedates', (req, res) => {
    const { teamName } = req.query; 
    const query = teamName ? { teamName } : {};
    Gamedate.find(query)
      .then((dates) => {
        res.json(dates);
      })
      .catch((error) => {
        console.error('Error fetching game dates:', error);
        res.status(500).json({ error: 'Failed to fetch game dates' });
      });
  });

  app.get('/forwardplayers', (req, res) => {
    const { gameDate, teamName } = req.query;
  
    const query = {};
  
    if (gameDate) {
      query.gameDate = gameDate;
    }
  
    if (teamName) {
      query.teamName = teamName;
    }
  
    ForwardPlayer.find(query)
      .then((players) => {
        res.json(players);
      })
      .catch((error) => {
        console.error('Error fetching forward players:', error);
        res.status(500).json({ error: 'Failed to fetch forward players' });
      });
  });
  
  app.get('/defensiveplayers', (req, res) => {
    const { gameDate, teamName } = req.query;
  
    const query = {};
  
    if (gameDate) {
      query.gameDate = gameDate;
    }
  
    if (teamName) {
      query.teamName = teamName;
    }
  
    DefensivePlayer.find(query)
      .then((players) => {
        res.json(players);
      })
      .catch((error) => {
        console.error('Error fetching defensive players:', error);
        res.status(500).json({ error: 'Failed to fetch defensive players' });
      });
  });

  
  app.post('/saveSelection', verifyToken, async (req, res) => {
    try {
      const userId = req.userId; 
      console.log('User ID:', userId);
  
      console.log(req.body); 
  
      const lineupData = {
        ...req.body,
        userId: userId,
      };
  
      const lineup = await Lineup.create(lineupData);
      console.log(lineup); 
  
      res.status(200).json(lineup);
    } catch (error) {
      console.log(error.message); 
      res.status(500).json({ message: error.message });
    }
  });

  app.get('/gamelineup', (req, res) => {
    const { gameDate, teamName } = req.query;
  
    const query = {
      gameDate: gameDate,
      teamName: teamName,
    };
  
    GameLineup.find(query)
      .then((lineup) => {
        res.json(lineup);
      })
      .catch((error) => {
        console.error('Error fetching lineup:', error);
        res.status(500).json({ error: 'Failed to fetch lineup' });
      });
  });
  
app.get('/getPreviousLineups', verifyToken, async (req, res) => {
  try {
    const userId = req.userId; 
    const previousLineups = await Lineup.find({ userId });
    res.status(200).json(previousLineups);
  } catch (error) {
    console.error('Error fetching previous lineups:', error.message);
    res.status(500).json({ message: 'Error fetching previous lineups' });
  }
});






  
  

  