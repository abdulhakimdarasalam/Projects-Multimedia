const express = require("express");

const router = express.Router();
const usersController = require("../controllers/users");

router.get("/data", usersController.getAllUsers);
router.post("/register", usersController.createUser);

module.exports = router;
