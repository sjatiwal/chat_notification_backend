const http = require("http");
const express = require("express");
const cors = require("cors");
const socketIo = require("socket.io");
const dotenv = require("dotenv");
dotenv.config();
const cookieParser = require("cookie-parser");

// route
const user = require("./routes/user");
const messages = require("./routes/message");
const { handleConnection } = require("./socket/socket");
const app = express();

const serverInstance = http.createServer(app);
const io = socketIo(serverInstance);
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: "http://localhost:8081",
    credentials: true,
    optionsSuccessStatus: 200,
  })
);

io.on("connection", (socket) => {
  handleConnection(socket, io);
});

app.use("/api/v1", user);
app.use("/api/v1", messages);

module.exports = serverInstance;
