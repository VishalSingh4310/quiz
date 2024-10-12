import dbConnection from '@config/db.config';
import auth from '@routes/auth';
import quiz from '@routes/quiz';
import users from '@routes/users';
import question from '@routes/questions';
import express from 'express';
const app = express();

dbConnection();
app.use(express.json());

// Routes
app.use('/api/auth', auth);
app.use('/api/users', users);
app.use('/api/quiz', quiz);
app.use('/api/question', question);

// Default Route
app.use('/', (req, res) => {
  res.send('Default Route');
});

const port = process.env.PORT || 3000;

app.listen(port, function () {
  console.log('Server running on localhost:' + port);
});
