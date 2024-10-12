import dbConnection from '@config/db.config';
import auth from '@routes/auth';
import users from '@routes/users';
import express from 'express';
const app = express();

dbConnection();
app.use(express.json());

// Routes
app.use('/api/auth', auth);
app.use('/api/users', users);

// Default Route
app.use('/', (req, res) => {
  res.send('Default Route');
});

const port = process.env.PORT || 3000;

app.listen(port, function () {
  console.log('Server running on localhost:' + port);
});
