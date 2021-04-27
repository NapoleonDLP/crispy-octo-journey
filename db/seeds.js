const bcrypt = require('bcrypt');
const faker = require('faker');

(async function() {
  const Pool = require ('pg').Pool
  const pool = new Pool({
    user: 'naps',
    host: 'localhost',
    database: 'charles_hustle',
    password: 'password',
    port: 5432
  });

  let userCount = 0;
  while (userCount <= 100) {
    const first_name = faker.name.firstName();
    const last_name = faker.name.lastName();
    const email = faker.internet.email();
    const slug = faker.lorem.slug();
    const password = 'password';
    const to_timestamp = new Date;

    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(password, salt);

    const query = {
      params: [first_name, last_name, email, password_hash, slug, to_timestamp, to_timestamp],
      string: 'INSERT INTO users (first_name, last_name, email, pass_hash, slug, created, last_updated) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id'
    };

    pool.query(query.string, query.params, (error, results) => {
      if (error) throw error;

      console.log(`User ID: ${results.rows[0].id}, was created`);
    });

    userCount++;
  };
})();
