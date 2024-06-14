const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const PORT = process.env.PORT || 3000;

// 정적 파일 서빙 설정
app.use(express.static(path.join(__dirname, '..', 'public')));

// 소켓 이벤트 핸들링
io.on('connection', (socket) => {
  console.log('a user connected');
  socket.on('disconnect', () => {
    console.log('user disconnected');
  });

  // 이벤트
  socket.on('itemPickup', (data) => {
    console.log(`User ${data.userId} picked up item ${data.itemId}`);
    io.emit('scoreUpdate', { userId: data.userId, score: Math.floor(Math.random() * 100) });
  });
});

// 서버 시작
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
