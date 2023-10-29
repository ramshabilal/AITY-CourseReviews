import './config.mjs';   // make sure this is at the top
import mongoose from 'mongoose';
import express from 'express';

const app = express();

import Review from './db.mjs';

// set up express static
import url from 'url';
import path from 'path';
const __dirname = path.dirname(url.fileURLToPath(import.meta.url));
app.use(express.static(path.join(__dirname, 'public')));

// configure templating to hbs
app.set('view engine', 'hbs');

// body parser (req.body)
app.use(express.urlencoded({ extended: false }));

app.get('/', async (req, res) => {

  const queryObject = {};

  try{
  const reviews = await Review.find(queryObject); 
  console.log(reviews);
  res.render('reviews', { 'reviews': reviews });
  } catch (err) {
    console.log('Error retrieving reviews', err);
    res.status(500).send('Internal Server Error');
  }

}); 

app.listen(process.env.PORT || 3000);  // to listen based on a configurable PORT number









//RsRRPoY9gZCVNjhi