import authMiddleware from '@middleware/auth';
import Answer from '@models/answers';
import Question from '@models/questions';
import Quiz from '@models/quiz';
import { Router } from 'express';
const router = Router();

router.get('/', authMiddleware, async (req, res) => {
  try {
    const result = await Quiz.find().lean();
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const id = req.params.id;
    const result = await Quiz.findOne({ _id: id }).lean();
    res.status(200).json({ ...result, questions: result.questionIds?.length });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/take-quiz/:id', authMiddleware, async (req, res) => {
  try {
    const id = req.params.id;
    const result = await Quiz.findOne({ _id: id }).lean();
    const questions = await Question.find({ _id: { $in: result.questionIds } }).lean();
    res.status(200).json({ ...result, questions });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/results/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const { questionWithAnswer } = req.body;
    const questionIds = questionWithAnswer.map((q) => q.questionId);
    const [ans, result] = await Promise.all([
      Answer.find({
        questionId: { $in: questionIds }
      }).lean(),
      Quiz.findOne({ _id: id }).lean()
    ]);
    if (!result) {
      return res.status(404).json({ message: 'Quiz not found' });
    }

    const total = questionWithAnswer.reduce(async (accPromise, value) => {
      const acc = await accPromise;
      const found = ans.find((val) => val.questionId == value.questionId);
      const foundQuestion = await Question.findOne({ _id: value.questionId }).lean();
      return found && found.answer === value.answer
        ? acc + (foundQuestion?.points || 0)
        : acc;
    }, Promise.resolve(0));

    const score = await total;
    res.status(200).send({ score });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put('/', authMiddleware, async (req, res) => {
  try {
    const name = req.body.name;
    const description = req.body?.description;
    const instructions = req.body?.instructions || [];
    const questionIds = req.body?.questionIds || [];
    const questions = await Question.find({ _id: { $in: questionIds } }).lean();
    const points = questions.reduce((curr, obj) => curr + obj.points, 0);
    const result = await Quiz.findOneAndUpdate(
      { name },
      {
        $set: {
          name,
          ...(description && { description }),
          ...(instructions?.length && { instructions })
        },
        $push: { questionIds: [...questionIds] },
        $inc: { totalPoints: points }
      },
      { upsert: true, lean: true, new: true }
    );
    res.status(200).json(result);
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
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
export default router;
