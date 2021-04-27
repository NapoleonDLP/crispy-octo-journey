const updateUserQuery = function(body, id) {
  let storage = {
    query: 'UPDATE users SET ',
    entries: []
  };

  let entryCount = 0;

  for (const entry in body) {
    if (body[entry]) {
      entryCount++;
      storage.entries.push(body[entry]);
      storage.query += `${entry} = $${entryCount}, `
    }
  }

  const to_timestamp = new Date;
  entryCount++;
  storage.query += `last_updated = $${entryCount} `;
  storage.entries.push(to_timestamp);


  storage.query += `WHERE id = $${entryCount + 1}`;
  storage.entries.push(id);

  return storage;
};

module.exports = {
  updateUserQuery
};
