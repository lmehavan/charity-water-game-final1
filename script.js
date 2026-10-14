// Difficulty settings for charity: water Water Quest
const DIFFICULTIES = {
  easy: {
    name: 'Easy',
    goal: 15,
    seconds: 40,
    spawnRate: 800,
    ruleText: 'Collect 15 points in 40 seconds to win!'
  },
  normal: {
    name: 'Normal',
    goal: 20,
    seconds: 30,
    spawnRate: 750,
    ruleText: 'Collect 20 points in 30 seconds to win!'
  },
  hard: {
    name: 'Hard',
    goal: 25,
    seconds: 25,
    spawnRate: 650,
    ruleText: 'Collect 25 points in 25 seconds to win!'
  }
};

// Milestone messages stored in an array and triggered via conditionals
const milestoneMessages = [
  'Halfway there! Keep up the great pace!',
  'Goal reached! Fantastic job—keep scoring to make an even bigger splash!'
];

// Winning and losing messages picked at random when the round ends
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

// Game state variables
let currentDifficulty = 'normal';
let currentGoal = DIFFICULTIES.normal.goal;
let currentTimeLimit = DIFFICULTIES.normal.seconds;
let currentSpawnRate = DIFFICULTIES.normal.spawnRate;

let currentCans = 0;
let gameActive = false;
let endTime = 0;
let spawnInterval = null;
let countdownInterval = null;
let isMuted = false;
let milestonesReached = { halfway: false, goal: false };

// DOM element references
const grid = document.querySelector('.game-grid');
const scoreDisplay = document.getElementById('current-cans');
const goalDisplay = document.getElementById('goal-cans');
const timerDisplay = document.getElementById('timer');
const message = document.getElementById('achievements');
const startButton = document.getElementById('start-game');
const resetButton = document.getElementById('reset-game');
const celebration = document.getElementById('celebration');
const difficultySelect = document.getElementById('difficulty-select');
const difficultyRules = document.getElementById('difficulty-rules');
const instructionsTitle = document.getElementById('instructions-title');
const instructionsBody = document.getElementById('instructions-body');
const muteButton = document.getElementById('mute-button');
const soundCollect = document.getElementById('sound-collect');
const soundWin = document.getElementById('sound-win');

// Create the 3x3 grid cells once so keyboard focus is preserved between spawns
function createGrid() {
  for (let i = 0; i < 9; i++) {
    const cell = document.createElement('button');
    cell.type = 'button';
    cell.className = 'grid-cell';
    cell.addEventListener('click', () => collectItem(cell));
    grid.appendChild(cell);
  }
}

// Reset all cells to empty state
function clearBoard() {
  Array.from(grid.children).forEach((cell, index) => {
    cell.replaceChildren();
    cell.dataset.item = '';
    cell.disabled = !gameActive;
    cell.setAttribute('aria-label', `Square ${index + 1}: empty`);
  });
}

// Clear active intervals to prevent overlapping or duplicate timers
function clearTimers() {
  clearInterval(spawnInterval);
  clearInterval(countdownInterval);
  spawnInterval = null;
  countdownInterval = null;
}

// Play audio helper with mute check and safe error catching
function playSound(audioElement) {
  if (isMuted || !audioElement) return;
  try {
    audioElement.currentTime = 0;
    const playPromise = audioElement.play();
    if (playPromise !== undefined) {
      playPromise.catch(() => {
        // Handled silently if browser blocks audio
      });
    }
  } catch (err) {
    // Audio playback fallback
  }
}

// Check milestones using an array and conditional checks
function checkMilestones() {
  const halfwayGoal = Math.ceil(currentGoal / 2);

  // Condition 1: Reaching the selected goal
  if (currentCans >= currentGoal && !milestonesReached.goal) {
    milestonesReached.goal = true;
    message.textContent = milestoneMessages[1];
  }
  // Condition 2: Halfway to the selected goal
  else if (currentCans >= halfwayGoal && !milestonesReached.halfway && currentCans < currentGoal) {
    milestonesReached.halfway = true;
    message.textContent = milestoneMessages[0];
  }
}

// Handle item clicks: update score immediately and consume item so each counts only once
function collectItem(cell) {
  if (!gameActive) return;

  // Strict deadline check: late clicks cannot add/subtract points
  if (Date.now() >= endTime) {
    endGame();
    return;
  }

  const item = cell.dataset.item;
  if (!item) return;

  // Immediately remove the item from the DOM and dataset to prevent double-counting
  cell.dataset.item = '';
  cell.replaceChildren();
  cell.setAttribute('aria-label', 'Collected square: empty');

  if (item === 'can') {
    currentCans += 1;
    playSound(soundCollect);
    checkMilestones();
  } else if (item === 'obstacle') {
    currentCans -= 1;
  }

  scoreDisplay.textContent = currentCans;
}

// Spawn one yellow can and one obstacle in distinct cells
function spawnWaterCan() {
  if (!gameActive) return;
  if (Date.now() >= endTime) {
    endGame();
    return;
  }

  clearBoard();
  const cells = Array.from(grid.children);

  // Choose a random cell for the yellow water can (+1 pt)
  const canIndex = Math.floor(Math.random() * cells.length);
  const canCell = cells[canIndex];
  canCell.dataset.item = 'can';
  canCell.setAttribute('aria-label', `Square ${canIndex + 1}: collect yellow can, plus 1 point`);

  const canImage = document.createElement('img');
  canImage.src = 'img/water-can-transparent.png';
  canImage.alt = '';
  canImage.className = 'water-can';
  canCell.appendChild(canImage);

  // Choose a distinct random cell for the obstacle (-1 pt)
  const obstacleIndex = (canIndex + 1 + Math.floor(Math.random() * 8)) % 9;
  const obstacleCell = cells[obstacleIndex];
  obstacleCell.dataset.item = 'obstacle';
  obstacleCell.setAttribute('aria-label', `Square ${obstacleIndex + 1}: obstacle, minus 1 point`);
  obstacleCell.innerHTML = '<span class="obstacle" aria-hidden="true"><b>×</b>Obstacle −1</span>';
}

// Update the countdown display each tick
function updateTimer() {
  const secondsLeft = Math.max(0, Math.ceil((endTime - Date.now()) / 1000));
  timerDisplay.textContent = secondsLeft;
  if (secondsLeft === 0) {
    endGame();
  }
}

// Apply selected difficulty rules to UI and game variables
function updateDifficulty(mode) {
  const config = DIFFICULTIES[mode] || DIFFICULTIES.normal;
  currentDifficulty = mode;
  currentGoal = config.goal;
  currentTimeLimit = config.seconds;
  currentSpawnRate = config.spawnRate;

  // Update instructions and rule summaries before game starts
  if (instructionsTitle) {
    instructionsTitle.textContent = `Your ${config.seconds}-second mission`;
  }
  if (instructionsBody) {
    instructionsBody.innerHTML = `Tap the yellow jerry cans for <strong>+1 point</strong> each. Avoid the red <strong>× obstacles (−1 point)</strong>. Score <strong>${config.goal} or more</strong> before time runs out to win!`;
  }
  if (difficultyRules) {
    difficultyRules.innerHTML = `Current mode: <strong>${config.name}</strong> — Collect <strong>${config.goal} points</strong> in <strong>${config.seconds} seconds</strong>`;
  }

  if (goalDisplay) {
    goalDisplay.textContent = currentGoal;
  }
  timerDisplay.textContent = currentTimeLimit;
}

// Start a game round
function startGame() {
  // Prevent duplicate intervals if Start is clicked repeatedly
  if (gameActive) return;

  resetGame();
  gameActive = true;
  startButton.disabled = true;

  // Prevent difficulty changes during an active round
  if (difficultySelect) {
    difficultySelect.disabled = true;
  }

  milestonesReached = { halfway: false, goal: false };
  message.textContent = 'Collect yellow cans. Avoid the red × obstacles!';
  endTime = Date.now() + currentTimeLimit * 1000;

  spawnWaterCan();
  spawnInterval = setInterval(spawnWaterCan, currentSpawnRate);
  countdownInterval = setInterval(updateTimer, 100);

  grid.children[0].focus();
}

// End a round and evaluate win/loss outcome
function endGame() {
  if (!gameActive) return;

  gameActive = false;
  clearTimers();
  clearBoard();
  timerDisplay.textContent = 0;

  // Re-enable difficulty changes after the round ends
  if (difficultySelect) {
    difficultySelect.disabled = false;
  }

  const won = currentCans >= currentGoal;
  const messages = won ? winningMessages : losingMessages;
  const randomMessage = messages[Math.floor(Math.random() * messages.length)];
  message.textContent = `${won ? 'You win!' : 'Time’s up!'} Final score: ${currentCans}. ${randomMessage}`;

  celebration.hidden = !won;
  if (won) {
    playSound(soundWin);
  }

  startButton.disabled = false;
  startButton.textContent = 'Play Again';
  startButton.focus();
}

// Reset the entire game state and restore board to starting screen
function resetGame() {
  clearTimers();
  gameActive = false;
  endTime = 0;
  currentCans = 0;
  milestonesReached = { halfway: false, goal: false };

  scoreDisplay.textContent = 0;
  timerDisplay.textContent = currentTimeLimit;
  if (goalDisplay) {
    goalDisplay.textContent = currentGoal;
  }

  message.textContent = 'Press Start Game when you’re ready.';
  celebration.hidden = true;
  startButton.disabled = false;
  startButton.textContent = 'Start Game';

  // Allow difficulty selection
  if (difficultySelect) {
    difficultySelect.disabled = false;
  }

  clearBoard();
}

// Toggle mute on/off
function toggleMute() {
  isMuted = !isMuted;
  muteButton.textContent = isMuted ? '🔇 Sound: OFF' : '🔊 Sound: ON';
  muteButton.setAttribute('aria-pressed', isMuted ? 'true' : 'false');
  muteButton.setAttribute('aria-label', isMuted ? 'Unmute sound effects' : 'Mute sound effects');
}

// Event Listeners
createGrid();
updateDifficulty('normal');
resetGame();

startButton.addEventListener('click', startGame);
resetButton.addEventListener('click', resetGame);
muteButton.addEventListener('click', toggleMute);

if (difficultySelect) {
  difficultySelect.addEventListener('change', (e) => {
    if (!gameActive) {
      updateDifficulty(e.target.value);
    }
  });
}
