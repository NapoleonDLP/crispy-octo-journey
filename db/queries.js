const bcrypt = require('bcrypt');
const { updateUserQuery } = require('../helpers/updateUser.js');

const Pool = require('pg').Pool
const pool = new Pool({
  user: 'naps',
  host: 'localhost',
  database: 'charles_hustle',
  password: 'password',
  port: 5432
});

const getUsers = (request, response) => {
  pool.query('SELECT * FROM users ORDER BY id ASC', (error, results) => {
    if (error) throw error;

    response.status(200).json(results.rows);
  });
};

const getUserById = (request, response) => {
  const id = parseInt(request.params.id);

  pool.query('SELECT * FROM users WHERE id = $1', [id], (error, results) => {
    if (error) throw error;

    response.status(201).json(results.rows);
  });
};

const createUser = async (request, response) => {
  let { first_name, last_name, email, password, slug } = request.body;
  const to_timestamp = new Date;
  const salt = await bcrypt.genSalt(10);
  const password_hash = await bcrypt.hash(password, salt);

  (first_name && last_name && email && password) ? null : response.status(400).send('Invalid entry');

  slug ? slug = slug : slug = null;

  pool.query(
    'INSERT INTO users (first_name, last_name, email, pass_hash, slug, created, last_updated) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id',
    [first_name, last_name, email, password_hash, slug, to_timestamp, to_timestamp],
    (error, results) => {
      if (error) throw error;

      response.status(201).send(`User added with ID: ${results.rows[0].id}`);
    }
  );
};

const updateUser = (request, response) => {
  const id = parseInt(request.params.id);
  const { first_name, last_name, email, password, slug } = request.body;

  const queryArguments = updateUserQuery(request.body, id);

  pool.query(queryArguments.query, queryArguments.entries, (error, results) => {
    if (error) throw error;

    response.status(200).send(`User modified with ID: ${id}`);
  });
};

const deleteUser = (request, response) => {
  const id = parseInt(request.params.id);

  pool.query('DELETE FROM users WHERE id = $1', [id], (error, results) => {
    if (error) throw error;

    response.status(200).send(`User deleted with ID: ${id}`);
  });
};

const updateUserPassword = async (request, response) => {
  const id = parseInt(request.params.id);
  const { email, old_password, new_password } = request.body;

  const to_timestamp = new Date;
  const salt = await bcrypt.genSalt(10);
  const new_password_hash = await bcrypt.hash(new_password, salt);

  pool.query('SELECT pass_hash FROM users WHERE id = $1', [id], (error, results) => {
    if (error) throw error;

    bcrypt.compare(old_password, results.rows[0].pass_hash, (error, result) => {
      if (error) throw error;

      if (result) {
        pool.query('UPDATE users SET pass_hash = $1, last_updated = $2 WHERE id = $3', [new_password_hash, to_timestamp, id], (error, result) => {
          if (error) throw error;

          response.status(201).json(`User password modified with ID: ${id}`);
        });
      } else {
        response.status(403).json('Passwords did not match');
      };
    });
  });
};

module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  updateUserPassword
};
