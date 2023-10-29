import './config.mjs'; // make sure this is at the top
import express from 'express';
import session from 'express-session';

const app = express();

app.use(session({
  secret: process.env.secret, // Add a secret key for session encryption
  resave: false,
  saveUninitialized: true
}));

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

// Placed before route handlers to ensure it runs on every request.
app.use((req, res, next) => {
  // Check if session.count exists, if not, initialize it to 1
  req.session.count = req.session.count ? req.session.count + 1 : 1;

  // Make the count available to all templates using res.locals
  res.locals.count = req.session.count;

  next();
});


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
  if (year) {
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
  const sessionId = req.sessionID;
  try {
      // Create a new review in the database using the Review model
      //const numericYear = parseInt(year, 10); // Convert year to a number
      await Review.create({ courseNumber, courseName, semester, year, professor, review, sessionId});

      // Redirect back to the page that shows all reviews (e.g., '/')
      res.redirect('/');
  } catch (err) {
      console.error('Error adding review:', err);
      res.status(500).send('Internal Server Error');
  }
});

app.get('/reviews/mine', async (req, res) => {
  const sessionId = req.session.id; // Get the session ID
  try {
      const myReviews = await Review.find({ sessionId }); // Retrieve reviews for the current session
      res.render('myReviews', { 'myReviews': myReviews });
  } catch (err) {
      console.error('Error retrieving user reviews:', err);
      res.status(500).send('Internal Server Error');
  }
});


app.listen(process.env.PORT || 3000); // to listen based on a configurable PORT number









//RsRRPoY9gZCVNjhi