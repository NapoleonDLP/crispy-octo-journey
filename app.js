const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const cors = require('cors');
const db = require('./db/queries');
const port = 3001;

app.use(cors({origin: 'http://localhost:3000'}));

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

app.get('/', (request, response) => {
  response.json({
    info: 'Node.js, Express, and Postgres API'
  });
});

//User endpoints
app.get('/users', db.getUsers);
app.get('/users/:id', db.getUserById);
app.post('/users', db.createUser);
app.put('/users/:id', db.updateUser);
app.delete('/users/:id', db.deleteUser);
app.put('/settings/password/:id', db.updateUserPassword);

app.listen(port, function () {
  console.log(`Express server listening on port ${port}`);
});
