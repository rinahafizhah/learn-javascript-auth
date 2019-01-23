const express = require("express");
const isAuthenticated = require("../middlewares").isAuthenticated;
const router = express.Router();

const UserController = require("../controllers/UserController");

router
  .route("/")
  .get(isAuthenticated, UserController.getUsers)
  .post(UserController.createUser);

router
  .route("/:id")
  .get(UserController.getUserById)
  .patch(UserController.updateUserById)
  .delete(UserController.deleteUserById);

router.post("/login", UserController.login);

module.exports = router;
