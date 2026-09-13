const { Client } = require('pg');
const client = new Client({
  connectionString: 'postgresql://postgres:Magicfree@127.0.0.1:5432/competitioncare'
});
client.connect()
  .then(() => {
    console.log('Node.js connected successfully!');
    return client.end();
  })
  .catch(err => {
    console.error('Connection failed:', err.message);
    process.exit(1);
  });
