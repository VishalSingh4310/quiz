import mongoose, { Schema, Types } from 'mongoose';

const quizSchema = new Schema({
  questionIds: [
    {
      type: String
    }
  ],
  name: {
    type: String
  },
  description: {
    type: String
  },
  instructions: {
    type: [String]
  },
  totalPoints: {
    type: Number,
    default: 0
  }
});
const Quiz = mongoose.model('quizzes', quizSchema);
export default Quiz;
