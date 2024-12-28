createUserTable = `
CREATE TABLE IF NOT EXISTS users (
user_id INT AUTO_INCREMENT PRIMARY KEY,
username VARCHAR(255) NOT NULL,
deviceToken VARCHAR(255) DEFAULT 0,
email VARCHAR(255) UNIQUE NOT NULL,
phoneNo VARCHAR(10) NOT NULL,
password VARCHAR(255) NOT NULL,
userrole VARCHAR(20) DEFAULT 'user' );`;

createMessagesTable = `CREATE TABLE IF NOT EXISTS messages (
                        msg_id INT AUTO_INCREMENT PRIMARY KEY,
                        senderPhoneNo VARCHAR(255) NOT NULL,
                        receiverPhoneNo VARCHAR(255) NOT NULL,
                        message VARCHAR(255) NOT NULL );`;
module.exports = { createUserTable, createMessagesTable };
