const serverInstance = require("./app");

const server = serverInstance.listen(
  process.env.PORT,

  () => {
    console.log(`server is working on http://localhost:${process.env.PORT}`);
  }
);

//ipconfig getifaddr en0
// unhandled Promise rejection
process.on("unhandledRejection", (err) => {
  console.log("unhandledRejection", err);
  server.close(() => {
    process.exit(1);
  });
});
