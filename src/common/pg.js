require("dotenv").config();
const Pool = require("pg").Pool;

function createConnection() {
  const connection = new Pool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
  });

  return new Promise((resolve, reject) => {
    connection.connect((err) => {
      if (err) {
        return reject(err);
      }
      logger.info("Connected successfully to postgresql server.");
      return resolve(connection);
    });
  });
}

module.exports = { createConnection };
