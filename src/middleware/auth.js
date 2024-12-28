const catchAsyncErrors = require("./catchAsyncErrors");
const pool = require("../config/connection");
const jwt = require("jsonwebtoken");

// user Authentication
exports.isAuthenticatedUser = catchAsyncErrors(async (req, res, next) => {
  try {
    const { token } = req.cookies;

    if (!token) {
      return next(console.log("NO User"));
    }

    const decodeData = jwt.verify(token, process.env.SECRET_KEY);

    const checkLoginSQL = "SELECT * FROM users WHERE user_id=?";

    pool.query(checkLoginSQL, [decodeData.id], (selectError, users) => {
      if (selectError) {
        console.error("Error checking login data: " + selectError);
        return next(selectError);
      } else {
        if (users.length === 1) {
          req.user = users[0];
          next();
        } else {
          console.log("User is not Authorized");
        }
      }
    });
  } catch (error) {
    console.error("Error in isAuthenticatedUser middleware: " + error);
    next(error);
  }
});
