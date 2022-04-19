const { MongoClient } = require("mongodb");
const { logger } = require("./log");

async function createConnection() {
  const client = new MongoClient(process.env.MONGO_CONNECTION_URL);
  await client.connect();
  logger.info("Connected successfully to mongodb server.");
  const connection = client.db(process.env.MONGO_DB_NAME);
  return connection;
}

module.exports = { createConnection };
