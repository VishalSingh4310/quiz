import authMiddleware from '@middleware/auth';
import User from '@models/users';
import { Router } from 'express';
const router = Router();

router.get('/:email', authMiddleware, async (req, res) => {
  try {
    const email = req.params.email;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (error) {
    console.error('Error fetching user by email:', error);
    res.status(500).json({ message: error.message });
  }
});

export default router;
