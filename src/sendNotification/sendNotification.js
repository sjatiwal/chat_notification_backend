const admin = require("firebase-admin");
const serviceAccount = require("../firebase/chatroom-2e344-firebase-adminsdk-932tj-5f18a0d18c.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const sendNotification = async (deviceToken, payload, user) => {
  const messageSend = {
    token: deviceToken,
    notification: payload,
    data: {
      name: user?.username,
      phoneNo: user?.phoneNo,
      click_action: "ChatScreen",
    },
  };

  admin
    .messaging()
    .send(messageSend)
    .then((res) => {
      console.log(res, "NOTIFICATION success");
    })
    .catch((error) => {
      console.log(error, "Error Notification");
    });
};

module.exports = sendNotification;
