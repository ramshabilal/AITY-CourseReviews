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

  console.log(req.query); 
  
  const { semester, year, professor } = req.query;
  const queryObject = {};
  // Check if semester, year, and professor parameters exist in the query
  if (semester) {
      queryObject.semester = semester;
  }
  if (professor) {
      const regex = new RegExp(professor, 'i');
      queryObject.professor = regex;
  }

  // Check if year parameter exists and perform a numeric partial search using regex
  if (year) {     //TO-DO: PARTIAL SEARCH FOR YEAR
    const numericYear = parseInt(year, 10); // Convert year to a number
    if (!isNaN(numericYear)) {
        queryObject.year = numericYear;
    } else {
        // Handle invalid input if year is not a number
        return res.status(400).send('Invalid year input');
    }
  }

  try{
  const reviews = await Review.find(queryObject); 
  res.render('reviews', { 'reviews': reviews });
  } catch (err) {
    console.log('Error retrieving reviews', err);
    res.status(500).send('Internal Server Error');
  }

}); 

app.get('/reviews/add', (req, res) => {
  res.render('add'); // Renders the addReview.hbs template
});

// Route handler to process form submission (POST request)
app.post('/reviews/add', async (req, res) => {
  // Extract form data from req.body
  const { courseNumber, courseName, semester, year, professor, review } = req.body;

  try {
      // Create a new review in the database using the Review model
      const numericYear = parseInt(year, 10); // Convert year to a number
      await Review.create({ courseNumber, courseName, semester, numericYear, professor, review });

      // Redirect back to the page that shows all reviews (e.g., '/')
      res.redirect('/');
  } catch (err) {
      console.error('Error adding review:', err);
      res.status(500).send('Internal Server Error');
  }
});

app.listen(process.env.PORT || 3000);  // to listen based on a configurable PORT number









//RsRRPoY9gZCVNjhi