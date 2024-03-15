const userRoutes = require("../Routes/User/user");
const chatRoutes = require("../Routes/Chat/chatRoute");
const groupchat = require("../Routes/GroupChat/groupChat");
const friendRequest = require("../Routes/User/friends");
const videoRequest = require("../Routes/Video/video")
function setupRoutes(app) {
  app.use('/user', userRoutes);
  app.use('/chat', chatRoutes);
  app.use("/groupchat", groupchat);
  app.use('/friendRequest',friendRequest);
  app.use('/video',videoRequest);
}

module.exports = setupRoutes;