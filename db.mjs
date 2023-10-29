import './config.mjs' 
import mongoose from 'mongoose'

// my schema goes here!
const reviewSchema = new mongoose.Schema({
	courseNumber: {type: String, required: true},
	courseName: {type: String, required: true},
  semester: {type: String, required: true},
  year: {type: Number, required: true},
  professor: {type: String, required: true},
  review: {type: String, required: true},
  sessionId: {type: String}
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