const port = process.env.PORT || 5000;
const express = require("express");
const app = express();


app.get('/', function (req, res) {
  res.send('hello world')
})



const io = require("socket.io")(port, {
  cors: {
    origin: "*",
  },
});

io.on("connection", (socket) => {
  const id = socket.handshake.query.id;
  socket.join(id);

  socket.on("send-message", ({ recipients, text }) => {
    recipients.forEach((recipient) => {
      const newRecipients = recipients.filter((r) => r !== recipient);
      newRecipients.push(id);
      socket.broadcast.to(recipient).emit("receive-message", {
        recipients: newRecipients,
        sender: id,
        text,
      });
    });
  });
});
