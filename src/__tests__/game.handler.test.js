const { handleItemPickup } = require('../handlers/game.handler');
const { getUserById, getItemById } = require('../handlers/helper');

// Mock data
const users = [
  { id: 1, score: 0, currentStage: 1000 },
  { id: 2, score: 50, currentStage: 1001 }
];

const items = [
  { id: 1, score: 50 },
  { id: 2, score: 100 }
];

// Mock functions
jest.mock('../handlers/helper', () => ({
  getUserById: jest.fn((userId) => users.find(user => user.id === userId)),
  getItemById: jest.fn((itemId) => items.find(item => item.id === itemId))
}));

describe('handleItemPickup', () => {
  it('should increase user score on item pickup', () => {
    const userId = 1;
    const itemId = 1;
    const initialScore = getUserById(userId).score;

    // Mock socket
    const socket = {
      emit: jest.fn()
    };

    handleItemPickup(userId, itemId, socket);
    
    const updatedScore = getUserById(userId).score;
    expect(updatedScore).toBe(initialScore + getItemById(itemId).score);
    expect(socket.emit).toHaveBeenCalledWith('scoreUpdate', { userId, score: updatedScore });
  });
});
