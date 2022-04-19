const { isAuth } = require("../common/auth");

// postgresql сонгосон бол доорх мөрийн uncomment
// const {
//   getUsers,
//   insertUser,
//   updateUser,
//   deleteUser,
// } = require("../logic/admin");

// mongodb сонгосон бол доорх мөрийн uncomment
// const {
//   getUsers,
//   insertUser,
//   updateUser,
//   deleteUser,
//   login,
//   insertBlog,
//   getBlog,
// } = require("../logic/admin_mongo");
// const { logger } = require("../common/log");

module.exports = function (app, connection) {
  /**
   * GET - Жагсаалт авах, ямар нэг дата харахад ашиглана => app.get()
   * POST - Login, Create дээр ашиглана => app.post()
   * PUT - Update буюу дата засахад ашиглана => app.put()
   * DELETE - Устгахад ашиглана => app.delete()
   */

  app.post("/api/login", async (req, res) => {
    try {
      logger.info(`${req.ip} /api/login [POST]`);

      login(req, res, connection);
    } catch (err) {
      logger.error(`${req.ip} ${err}`);
      res.status(500).json({ error: err.message });
    }
  });

  // endpoints
  app.get("/api/user", isAuth, async (req, res) => {
    try {
      logger.info(`${req.ip} /user [get]`);

      getUsers(req, res, connection);
    } catch (err) {
      logger.error(`${req.ip} ${err}`);
      res.status(500).json({ error: err.message });
    }
  });

  app.post("/api/user", isAuth, async (req, res) => {
    try {
      logger.info(`${req.ip} /user [post]`);
      insertUser(req, res, connection);
    } catch (err) {
      logger.error(`${req.ip} ${err}`);
      res.status(500).json({ error: err.message });
    }
  });

  app.put("/api/user", isAuth, async (req, res) => {
    try {
      logger.info(`${req.ip} /user [put]`);
      updateUser(req, res, connection);
    } catch (err) {
      logger.error(`${req.ip} ${err}`);
      res.status(500).json({ error: err.message });
    }
  });

  app.delete("/api/user", isAuth, async (req, res) => {
    try {
      logger.info(`${req.ip} /user [delete]`);
      deleteUser(req, res, connection);
    } catch (err) {
      logger.error(`${req.ip} ${err}`);
      res.status(500).json({ error: err.message });
    }
  });

  // blog API
  app.post("/api/blog", isAuth, async (req, res) => {
    try {
      logger.info(`${req.ip} /blog [post]`);
      insertBlog(req, res, connection);
    } catch (err) {
      logger.error(`${req.ip} ${err}`);
      res.status(500).json({ error: err.message });
    }
  });

  app.get("/api/blog", isAuth, async (req, res) => {
    try {
      logger.info(`${req.ip} /blog [get]`);

      getBlog(req, res, connection);
    } catch (err) {
      logger.error(`${req.ip} ${err}`);
      res.status(500).json({ error: err.message });
    }
  });
};
