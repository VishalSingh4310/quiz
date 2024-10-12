import mongoose, { Schema, Types } from 'mongoose';

const Options = new Schema({
  answer: {
    type: String
  }
});

const questionsSchema = new Schema({
  question: {
    type: String
  },
  options: {
    type: [Options]
  },
  points: {
    type: Number
  }
});
const Question = mongoose.model('questions', questionsSchema);
export default Question;
