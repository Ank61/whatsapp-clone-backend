const socketio = require("socket.io");
const insertChat = require("./../../Utils/common");
const fs = require("fs");
const express = require("express");
const app = express();

app.use(express.static("public"));

const socketService = (server) => {
  const io = socketio(server, { cors: { origin: "*" } });
  io.on("connection", (socket) => {
    socket.on("setup", (data) => {
      const { user } = data;
      socket.join(user);
      console.log(user, "connected");
    });
    socket.on("join chat", (room) => {
      socket.join(room);
    });
    socket.on("typing", async (typingMessage) => {
      const { to, message, from, messageId } = typingMessage;
      socket.in(to).emit("typed message", typingMessage);
    });
    socket.on("new message", async (newMessageRecieved) => {
      const { to, message, from, messageId } = newMessageRecieved;
      socket.in(to).emit("message recieved", newMessageRecieved);
      if (messageId) {
        //if there is already one present then get the id of chat
        //and update the message object
      } else {
        //create a new message object
        //update the the user list
        const result = await insertChat(null, from, message);
        console.log("Result of inserting", result);
      }
    });
    socket.on("acceptVideoRequest", async (acceptVideoRequest) => {
      const { to, from } = acceptVideoRequest;
      socket.in(to).emit("acceptVideoRequest", acceptVideoRequest);
    });
    socket.on("declineVideoRequest", async (declineVideoRequest) => {
      const { to, from } = declineVideoRequest;
      socket.in(to).emit("declineVideoRequest", declineVideoRequest);
    });
    socket.on("requestVideoShare", async (info) => {
      const { to, from } = info;
      socket.in(to).emit("requestVideoShare", info);
    });
    socket.on("playVideo", async (videoStart) => {
      const { to, from, videoName } = videoStart;
      socket.in(to).emit("playVideo", videoStart);
    });
    socket.on("matchTime", async (matchTime) => {
      const { to } = matchTime;
      socket.in(to).emit("matchTime", matchTime);
    });
    socket.on("playPausedVideo", async (videoInfo) => {
      const { to } = videoInfo;
      socket.in(to).emit("playPausedVideo",videoInfo);
    });
    socket.on("disconnect", () => {
      console.log(`User disconnected: ${socket.username}`);
    });
  });
  return io;
};

module.exports = socketService;
