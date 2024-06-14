const items = [
    { id: 1, score: 50 },
    { id: 2, score: 100 },
    { id: 3, score: 150 }
  ];
  
  function getItemById(itemId) {
    return items.find(item => item.id === itemId);
  }
  
  module.exports = { getItemById };
  