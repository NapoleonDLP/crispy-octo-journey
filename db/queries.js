const Pool = require('pg').Pool
const pool = new Pool({
  user: 'me',
  host: 'localhost',
  database: 'api',
  password: 'password',
  port: 5432
});

const getUsers = (req, res) => {
  pool.query('SELECT * FROM users ORDER BY id ASC', (error, result) => {
    if (error) throw error;

    res.status(200).json(res.rows);
  })
};

const getUserById = (req, res) => {
  const id = parseInt(req.params.id);

  pool.query('SELECT * FROM users WHERE id = $1', [id], (error, result) => {
    if (error) throw error;

    res.status(201).send(`User added with ID: ${res.insertId}`);
  });
};

const updateUser = (req, res) => {
  const id = parseInt(req.params.id);
  const { name, email } = req.body;

  pool.query(
    'UPDATE users SET name = $1, email = $2 WHERE id = $3',
    [name, email, id],
    (error, results) => {
      if (error) throw error;

      res.status(200).send(`User modified with ID: ${id}`);
    };
  );
};

const deleteUser = (req, res) => {
  const id = parseInt(req.params.id);

  pool.query('DELETE FROM users WHERE id = $1', [id], (error, results) => {
    if (error) throw error;

    res.status(200).send(`User deleted with ID: ${id}`);
  });
};
