const { logger } = require("../common/log");
const moment = require("moment");
var mongodb = require("mongodb");
const { generateToken, verifyToken } = require("../common/auth");
const { sendEmail } = require("../common/email");

const login = async (request, response, pool) => {
  try {
    const { username, password } = request.body;
    const collection = pool.collection("users");
    const rows = await collection.find({ username, password }).toArray();
    if (rows && rows.length > 0) {
      return response.status(200).json({
        message: "Successfully Logged In",
        user: rows[0],
        token: generateToken(rows[0].username),
        tokenExpTime: moment()
          .add(process.env.TOKEN_EXPIRE_MINUTE, "m")
          .format("YYYY-MM-DD HH:mm:ss"),
      });
    } else {
      return response.status(401).json({
        message: "Username or password inccorrect!",
      });
    }
  } catch (error) {
    response.status(500).send({ error: error.message });
    logger.error(`${request.ip} ${error.message}`);
    return;
  }
};

const getUsers = async (request, response, pool) => {
  try {
    const collection = pool.collection("users");
    const rows = await collection.find({}).toArray();
    return response.status(200).json({
      data: rows,
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
    const collection = pool.collection("users");

    const code = Math.floor(Math.random() * 10000)
      .toString()
      .padStart(4, "0"); //0738

    request.body.code = code;
    const user = await collection.insertOne(request.body);

    const message = `
    <h1>Your account has approved.</h1>
    Please click <a href="http://localhost:8080/api/approve/${String(
      user.insertedId
    )}/${code}">CLICK HERE</a> to approve your account. Your code: <b>${code}</b>
    `;
    sendEmail(request.body.email, "NEST ERP - approval email", message);

    return response.status(200).json({ message: "success" });
  } catch (error) {
    response.status(500).send({ error: error.message });
    logger.error(`${request.ip} ${error.message}`);
    return;
  }
};

const deleteUser = async (request, response, pool) => {
  try {
    const { _id } = request.body;
    const collection = pool.collection("users");
    const deleteResult = await collection.deleteOne({
      _id: new mongodb.ObjectID(_id),
    });
    logger.info(`Deleted documents id:${_id} => ${deleteResult.deletedCount}`);
    return response
      .status(200)
      .json({ message: "success", token: request.token });
  } catch (error) {
    response.status(500).send({ error: error.message });
    logger.error(`${request.ip} ${error.message}`);
    return;
  }
};

const updateUser = async (request, response, pool) => {
  try {
    const { _id } = request.body;
    const collection = pool.collection("users");

    // body._id -г update дээр дамжуулж болохгүй, хасаж дамжуулах ёстой
    delete request.body._id;

    await collection.updateOne(
      { _id: new mongodb.ObjectID(_id) },
      { $set: request.body }
    );
    return response
      .status(200)
      .json({ message: "success", token: request.token });
  } catch (error) {
    response.status(500).send({ error: error.message });
    logger.error(`${request.ip} ${error.message}`);
    return;
  }
};

const approveUser = async (request, response, pool) => {
  try {
    const { id, code } = request.params;

    const collection = pool.collection("users");

    const found = await collection.findOne({
      _id: new mongodb.ObjectID(id),
      code,
    });

    if (found) {
      await collection.updateOne(
        { _id: new mongodb.ObjectID(id) },
        { $set: { ...found, status: "approved" } }
      );
      response.status(200).json({ message: "success" });
    } else {
      response.status(404).json({ message: "id or code is wrong!" });
    }
  } catch (error) {
    response.status(500).send({ error: error.message });
    logger.error(`${request.ip} ${error.message}`);
    return;
  }
};

const getBlog = async (request, response, pool) => {
  try {
    const collection = pool.collection("blog");
    const rows = await collection
      .find({}, { sort: [["date", "desc"]] })
      .toArray();
    return response.status(200).json({
      data: rows,
      token: request.token,
    });
  } catch (error) {
    response.status(500).send({ error: error.message });
    logger.error(`${request.ip} ${error.message}`);
    return;
  }
};

const insertBlog = async (request, response, pool) => {
  try {
    const collection = pool.collection("blog");
    await collection.insertOne(request.body);
    return response
      .status(200)
      .json({ message: "success", token: request.token });
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
  login,
  insertBlog,
  getBlog,
  approveUser,
};
