import mongoose, { Schema, Types } from 'mongoose';

const answerSchema = new Schema({
  questionId: {
    type: { type: String }
  },
  answer: {
    type: String
  }
});
const Answer = mongoose.model('answers', answerSchema);
export default Answer;
