const { getUserById, registerUser } = require('./register.handler');
const { getItemById } = require('./helper');
const { stages } = require('../init/assets');

function handleConnection(socket) {
  const userId = Math.floor(Math.random() * 1000);  // 임시로 랜덤한 유저 ID 생성
  registerUser(userId);  // 유저 등록

  socket.on('itemPickup', (data) => {
    const { itemId } = data;
    validateItemPickup(userId, itemId, socket);
  });
}

function validateItemPickup(userId, itemId, socket) {
    const user = getUserById(userId);
    if (!user) {
      console.error(`User with ID ${userId} not found`);
      return;
    }
    
    const stageId = user.currentStage;
    const stage = stages.find(stage => stage.id === stageId);
    if (!stage) {
      console.error(`Stage with ID ${stageId} not found`);
      return;
    }
    const itemUnlockInfo = stage.items;
    if (itemUnlockInfo && itemUnlockInfo.includes(itemId)) {
      handleItemPickup(userId, itemId, socket);
    }
  }

function handleItemPickup(userId, itemId, socket) {
  const item = getItemById(itemId);
  if (item) {
    const user = getUserById(userId);
    user.score += item.score;
    socket.emit('scoreUpdate', { userId, score: user.score });
  }
}
console.log(stages);

module.exports = { handleConnection, handleItemPickup };
