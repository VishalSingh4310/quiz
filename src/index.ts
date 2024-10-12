import dbConnection from '@config/db.config';
import auth from '@routes/auth';
import quiz from '@routes/quiz';
import users from '@routes/users';
import question from '@routes/questions';
import express from 'express';
import cors from 'cors';
const app = express();

dbConnection();
app.use(express.json());
app.use(
  cors({
    origin: 'http://localhost:3000',
    credentials: true
  })
);

// Routes
app.use('/api/auth', auth);
app.use('/api/users', users);
app.use('/api/quiz', quiz);
app.use('/api/question', question);

// Default Route
app.use('/', (req, res) => {
  res.send('Default Route');
});

const port = process.env.PORT || 3001;

app.listen(port, function () {
  console.log('Server running on localhost:' + port);
});
