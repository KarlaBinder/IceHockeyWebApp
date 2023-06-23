const express=require('express');
const mongoose=require('mongoose');
const cors = require('cors');
const app=express()
const port=5000;
const Product=require('./models/productModel');
const UserSelection= require('./models/selectionModel');

app.get('/', (req, res) => {
    res.send('Hello World!')
  })

  app.get('/blog', (req, res) => {
    res.send('Hello Blog!')
  })

  app.use(express.json());
  app.use(cors());

/* app.post('/product',(req,res)=>{
  console.log(req.body);
  res.send(req.body)
 })*/
/*
 app.post('/product',async(req,res)=>{
  try{
    const product=await Product.create(req.body);
    res.status(200).json(product);

  }catch(error){
    console.log(error.message);
    res.status(500).json({message:error.message})
  }
 })*/

 app.post('/trial', async (req, res) => {
  try {
    console.log(req.body); // Check the received data in the server console

    const product = await Product.create(req.body);
    console.log(product); // Check the saved product object in the server console

    res.status(200).json(product);
  } catch (error) {
    console.log(error.message); // Log the error message in the server console
    res.status(500).json({ message: error.message });
  }
});

app.post('/user-selection-ch', async (req, res) => {
  try {
    console.log(req.body); // Check the received data in the server console

    const product = await UserSelection.create(req.body);
    console.log(product); // Check the saved product object in the server console

    res.status(200).json(product);
  } catch (error) {
    console.log(error.message); // Log the error message in the server console
    res.status(500).json({ message: error.message });
  }
});

app.post('/user-selection-bb', async (req, res) => {
  try {
    console.log(req.body); // Check the received data in the server console

    const product = await UserSelection.create(req.body);
    console.log(product); // Check the saved product object in the server console

    res.status(200).json(product);
  } catch (error) {
    console.log(error.message); // Log the error message in the server console
    res.status(500).json({ message: error.message });
  }
});

app.post('/user-selection-gn', async (req, res) => {
  try {
    console.log(req.body); // Check the received data in the server console

    const product = await UserSelection.create(req.body);
    console.log(product); // Check the saved product object in the server console

    res.status(200).json(product);
  } catch (error) {
    console.log(error.message); // Log the error message in the server console
    res.status(500).json({ message: error.message });
  }
});

app.post('/user-selection-ca', async (req, res) => {
  try {
    console.log(req.body); // Check the received data in the server console

    const product = await UserSelection.create(req.body);
    console.log(product); // Check the saved product object in the server console

    res.status(200).json(product);
  } catch (error) {
    console.log(error.message); // Log the error message in the server console
    res.status(500).json({ message: error.message });
  }
});



  mongoose
  .connect('mongodb+srv://BinderAdmin:WUNnL7fL45mYMs@icehockey.zag8iyr.mongodb.net/IceHockeyDB?retryWrites=true&w=majority')
  .then (()=>{
    //zelimo da nam se app prvo spoji sa bazom prije pokretanja
    app.listen(port, () => {
      console.log(`Example app listening on port ${port}`)
    })
    console.log('connected to MongoDB')
  }).catch((error)=>{
    console.log(error)
  })



  