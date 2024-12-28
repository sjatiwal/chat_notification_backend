const express = require("express");
const router = express.Router();
const { isAuthenticatedUser } = require("../middleware/auth");
const { getUserMessages } = require("../controllers/message");

router
  .route("/getusermessage/:phoneNo")
  .get(isAuthenticatedUser, getUserMessages);

module.exports = router;
