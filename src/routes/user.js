const express = require("express");
const router = express.Router();

// Importing controller functions for user-related operations
const {
  loginUser,
  registerUser,
  getUserDetails,
  getAllUsers,
} = require("../controllers/user");
const { isAuthenticatedUser } = require("../middleware/auth");

router.route("/login").post(loginUser); // route to handle login
router.route("/register").post(registerUser); // route to handle registration
router.route("/me").get(isAuthenticatedUser, getUserDetails); // route to get use details
router.route("/alluser").get(isAuthenticatedUser, getAllUsers); // route to get list of all uset

module.exports = router;
