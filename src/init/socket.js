const { handleConnection } = require('../handlers/game.handler');

function initializeSocket(io) {
  io.on('connection', handleConnection);
}

module.exports = { initializeSocket };
