const users = [];

function registerUser(userId) {
  const user = {
    id: userId,
    score: 0,
    currentStage: 1000
  };
  users.push(user);
  return user;
}

function getUserById(userId) {
  return users.find(user => user.id === userId);
}

module.exports = { registerUser, getUserById };
