import './config.mjs' 
import mongoose from 'mongoose'

// my schema goes here!
const reviewSchema = new mongoose.Schema({
	courseNumber: String,
	courseName: String,
  semester: String,
  year: Number,
  professor: String,
  review: String
});

const Review = mongoose.model('Review', reviewSchema);
// "register" it so that mongoose knows about it

console.log(process.env.DSN)
mongoose.connect(process.env.DSN);

/* .then(() => {
      console.log('Connected to MongoDB');
    })
    .catch((error) => {
      console.error('Error connecting to MongoDB', error);
    }) */

export default Review;