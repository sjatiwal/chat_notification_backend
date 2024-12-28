const pool = require("../config/connection");
const sendNotification = require("../sendNotification/sendNotification");

let users = {};

let rooms = {};
function handleConnection(socket, io) {
  // Join user
  socket.on("join", (username, phoneno, senderPhoneNo, senderUserName) => {
    let room = "";

    if (phoneno > senderPhoneNo) {
      room = phoneno?.toString() + senderPhoneNo?.toString();
    } else {
      room = senderPhoneNo?.toString() + phoneno?.toString();
    }

    socket.join(room);

    // Track the room and its occupants
    if (!rooms[room]) {
      rooms[room] = room;
    }

    // check user receiving message exist in users list or not
    let existingUser = Object.values(users).find(
      (user) => user.userFromDB.phoneNo === phoneno
    );

    if (!existingUser) {
      // if exist getting its data from database
      pool.query(
        "SELECT * FROM users WHERE phoneNo = ? AND username = ?",
        [phoneno, username],
        (error, results) => {
          if (error) {
            console.error("Error querying database:", error);
            return;
          }

          if (results.length > 0) {
            const userFromDB = results[0];
            users[phoneno] = {
              userFromDB: userFromDB,
              socketId: socket.id,
            };
          } else {
            console.log("No other users with the same phone number found.");
          }
        }
      );
    } else {
      users[phoneno].socketId = socket.id;
      console.log("User with the same number exists");
    }

    // check user sending message exist in users list or not
    existingUser = Object.values(users).find(
      (user) => user.userFromDB.phoneNo === senderPhoneNo
    );

    if (!existingUser) {
      // if exist gettin its detais from data base
      pool.query(
        "SELECT * FROM users WHERE phoneNo = ? AND username = ?",
        [senderPhoneNo, senderUserName],
        (error, results) => {
          if (error) {
            console.error("Error querying database:", error);
            return;
          }

          if (results.length > 0) {
            const userFromDB = results[0];
            users[senderPhoneNo] = {
              userFromDB: userFromDB,
              socketId: socket.id,
            };
          } else {
            console.log("No other users with the same phone number found.");
          }
        }
      );
    } else {
      users[senderPhoneNo].socketId = socket.id;
      console.log("User with the same number exists");
    }
  });

  // Handle chat messages
  socket.on("chat message", (msg, senderPhoneNo, receiverPhoneNo) => {
    let room = "";
    if (receiverPhoneNo > senderPhoneNo) {
      room = receiverPhoneNo?.toString() + senderPhoneNo?.toString();
    } else {
      room = senderPhoneNo?.toString() + receiverPhoneNo?.toString();
    }

    const sender = users[senderPhoneNo];

    const findUser = (receiverPhoneNo) => {
      const query = "SELECT * FROM users WHERE phoneNo = ?";
      pool.query(query, [receiverPhoneNo], (err, results) => {
        if (err) throw err;

        // sending notification
        if (results) {
          sendNotification(
            results?.[0]?.deviceToken,
            {
              title: sender?.userFromDB?.username,
              body: msg,
            },
            {
              phoneNo: sender?.userFromDB?.phoneNo?.toString(),
              username: sender?.userFromDB?.username,
            }
          );
        }
      });
    };

    if (sender) {
      findUser(receiverPhoneNo);
    }

    // Emit the message to the sender as well
    io.to(rooms[room]).emit("chat message", {
      senderPhoneNo: sender?.userFromDB?.phoneNo,
      message: msg,
    });

    // Store the message in the database
    pool.query(
      "INSERT INTO messages (senderPhoneNo, receiverPhoneNo, message) VALUES (?, ?, ?)",
      [senderPhoneNo, receiverPhoneNo, msg],
      (error, results) => {
        if (error) {
          console.error("Error inserting message into database:", error);
          return;
        }
        console.log("Message inserted into database successfully");
      }
    );
  });
}

module.exports = { handleConnection };
