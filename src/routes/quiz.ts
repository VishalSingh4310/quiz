import authMiddleware from '@middleware/auth';
import Answer from '@models/answers';
import Question from '@models/questions';
import Quiz from '@models/quiz';
import { Router } from 'express';
const router = Router();

router.get('/', authMiddleware, async (req, res) => {
  try {
    const result = await Quiz.find().lean();
    res.status(200).send(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/:name', authMiddleware, async (req, res) => {
  try {
    const name = req.params.name;
    const result = await Quiz.findOne({ name });
    res.status(200).send({ ...result, questions: result.questionIds?.length });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/take-quiz/:name', authMiddleware, async (req, res) => {
  try {
    const name = req.params.name;
    const result = await Quiz.findOne({ name });
    const questions = await Question.findOne({ _id: { $in: result.questionIds } });
    res.status(200).send({ ...result, questions });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/results/:name', authMiddleware, async (req, res) => {
  try {
    const name = req.params.name;
    const { questionWithAnswer } = req.body;
    const [ans, result] = await Promise.all([
      Answer.find({
        questionId: { $in: questionWithAnswer.map((q) => q.questionId) }
      }),
      Quiz.findOne({ name })
    ]);
    if (!result) {
      return res.status(404).json({ message: 'Quiz not found' });
    }

    // Calculate total points
    const total = questionWithAnswer.reduce((acc, value) => {
      const found = ans.find((val) => val.questionId == value.questionId);
      return found && found.answer === value.answer ? acc + value.points : acc;
    }, 0);
    res.status(200).send({ score: total });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put('/', authMiddleware, async (req, res) => {
  try {
    const name = req.body.name;
    const description = req.body.description;
    const questionIds = req.body?.questionIds || [];
    const questions = await Question.find({ _id: { $in: questionIds } }).lean();
    const points = questions.reduce((curr, obj) => curr + obj.points, 0);
    const result = await Quiz.findOneAndUpdate(
      { name },
      {
        $set: { name, description },
        $push: { questionIds: [...questionIds] },
        $inc: { totalPoints: points }
      },
      { upsert: true, lean: true, new: true }
    );
    console.log('result', result);
    res.status(200).send(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put('/remove-questions/', authMiddleware, async (req, res) => {
  try {
    const { name, questionIds } = req.body;
    const questions = await Question.find({ _id: { $in: questionIds } }).lean();
    const points = questions.reduce((curr, obj) => curr + obj.points, 0);
    const result = await Quiz.findOneAndUpdate(
      { name },
      {
        $pull: { questionIds: { $in: questionIds || [] } },
        $inc: { totalPoints: -points }
      },
      { upsert: true, lean: true, new: true }
    );
    res.status(200).send(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
export default router;
