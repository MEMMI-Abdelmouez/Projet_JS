const express = require("express");
var five = require("johnny-five"),
  button;

const board = new five.Board({ port: "COM10" });
const app = express();
app.use(express.static("public"));
const server = app.listen(3000, () => {
  console.log(`Express running → PORT ${server.address().port}`);
});
const socket = require("socket.io");
const io = socket(server);
board.on("ready", function () {
  button = new five.Button(2);
  board.repl.inject({
    button: button,
  });
  io.on("connection", (socket) => {
    button.on("down", function () {
      io.emit("button clicked");
    });
  });
});
