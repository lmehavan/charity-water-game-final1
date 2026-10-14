/**
 * Comprehensive Automated Test Suite for charity: water Water Quest
 */
const fs = require('fs');
const path = require('path');
const assert = require('assert');

console.log('--- Starting charity: water Water Quest Test Suite ---');

// 1. Verify files exist
const htmlPath = path.join(__dirname, 'index.html');
const cssPath = path.join(__dirname, 'style.css');
const jsPath = path.join(__dirname, 'script.js');
const collectAudioPath = path.join(__dirname, 'audio/collect.wav');
const winAudioPath = path.join(__dirname, 'audio/win.wav');
const licensePath = path.join(__dirname, 'audio/LICENSE.txt');

assert(fs.existsSync(htmlPath), 'index.html must exist');
assert(fs.existsSync(cssPath), 'style.css must exist');
assert(fs.existsSync(jsPath), 'script.js must exist');
assert(fs.existsSync(collectAudioPath), 'audio/collect.wav must exist');
assert(fs.existsSync(winAudioPath), 'audio/win.wav must exist');
assert(fs.existsSync(licensePath), 'audio/LICENSE.txt must exist');
console.log('✓ All required files exist');

// 2. Verify HTML structure & charity: water links
const htmlContent = fs.readFileSync(htmlPath, 'utf8');
assert(htmlContent.includes('fonts.googleapis.com'), 'Google fonts must be loaded');
assert(htmlContent.includes('Montserrat'), 'Montserrat font must be loaded');
assert(htmlContent.includes('https://www.charitywater.org/'), 'Link to charitywater.org must exist');
assert(htmlContent.includes('https://www.charitywater.org/donate'), 'Link to charitywater.org/donate must exist');
assert(htmlContent.includes('id="difficulty-select"'), 'Difficulty selector must exist');
assert(htmlContent.includes('id="mute-button"'), 'Mute button must exist');
assert(htmlContent.includes('id="sound-collect"'), 'Audio element for collect must exist');
assert(htmlContent.includes('id="sound-win"'), 'Audio element for win must exist');
console.log('✓ HTML contains all required elements, fonts, audio tags, and charity: water links');

// 3. Verify CSS styling & branding
const cssContent = fs.readFileSync(cssPath, 'utf8');
assert(cssContent.includes('Montserrat'), 'CSS must specify Montserrat font');
assert(cssContent.includes('#ffc907'), 'CSS must use charity: water yellow #ffc907');
assert(cssContent.includes('#163c4a'), 'CSS must use deep blue #163c4a');
assert(cssContent.includes('@media (max-width: 480px)'), 'CSS must have mobile media query');
assert(cssContent.includes('prefers-reduced-motion'), 'CSS must have reduced motion query');
console.log('✓ CSS branding, colors, typography, and responsive styles verified');

// 4. Mock DOM environment to execute and test script.js logic
class MockElement {
  constructor(tagName, id = '', className = '') {
    this.tagName = tagName.toUpperCase();
    this.id = id;
    this.className = className;
    this.children = [];
    this.dataset = {};
    this.attributes = {};
    this.style = {};
    this._textContent = '';
    this.innerHTML = '';
    this.disabled = false;
    this.hidden = false;
    this.eventListeners = {};
    this.currentTime = 0;
    this.playCount = 0;
  }

  set textContent(val) {
    this._textContent = String(val);
  }

  get textContent() {
    return this._textContent;
  }

  appendChild(child) {
    this.children.push(child);
    return child;
  }

  replaceChildren(...newChildren) {
    this.children = [...newChildren];
  }

  setAttribute(name, val) {
    this.attributes[name] = String(val);
  }

  getAttribute(name) {
    return this.attributes[name] || null;
  }

  addEventListener(event, handler) {
    if (!this.eventListeners[event]) this.eventListeners[event] = [];
    this.eventListeners[event].push(handler);
  }

  dispatchEvent(event) {
    const handlers = this.eventListeners[event.type || event] || [];
    for (const h of handlers) h(event);
  }

  click() {
    this.dispatchEvent({ type: 'click', target: this });
  }

  focus() {}

  play() {
    this.playCount++;
    return Promise.resolve();
  }
}

const elements = {
  grid: new MockElement('div', '', 'game-grid'),
  scoreDisplay: new MockElement('strong', 'current-cans'),
  goalDisplay: new MockElement('strong', 'goal-cans'),
  timerDisplay: new MockElement('span', 'timer'),
  message: new MockElement('p', 'achievements'),
  startButton: new MockElement('button', 'start-game'),
  resetButton: new MockElement('button', 'reset-game'),
  celebration: new MockElement('div', 'celebration'),
  difficultySelect: new MockElement('select', 'difficulty-select'),
  difficultyRules: new MockElement('p', 'difficulty-rules'),
  instructionsTitle: new MockElement('h2', 'instructions-title'),
  instructionsBody: new MockElement('p', 'instructions-body'),
  muteButton: new MockElement('button', 'mute-button'),
  soundCollect: new MockElement('audio', 'sound-collect'),
  soundWin: new MockElement('audio', 'sound-win'),
};
elements.difficultySelect.value = 'normal';
elements.muteButton.textContent = '🔊 Sound: ON';
elements.muteButton.setAttribute('aria-pressed', 'false');
elements.startButton.textContent = 'Start Game';
elements.resetButton.textContent = 'Reset';

// Setup fake window / document environment
const mockDocument = {
  querySelector(selector) {
    if (selector === '.game-grid') return elements.grid;
    return null;
  },
  getElementById(id) {
    return elements[id] || Object.values(elements).find(el => el.id === id) || null;
  },
  createElement(tag) {
    return new MockElement(tag);
  }
};

let fakeNow = 100000;
global.Date.now = () => fakeNow;
global.document = mockDocument;

// Intercept setInterval & clearInterval
let intervalIdCounter = 1;
const activeIntervals = new Map();
global.setInterval = (fn, delay) => {
  const id = intervalIdCounter++;
  activeIntervals.set(id, { fn, delay });
  return id;
};
global.clearInterval = (id) => {
  activeIntervals.delete(id);
};

// Load script.js in this sandbox
const scriptCode = fs.readFileSync(jsPath, 'utf8');
eval(scriptCode);

console.log('✓ script.js loaded into sandbox without errors');

// Test 5: Verify Initial State
assert.strictEqual(elements.grid.children.length, 9, 'Grid should have 9 cells created');
assert.strictEqual(elements.scoreDisplay.textContent, '0', 'Initial score should be 0');
assert.strictEqual(elements.goalDisplay.textContent, '20', 'Initial goal should be 20 for Normal');
assert.strictEqual(elements.timerDisplay.textContent, '30', 'Initial time should be 30 for Normal');
assert.strictEqual(elements.difficultySelect.disabled, false, 'Difficulty select should be enabled initially');
assert.strictEqual(elements.muteButton.textContent.includes('ON'), true, 'Sound should be ON initially');
assert.strictEqual(elements.soundCollect.playCount, 0, 'No sound should autoplay on load');
assert.strictEqual(elements.soundWin.playCount, 0, 'No win sound on load');
console.log('✓ Initial game state and DOM setup verified');

// Test 6: Difficulty Mode Switching Before Start
// Switch to Easy
elements.difficultySelect.value = 'easy';
elements.difficultySelect.dispatchEvent({ type: 'change', target: elements.difficultySelect });
assert.strictEqual(elements.goalDisplay.textContent, '15', 'Easy goal should be 15');
assert.strictEqual(elements.timerDisplay.textContent, '40', 'Easy time should be 40s');
assert(elements.instructionsTitle.textContent.includes('40-second'), 'Instructions title should update to 40-second');
assert(elements.instructionsBody.innerHTML.includes('15 or more'), 'Instructions body should state score 15 or more');
assert(elements.difficultyRules.innerHTML.includes('Easy') && elements.difficultyRules.innerHTML.includes('15 points'), 'Rules banner should show Easy rules');

// Switch to Hard
elements.difficultySelect.value = 'hard';
elements.difficultySelect.dispatchEvent({ type: 'change', target: elements.difficultySelect });
assert.strictEqual(elements.goalDisplay.textContent, '25', 'Hard goal should be 25');
assert.strictEqual(elements.timerDisplay.textContent, '25', 'Hard time should be 25s');
assert(elements.instructionsTitle.textContent.includes('25-second'), 'Instructions title should update to 25-second');
assert(elements.instructionsBody.innerHTML.includes('25 or more'), 'Instructions body should state score 25 or more');
assert(elements.difficultyRules.innerHTML.includes('Hard') && elements.difficultyRules.innerHTML.includes('25 points'), 'Rules banner should show Hard rules');

// Switch back to Normal
elements.difficultySelect.value = 'normal';
elements.difficultySelect.dispatchEvent({ type: 'change', target: elements.difficultySelect });
assert.strictEqual(elements.goalDisplay.textContent, '20', 'Normal goal should be 20');
assert.strictEqual(elements.timerDisplay.textContent, '30', 'Normal time should be 30s');
console.log('✓ Difficulty selection and dynamic rule updates verified for Easy, Normal, and Hard');

// Test 7: Starting the Game & Locking Difficulty
elements.startButton.click();
assert.strictEqual(elements.difficultySelect.disabled, true, 'Difficulty selection MUST be disabled during round');
assert.strictEqual(elements.startButton.disabled, true, 'Start button MUST be disabled during round');
assert.strictEqual(activeIntervals.size, 2, 'Two intervals (spawn and countdown) should be active');

// Verify attempting to change difficulty during active round is blocked
elements.difficultySelect.value = 'easy';
elements.difficultySelect.dispatchEvent({ type: 'change', target: elements.difficultySelect });
assert.strictEqual(elements.goalDisplay.textContent, '20', 'Goal must not change while game is active');

// Verify repeated start clicks do NOT create duplicate timers
const intervalCount = activeIntervals.size;
elements.startButton.click();
elements.startButton.click();
assert.strictEqual(activeIntervals.size, intervalCount, 'Repeated starts must not create duplicate timers');
console.log('✓ Start game mechanics, timer safety, and difficulty locking verified');

// Test 8: Scoring & Reliable DOM Item Consumption
const canCell = elements.grid.children.find(c => c.dataset.item === 'can');
const obstacleCell = elements.grid.children.find(c => c.dataset.item === 'obstacle');
assert(canCell, 'Grid must have a cell with yellow can');
assert(obstacleCell, 'Grid must have a cell with obstacle');

// Click yellow can
const collectPlayBefore = elements.soundCollect.playCount;
canCell.click();
assert.strictEqual(elements.scoreDisplay.textContent, '1', 'Score must increase to 1 after collecting can');
assert.strictEqual(canCell.dataset.item, '', 'Collected can item must be cleared immediately from dataset');
assert.strictEqual(canCell.children.length, 0, 'Collected can element must be removed immediately from DOM');
assert.strictEqual(elements.soundCollect.playCount, collectPlayBefore + 1, 'Collect sound must play on can collection');

// Click again on same cell (double click test)
canCell.click();
assert.strictEqual(elements.scoreDisplay.textContent, '1', 'Second click on consumed can must NOT change score');

// Click obstacle
obstacleCell.click();
assert.strictEqual(elements.scoreDisplay.textContent, '0', 'Score must decrease by 1 after clicking obstacle');
assert.strictEqual(obstacleCell.dataset.item, '', 'Collected obstacle item must be cleared immediately from dataset');
assert.strictEqual(obstacleCell.children.length, 0, 'Collected obstacle element must be removed immediately from DOM');

// Click again on same obstacle cell
obstacleCell.click();
assert.strictEqual(elements.scoreDisplay.textContent, '0', 'Second click on consumed obstacle must NOT decrease score again');
console.log('✓ Reliable DOM item disappearance and single-point counting verified');

// Test 9: Milestones Check
// On Normal (goal 20), halfway is 10. Let's score up to 10.
for (let score = 1; score <= 10; score++) {
  // Simulate spawn
  const cell = elements.grid.children[0];
  cell.dataset.item = 'can';
  cell.click();
}
assert.strictEqual(elements.scoreDisplay.textContent, '10', 'Score should now be 10');
assert(elements.message.textContent.includes('Halfway there'), `Message should trigger halfway milestone. Found: ${elements.message.textContent}`);

// Score up to 20 (Goal reached)
for (let score = 11; score <= 20; score++) {
  const cell = elements.grid.children[0];
  cell.dataset.item = 'can';
  cell.click();
}
assert.strictEqual(elements.scoreDisplay.textContent, '20', 'Score should now be 20');
assert(elements.message.textContent.includes('Goal reached'), `Message should trigger goal reached milestone. Found: ${elements.message.textContent}`);
console.log('✓ Halfway and goal reached milestone messages verified');

// Test 10: Reset During Play
elements.resetButton.click();
assert.strictEqual(activeIntervals.size, 0, 'Reset must clear all active timers');
assert.strictEqual(elements.scoreDisplay.textContent, '0', 'Reset must restore score to 0');
assert.strictEqual(elements.timerDisplay.textContent, '30', 'Reset must restore timer to current limit (30s)');
assert.strictEqual(elements.startButton.disabled, false, 'Reset must re-enable Start button');
assert.strictEqual(elements.difficultySelect.disabled, false, 'Reset must re-enable difficulty select');
assert.strictEqual(elements.celebration.hidden, true, 'Celebration must be hidden on reset');
console.log('✓ Reset during play verified (clears timers, restores board and controls)');

// Test 11: Timer Expiration & Loss Outcome
// Switch to Easy: goal 15, time 40s
elements.difficultySelect.value = 'easy';
elements.difficultySelect.dispatchEvent({ type: 'change', target: elements.difficultySelect });
elements.startButton.click();
assert.strictEqual(elements.timerDisplay.textContent, '40');

// Collect 5 cans only (below goal of 15)
for (let i = 0; i < 5; i++) {
  const cell = elements.grid.children[0];
  cell.dataset.item = 'can';
  cell.click();
}
assert.strictEqual(elements.scoreDisplay.textContent, '5');

// Advance time past 40 seconds
fakeNow += 41000;
// Run the countdown timer tick
const countdownTask = Array.from(activeIntervals.values()).find(t => t.delay === 100);
countdownTask.fn();

assert.strictEqual(activeIntervals.size, 0, 'Timer expiration must clear all timers');
assert.strictEqual(elements.timerDisplay.textContent, '0', 'Timer must display 0');
assert(elements.message.textContent.includes('Time’s up!'), 'Losing message must show "Time’s up!"');
assert.strictEqual(elements.celebration.hidden, true, 'Celebration must remain hidden on loss');
assert.strictEqual(elements.difficultySelect.disabled, false, 'Difficulty selection must unlock after game ends');

// Attempt to score after time expiration
const testCell = elements.grid.children[0];
testCell.dataset.item = 'can';
testCell.click();
assert.strictEqual(elements.scoreDisplay.textContent, '5', 'Scoring must strictly halt after timer expires');
console.log('✓ Timer expiration, scoring cutoff, and loss outcome verified');

// Test 12: Win Outcome & Victory Sound
elements.startButton.click(); // starts new game with Easy (goal 15)
assert.strictEqual(elements.scoreDisplay.textContent, '0');

for (let i = 0; i < 15; i++) {
  const cell = elements.grid.children[0];
  cell.dataset.item = 'can';
  cell.click();
}
assert.strictEqual(elements.scoreDisplay.textContent, '15');

const winSoundPlayBefore = elements.soundWin.playCount;
// Advance time to expiration
fakeNow += 41000;
const countdownTaskWin = Array.from(activeIntervals.values()).find(t => t.delay === 100);
countdownTaskWin.fn();

assert.strictEqual(elements.celebration.hidden, false, 'Celebration must be visible on win');
assert(elements.message.textContent.includes('You win!'), 'Winning message must show "You win!"');
assert.strictEqual(elements.soundWin.playCount, winSoundPlayBefore + 1, 'Win sound must play on victory');
console.log('✓ Win outcome, celebration display, and win sound verified');

// Test 13: Mute Controls
const muteBtn = elements.muteButton;
assert.strictEqual(muteBtn.getAttribute('aria-pressed'), 'false');
// Toggle Mute ON
muteBtn.click();
assert.strictEqual(muteBtn.getAttribute('aria-pressed'), 'true');
assert(muteBtn.textContent.includes('OFF'), 'Button text should indicate Sound OFF');

// Start game while muted and collect can
elements.startButton.click();
const collectSoundBeforeMuteTest = elements.soundCollect.playCount;
const canCellMuted = elements.grid.children[0];
canCellMuted.dataset.item = 'can';
canCellMuted.click();
assert.strictEqual(elements.soundCollect.playCount, collectSoundBeforeMuteTest, 'Sound must NOT play when muted');

// Win while muted
for (let i = 0; i < 15; i++) {
  const cell = elements.grid.children[0];
  cell.dataset.item = 'can';
  cell.click();
}
const winSoundBeforeMuteTest = elements.soundWin.playCount;
fakeNow += 41000;
const ctTask = Array.from(activeIntervals.values()).find(t => t.delay === 100);
ctTask.fn();
assert.strictEqual(elements.soundWin.playCount, winSoundBeforeMuteTest, 'Win sound must NOT play when muted');

// Unmute
muteBtn.click();
assert.strictEqual(muteBtn.getAttribute('aria-pressed'), 'false');
assert(muteBtn.textContent.includes('ON'), 'Button text should indicate Sound ON');
console.log('✓ Mute button functionality and sound suppression verified');

console.log('\n--- ALL AUTOMATED TESTS PASSED SUCCESSFULLY! ---');
