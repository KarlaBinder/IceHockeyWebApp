const express=require('express');
const mongoose=require('mongoose');
const cors = require('cors');
const app=express();
const port=5000;
const Gamedate=require('./models/gameDateModel');
const ForwardPlayer = require('./models/forwardPlayerModel');
const DefensivePlayer = require('./models/defensivePlayerModel');
const Lineup = require('./models/lineupModel');
const GameLineup = require('./models/gameLineupModel');

  app.use(express.json());
  app.use(cors());

const uri = 'mongodb+srv://BinderAdmin:WUNnL7fL45mYMs@icehockey.zag8iyr.mongodb.net/IceHockeyDB?retryWrites=true&w=majority';

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

  app.get('/gamedates', (req, res) => {
    const { teamName } = req.query; // Extract the teamName from the query parameters
    
    // Prepare the query to filter dates based on the team name
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
    const { gameDate } = req.query;
  
    const query = gameDate ? { gameDate } : {};
  
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
    const { gameDate } = req.query;
  
    const query = gameDate ? { gameDate } : {};
  
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

  app.post('/saveSelection', async (req, res) => {
    try {
      console.log(req.body); // Check the received data in the server console
  
      const lineup = await Lineup.create(req.body);
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


  
  

  