const bcrypt = require('bcrypt');

const Pool = require('pg').Pool
const pool = new Pool({
  user: 'me',
  host: 'localhost',
  database: 'api',
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
  const { first_name, last_name, email, password, slug } = request.body;
  const to_timestamp = new Date;
  const salt = await bcrypt.genSalt(10);
  const password_hash = await bcrypt.hash(password, salt);

  pool.query('INSERT INTO users (first_name, last_name, email, password, slug, created, last_updated) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id',
              [first_name, last_name, email, password_hash, slug, to_timestamp, to_timestamp],
              (error, results) => {
                if (error) throw error;

                response.status(201).send(`User added with ID: ${results.rows[0].id}`);
              }
  );
};

// TODO: Currently updates all columns with null if nothing or an empty string is entered.
const updateUser = (request, response) => {
  const id = parseInt(request.params.id);
  const { first_name, last_name, email, password, slug } = request.body;
  const to_timestamp = new Date;

  console.log("BODY COMING FROM REQ: ", request.body);

  pool.query('UPDATE users SET first_name = $1, last_name = $2, email = $3, password = $4, slug = $5, last_updated = $6 WHERE id = $7', [first_name, last_name, email, password, slug, to_timestamp, id], (error, results) => {
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

module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser
};
