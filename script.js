// One place to change the rules of the game.
const GOAL_CANS = 20;
const GAME_SECONDS = 30;
const winningMessages = [
  'You made a splash! Water Quest complete!',
  'Wonderful collecting! You reached the goal!',
  'You did it! Every drop counts!'
];
const losingMessages = [
  'Keep going! Another water quest awaits.',
  'So close to your next adventure! Try again.',
  'Every attempt counts. Ready for another round?'
];

let currentCans = 0;
let gameActive = false;
let endTime = 0;
let spawnInterval = null;
let countdownInterval = null;
const grid = document.querySelector('.game-grid');
const scoreDisplay = document.getElementById('current-cans');
const timerDisplay = document.getElementById('timer');
const message = document.getElementById('achievements');
const startButton = document.getElementById('start-game');
const celebration = document.getElementById('celebration');

// Keep the same buttons between spawns so keyboard focus is not lost.
function createGrid() {
  for (let i = 0; i < 9; i++) {
    const cell = document.createElement('button');
    cell.type = 'button';
    cell.className = 'grid-cell';
    cell.addEventListener('click', () => collectItem(cell));
    grid.appendChild(cell);
  }
}

function clearBoard() {
  Array.from(grid.children).forEach((cell, index) => {
    cell.replaceChildren();
    cell.dataset.item = '';
    cell.disabled = !gameActive;
    cell.setAttribute('aria-label', `Square ${index + 1}: empty`);
  });
}

// Both Reset and game end cancel every running timer.
function clearTimers() {
  clearInterval(spawnInterval);
  clearInterval(countdownInterval);
  spawnInterval = null;
  countdownInterval = null;
}

function collectItem(cell) {
  if (!gameActive) return;
  // Check the deadline here too: a delayed timer must not allow late points.
  if (Date.now() >= endTime) {
    endGame();
    return;
  }
  const item = cell.dataset.item;
  if (!item) return;
  // Consume the item before scoring, so repeated clicks cannot collect it twice.
  cell.dataset.item = '';
  cell.replaceChildren();
  cell.setAttribute('aria-label', 'Collected square: empty');
  currentCans += item === 'can' ? 1 : -1;
  scoreDisplay.textContent = currentCans;
}

function spawnWaterCan() {
  if (!gameActive) return;
  if (Date.now() >= endTime) {
    endGame();
    return;
  }
  clearBoard();
  const cells = Array.from(grid.children);
  const canIndex = Math.floor(Math.random() * cells.length);
  const canCell = cells[canIndex];
  canCell.dataset.item = 'can';
  canCell.setAttribute('aria-label', `Square ${canIndex + 1}: collect yellow can, plus 1 point`);
  const canImage = document.createElement('img');
  canImage.src = 'img/water-can-transparent.png';
  canImage.alt = '';
  canImage.className = 'water-can';
  canCell.appendChild(canImage);

  // Choose a different square, so obstacles never cover a can.
  const obstacleIndex = (canIndex + 1 + Math.floor(Math.random() * 8)) % 9;
  const obstacleCell = cells[obstacleIndex];
  obstacleCell.dataset.item = 'obstacle';
  obstacleCell.setAttribute('aria-label', `Square ${obstacleIndex + 1}: obstacle, minus 1 point`);
  obstacleCell.innerHTML = '<span class="obstacle" aria-hidden="true"><b>×</b>Obstacle −1</span>';
}

function updateTimer() {
  // Use a real deadline instead of counting interval ticks (tabs can be delayed).
  const secondsLeft = Math.max(0, Math.ceil((endTime - Date.now()) / 1000));
  timerDisplay.textContent = secondsLeft;
  if (secondsLeft === 0) endGame();
}

function startGame() {
  if (gameActive) return;
  resetGame();
  gameActive = true;
  startButton.disabled = true;
  message.textContent = 'Collect yellow cans. Avoid the red × obstacles!';
  endTime = Date.now() + GAME_SECONDS * 1000;
  spawnWaterCan();
  // Forty opportunities in 30 seconds gives players room to reach 20.
  spawnInterval = setInterval(spawnWaterCan, 750);
  countdownInterval = setInterval(updateTimer, 100);
  grid.children[0].focus();
}

function endGame() {
  if (!gameActive) return;
  gameActive = false;
  clearTimers();
  clearBoard();
  timerDisplay.textContent = 0;
  const won = currentCans >= GOAL_CANS;
  const messages = won ? winningMessages : losingMessages;
  const randomMessage = messages[Math.floor(Math.random() * messages.length)];
  message.textContent = `${won ? 'You win!' : 'Time’s up!'} Final score: ${currentCans}. ${randomMessage}`;
  celebration.hidden = !won;
  startButton.disabled = false;
  startButton.textContent = 'Play Again';
  startButton.focus();
}

function resetGame() {
  clearTimers();
  gameActive = false;
  endTime = 0;
  currentCans = 0;
  scoreDisplay.textContent = 0;
  timerDisplay.textContent = GAME_SECONDS;
  message.textContent = 'Press Start Game when you’re ready.';
  celebration.hidden = true;
  startButton.disabled = false;
  startButton.textContent = 'Start Game';
  clearBoard();
}

createGrid();
resetGame();
startButton.addEventListener('click', startGame);
document.getElementById('reset-game').addEventListener('click', resetGame);
