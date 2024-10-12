import mongoose, { Schema, Types } from 'mongoose';

const answerSchema = new Schema({
  questionId: {
    type: { type: Types.ObjectId, ref: 'questions' }
  },
  answer: {
    type: String
  }
});
const Answer = mongoose.model('answers', answerSchema);
export default Answer;
