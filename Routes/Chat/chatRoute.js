const express = require("express");
const app = express();
const { protect } = require("../../Middleware/authMiddleware");
const chatsModal = require("../../Models/chatModel");
const userModal = require("../../Models/userModal");

app.post("/insert", async (request, response) => {
  try {
    const chatExists = request.body?.chatId;
    if (!chatExists) {
      const requestingUser = request.body.userId;
      const connectingUser = request.body.connectingUser;
      const newChat = await chatsModal.create({
        chatName: "private",
        users: [requestingUser, connectingUser],
        messages: [],
      });
      await userModal.updateMany(
        { _id: { $in: [requestingUser, connectingUser] } },
        { chat: newChat._id }
      );
      return response.status(200).send("Created");
    } else {
      const incomingMessage = request.body.incomingMessage;
      await chatsModal.updateOne(
        { _id: chatExists },
        { $push: { messages: incomingMessage } }
      );
      return response.status(200).send("Inserted");
    }
  } catch (error) {
    return response
      .status(500)
      .send({ error: "An error occurred", message: error.message });
  }
});

app.post("/fetch", async (request, response) => {
  try {
    const chatExists = request.body?.chatId;
    const chatData = await chatsModal.findOne({ _id: chatExists });
    return response.status(200).send(chatData);
  } catch (error) {
    response.status(400);
    throw new Error(error.message);
  }
});

module.exports = app;
