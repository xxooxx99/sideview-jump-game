const socket = io();

const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext('2d');

const GRAVITY = 0.5;
const JUMP_STRENGTH = -10;
const PLAYER_WIDTH = 20;
const PLAYER_HEIGHT = 40;
const GROUND_HEIGHT = 50;
const INITIAL_OBSTACLE_SPEED = 2;
const INITIAL_ITEM_SPEED = 2;
const STAGE_DURATION = 10; // 각 스테이지 지속 시간 (초)
const MAX_JUMPS = 2; // 최대 연속 점프 횟수

let userId = Math.floor(Math.random() * 1000);  // 임시로 랜덤한 유저 ID 생성
let currentStage = 1;
let score = 0;
let obstacleSpeed = INITIAL_OBSTACLE_SPEED;
let itemSpeed = INITIAL_ITEM_SPEED;
let stageProgress = 0;
let stageInterval;
let isGameOver = false; // 게임 상태를 관리하는 변수
let isGameRunning = false; // 게임이 실행 중인지 여부
let jumpCount = 0; // 현재 연속 점프 횟수

let player = {
  x: 50,
  y: canvas.height - GROUND_HEIGHT - PLAYER_HEIGHT,
  width: PLAYER_WIDTH,
  height: PLAYER_HEIGHT,
  color: 'mint',
  velocityY: 0,
  isJumping: false
};

let obstacles = [];
let items = [];

function initializeGame() {
  document.addEventListener('keydown', handleKeyDown);
  document.addEventListener('keyup', handleKeyUp);
  document.getElementById('start-button').addEventListener('click', startGame);
  document.getElementById('restart-button').addEventListener('click', restartGame);
  document.getElementById('next-stage-button').addEventListener('click', nextStage);
  document.getElementById('end-button').addEventListener('click', endGame);
  resetGame();
}

function resetGame() {
  player.y = canvas.height - GROUND_HEIGHT - PLAYER_HEIGHT;
  player.velocityY = 0;
  obstacles = [];
  items = [];
  stageProgress = 0;
  isGameOver = false;
  isGameRunning = false;
  jumpCount = 0; // 점프 횟수 초기화
  obstacleSpeed = INITIAL_OBSTACLE_SPEED; // 난이도 초기화
  itemSpeed = INITIAL_ITEM_SPEED; // 난이도 초기화
  updateScore();
  updateProgressBar();
}

function handleKeyDown(event) {
  if (isGameRunning && (event.key === 'ArrowUp' || event.key === ' ') && jumpCount < MAX_JUMPS) {
    player.isJumping = true;
    player.velocityY = JUMP_STRENGTH;
    jumpCount++;
  }
}

function handleKeyUp(event) {
  if (event.key === 'ArrowUp' || event.key === ' ') {
    player.isJumping = false;
  }
}

function generateObstacles() {
  obstacles.push({ x: 800, y: canvas.height - GROUND_HEIGHT - 30, width: 30, height: 30, color: 'red' });
  obstacles.push({ x: 1000, y: canvas.height - GROUND_HEIGHT - 40, width: 40, height: 40, color: 'red' });
}

function generateItems() {
  items.push({ id: 1, x: 900, y: canvas.height - GROUND_HEIGHT - 20, width: 20, height: 20, color: 'gold' });
  items.push({ id: 2, x: 1100, y: canvas.height - GROUND_HEIGHT - 20, width: 20, height: 20, color: 'gold' });
}

function updatePlayer() {
  player.velocityY += GRAVITY;
  player.y += player.velocityY;
  
  if (player.y + player.height > canvas.height - GROUND_HEIGHT) {
    player.y = canvas.height - GROUND_HEIGHT - player.height;
    player.velocityY = 0;
    jumpCount = 0; // 바닥에 닿으면 점프 횟수 초기화
  }
}

function updateObstacles() {
  obstacles.forEach(obstacle => {
    obstacle.x -= obstacleSpeed;
  });

  obstacles = obstacles.filter(obstacle => obstacle.x + obstacle.width > 0);

  if (Math.random() < 0.01 * currentStage) { // 스테이지에 따라 빈도 증가
    const size = Math.random() * 30 + 20;
    obstacles.push({ x: canvas.width, y: canvas.height - GROUND_HEIGHT - size, width: size, height: size, color: 'red' });
  }
}

function updateItems() {
  items.forEach(item => {
    item.x -= itemSpeed;
  });

  items = items.filter(item => item.x + item.width > 0);

  if (Math.random() < 0.005 * currentStage) { // 스테이지에 따라 빈도 증가
    const size = 20;
    items.push({ id: Math.floor(Math.random() * 1000), x: canvas.width, y: canvas.height - GROUND_HEIGHT - size, width: size, height: size, color: 'gold' });
  }
}

function checkCollisions() {
  obstacles.forEach(obstacle => {
    if (player.x < obstacle.x + obstacle.width &&
        player.x + player.width > obstacle.x &&
        player.y < obstacle.y + obstacle.height &&
        player.y + player.height > obstacle.y) {
      if (!isGameOver) {
        isGameOver = true;
        alert('Game Over');
        document.getElementById('restart-button').style.display = 'block'; // game over 시에만 보이도록 수정
        endGame();
      }
    }
  });

  items.forEach((item, index) => {
    if (player.x < item.x + item.width &&
        player.x + player.width > item.x &&
        player.y < item.y + item.height &&
        player.y + player.height > item.y) {
      pickupItem(item.id);
      items.splice(index, 1);
    }
  });
}

function pickupItem(itemId) {
  socket.emit('itemPickup', { userId, itemId });
}

socket.on('scoreUpdate', data => {
  if (data.userId === userId) {
    score = data.score;
    updateScore();
  }
});

function updateScore() {
  document.getElementById('score').textContent = `Score: ${score}`;
}

function updateProgressBar() {
  const progressBar = document.getElementById('progress-bar');
  progressBar.style.width = `${(stageProgress / STAGE_DURATION) * 100}%`;
}

function startStageTimer() {
  stageInterval = setInterval(() => {
    if (!isGameOver) {
      stageProgress += 1;
      score += 10 * currentStage;  // 스테이지 진행 시마다 점수 추가
      updateScore();
      updateProgressBar();
  
      if (stageProgress >= STAGE_DURATION) {
        clearInterval(stageInterval);
        document.getElementById('next-stage-button').style.display = 'block';
        document.getElementById('end-button').style.display = 'block';
        isGameRunning = false;
      }
    }
  }, 1000);
}

function startGame() {
  document.getElementById('start-button').style.display = 'none';
  document.getElementById('restart-button').style.display = 'none'; // game over 시에만 보이도록 수정
  currentStage = 1; // 스테이지 초기화
  resetGame();
  isGameRunning = true;
  generateObstacles();
  generateItems();
  startStageTimer();
  gameLoop();
}

function restartGame() {
  document.getElementById('restart-button').disabled = true; // 비활성화
  let countdown = 3;
  const countdownElement = document.getElementById('countdown');
  countdownElement.style.display = 'block';
  countdownElement.textContent = countdown;
  const countdownInterval = setInterval(() => {
    countdown--;
    countdownElement.textContent = countdown;
    if (countdown <= 0) {
      clearInterval(countdownInterval);
      countdownElement.style.display = 'none';
      resetGame();
      isGameRunning = true;
      generateObstacles();
      generateItems();
      startStageTimer();
      gameLoop();
      document.getElementById('restart-button').disabled = false; // 활성화
    }
  }, 1000);
}

function nextStage() {
  // 스테이지가 10초가 지나 클리어되지 않도록 수정
}

function endGame() {
  clearInterval(stageInterval);
  isGameOver = true;
  isGameRunning = false;
  document.getElementById('next-stage-button').style.display = 'none';
  document.getElementById('end-button').style.display = 'none';
}

function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = 'gray';
  ctx.fillRect(0, canvas.height - GROUND_HEIGHT, canvas.width, GROUND_HEIGHT);

  if (!isGameOver) {
    updatePlayer();
    ctx.fillStyle = player.color;
    ctx.fillRect(player.x, player.y, player.width, player.height);
  
    updateObstacles();
    obstacles.forEach(obstacle => {
      ctx.fillStyle = obstacle.color;
      ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
    });
  
    updateItems();
    items.forEach(item => {
      ctx.fillStyle = item.color;
      ctx.fillRect(item.x, item.y, item.width, item.height);
    });
  
    checkCollisions();
  }

  requestAnimationFrame(gameLoop);
}

initializeGame();
