import authMiddleware from '@middleware/auth';
import Answer from '@models/answers';
import Question from '@models/questions';
import Quiz from '@models/quiz';
import { Router } from 'express';
const router = Router();

router.put('/', authMiddleware, async (req, res) => {
  try {
    const { question, options, points, answer } = req.body;
    const result = await Question.findOneAndUpdate(
      { question },
      { $set: { question, options, points } },
      { upsert: true, new: true }
    );
    await Answer.findOneAndUpdate(
      { questionId: result._id.toString() },
      { $set: { answer } },
      { upsert: true, new: true }
    );
    res.status(200).send(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
router.get('/', authMiddleware, async (req, res) => {
  try {
    const questions = await Question.find().lean();
    res.status(200).send(questions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/question-answers', authMiddleware, async (req, res) => {
  try {
    const { questionsIds } = req.body.questionIds;
    const questions = await Question.find({ _id: { $in: questionsIds } }).lean();
    res.status(200).send(questions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const id = req.params.id;
    const result = await Question.findOneAndDelete({ _id: id });
    await Answer.findOneAndDelete({ questionId: id });
    const quizExists = await Quiz.findOne({ questionIds: id });
    if (quizExists) {
      await Quiz.findOneAndUpdate(
        { questionIds: id },
        { $pull: { questionIds: id }, $inc: { totalPoints: -result.points } },
        { new: true }
      );
    }
    res.status(200).send(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
export default router;
