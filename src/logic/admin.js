const { logger } = require("../common/log");

const getUsers = async (request, response, pool) => {
  try {
    const result = await pool.query("SELECT * FROM users");
    return response.status(200).json({
      data: result.rows,
      token: request.token,
    });
  } catch (error) {
    response.status(500).send({ error: error.message });
    logger.error(`${request.ip} ${error.message}`);
    return;
  }
};

const insertUser = async (request, response, pool) => {
  try {
    const { username, firstname, lastname, password } = request.body;
    await pool.query(
      "INSERT INTO users (username, firstname, lastname, password) values ($1, $2, $3, $4)",
      [username, firstname, lastname, password]
    );
    return response.status(200).json({
      message: "success",
      token: request.token,
    });
  } catch (error) {
    response.status(500).send({ error: error.message });
    logger.error(`${request.ip} ${error.message}`);
    return;
  }
};

const updateUser = async (request, response, pool) => {
  try {
    const { username, firstname, lastname, password, id } = request.body;
    await pool.query(
      "UPDATE users SET username=$1, firstname=$2, lastname=$3, password=$4 where id = $5",
      [username, firstname, lastname, password, id]
    );
    return response.status(200).json({
      message: "success",
      token: request.token,
    });
  } catch (error) {
    response.status(500).send({ error: error.message });
    logger.error(`${request.ip} ${error.message}`);
    return;
  }
};

const deleteUser = async (request, response, pool) => {
  try {
    const { id } = request.body;
    console.log("id: ", id);
    await pool.query("DELETE FROM users WHERE id = $1", [id]);
    return response.status(200).json({
      message: "success",
      token: request.token,
    });
  } catch (error) {
    response.status(500).send({ error: error.message });
    logger.error(`${request.ip} ${error.message}`);
    return;
  }
};

module.exports = {
  getUsers,
  insertUser,
  updateUser,
  deleteUser,
};
