import { comparePassword, generateToken, hashPassword } from '@helper/auth.helper';
import User from '@models/users';
import { Router } from 'express';

const router = Router();

router.post('/login', async (req, res) => {
  const { password, email } = req.body;

  try {
    const userExist = await User.findOne({ email }).lean();
    if (userExist) {
      const validPass = await comparePassword(password, userExist.password);
      if (!validPass) {
        return res.status(401).send('Email or Password is wrong');
      }
      let payload = { id: userExist._id, email: userExist.email };
      const token = generateToken(payload);
      res.status(200).send({ ...userExist, token });
    } else {
      res.status(401).json({ message: 'Invalid email' });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.post('/register', async (req, res) => {
  try {
    const hasPassword = await hashPassword(req.body.password);
    const userExists = await User.findOne({ email: req.body.email }).lean();
    if (!userExists) {
      let user = new User({
        email: req.body.email,
        name: req.body?.name || '',
        password: hasPassword
      });
      const result = await user.save();
      if (result?._id) {
        let payload = {
          id: result._id,
          email: req.body.email
        };
        const token = generateToken(payload);
        res.status(200).send({ ...result, token });
      }
    } else {
      res.status(400).json({ message: 'User already exists.' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
