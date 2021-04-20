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

const updateUser = (request, response) => {
  const id = parseInt(request.params.id);
  const { name, email } = request.body;

  pool.query('UPDATE users SET name = $1, email = $2 WHERE id = $3', [name, email, id], (error, results) => {
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
