const {
  createUserTable,
  createMessagesTable,
} = require("../models/tableSchemma");
import { pool } from "./pool";
pool.getConnection(() => {
  //   if (err) throw err;
  console.log("Connected to MySQL!");

  const createDatabaseSQL = "CREATE DATABASE IF NOT EXISTS ChatRoom";

  pool.query(createDatabaseSQL, (dbError) => {
    if (dbError) {
      console.error("Error creating database: " + dbError);
    } else {
      console.log("Database created successfully");

      // Select the newly created database
      pool.query("USE ChatRoom", (useDbError) => {
        if (useDbError) {
          console.error("Error selecting the database: " + useDbError);
        } else {
          console.log("Database selected successfully");

          // SQL query to create the "users" table
          pool.query(createUserTable, (tableError) => {
            if (tableError) {
              console.error("Error creating table: " + tableError);
            } else {
              console.log("User Table created successfully");
            }
          });

          // SQL query to create the "Messages" table
          pool.query(createMessagesTable, (tableError) => {
            if (tableError) {
              console.error("Error creating table: " + tableError);
            } else {
              console.log("Messages Table created successfully");
            }
          });
        }
      });
    }
  });
});
module.exports = pool;
