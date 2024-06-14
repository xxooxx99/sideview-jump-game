const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const { initializeSocket } = require('./init/socket');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

initializeSocket(io);

app.use(express.static('public'));

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
