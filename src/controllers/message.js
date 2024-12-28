const pool = require("../config/connection");
const catchAsyncError = require("../middleware/catchAsyncErrors");

// User Messages
exports.getUserMessages = catchAsyncError(async (req, res, next) => {
  const phoneNo = req.params.phoneNo;
  try {
    pool.query(
      "SELECT * FROM messages WHERE senderPhoneNo = ? AND receiverPhoneNo = ? OR senderPhoneNo = ? AND receiverPhoneNo = ?  ",
      [req.user.phoneNo, phoneNo, phoneNo, req.user.phoneNo],
      (error, results) => {
        if (error) {
          console.error("Error querying database:", error);
          return res.status(500).json({ error: "Internal server error" });
        }
        res.json(results);
      }
    );
  } catch (err) {
    console.log(err);
  }
});
