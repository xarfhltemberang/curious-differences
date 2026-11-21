// Boot and the one loop: input is drained every frame, the game advances in
// real time, and the renderer paints what is there. Clicks first ask the
// renderer which button they landed on, then the game whether they found a
// difference. The game moves between six screens: title, play, paused,
// level-clear, game-over and victory.
//
// ?seed=N is accepted for parity with the kit's starter but the scenes are
// drawn deterministically, so it changes nothing. ?shot=play|start|shop|end
// stages that scene instead of running the loop, paints it twice and sets
// window.__shotReady for a screenshot.

import { BEST_KEY } from './config.js';
import { createSoundBank } from './audio.js';
import { createGame, EVENT_FOUND, EVENT_GAME_OVER, EVENT_LEVEL_CLEAR, EVENT_WRONG, SCREEN_GAME_OVER, SCREEN_LEVEL_CLEAR, SCREEN_PAUSED, SCREEN_PLAY, SCREEN_TITLE, SCREEN_VICTORY } from './game.js';
import { ACTION_CONFIRM, ACTION_HINT, ACTION_MUTE, ACTION_NEXT, ACTION_PAUSE, createInput } from './input.js';
import { createRenderer, hitButton } from './render.js';
import { stageShot } from './shots.js';

const MAX_FRAME = 0.25;

const params = new URLSearchParams(window.location.search);
const shot = params.get('shot');

const canvas = document.getElementById('game');
const status = document.getElementById('status');
const sounds = createSoundBank();
const game = createGame(sounds);
const renderer = createRenderer(canvas);
// A handle for automated play-testing; harmless in the shipped game.
window.__spotGame = game;

function readBest() {
  try {
    return Number.parseInt(window.localStorage.getItem(BEST_KEY) ?? '0', 10) || 0;
  } catch {
    return 0;
  }
}

function saveBest(value) {
  try {
    window.localStorage.setItem(BEST_KEY, String(value));
  } catch {
    // Storage can be off (private windows): the best score then lasts this visit only.
  }
}

game.setBest(readBest());

function runShot(name) {
  stageShot(name, game);
  let painted = 0;
  function paint() {
    renderer.draw(game, { usingKeyboard: false, crosshair: { x: 0, y: 0 } }, sounds);
    painted += 1;
    if (painted < 2) requestAnimationFrame(paint);
    else window.__shotReady = true;
  }
  requestAnimationFrame(paint);
}

function runGame() {
  const input = createInput(canvas);
  let last = performance.now();

  function announce(message) {
    status.textContent = message;
  }

  function saveBestIfBeaten() {
    if (game.state.totalScore > game.state.best) {
      game.setBest(game.state.totalScore);
      saveBest(game.state.best);
    }
  }

  function handleButtonClick(point) {
    const button = hitButton(point, game.screen);
    if (!button) return false;
    sounds.unlock();
    sounds.click();
    if (button === 'start' || button === 'again') game.startGame();
    else if (button.startsWith('level-')) game.startLevel(Number(button.slice(6)));
    else if (button === 'hint') game.useHint();
    else if (button === 'pause') game.pause();
    else if (button === 'mute') sounds.toggleMute();
    else if (button === 'resume') game.resume();
    else if (button === 'next') game.nextLevel();
    else if (button === 'retry') game.retryLevel();
    else if (button === 'title') game.backToTitle();
    return true;
  }

  function handleActions() {
    const actions = input.takeActions();
    if (!actions) return;
    sounds.unlock();
    if (actions & ACTION_MUTE) sounds.toggleMute();
    if (actions & ACTION_HINT) game.useHint();
    if (actions & ACTION_PAUSE) {
      if (game.screen === SCREEN_PLAY) game.pause();
      else if (game.screen === SCREEN_PAUSED) game.resume();
    }
    if (actions & ACTION_NEXT && game.screen === SCREEN_LEVEL_CLEAR) game.nextLevel();
    if (actions & ACTION_CONFIRM) {
      if (game.screen === SCREEN_TITLE) game.startGame();
      else if (game.screen === SCREEN_LEVEL_CLEAR) game.nextLevel();
      else if (game.screen === SCREEN_GAME_OVER) game.retryLevel();
      else if (game.screen === SCREEN_VICTORY) game.startGame();
      else if (game.screen === SCREEN_PAUSED) game.resume();
      else if (game.screen === SCREEN_PLAY) game.markCrosshair(input.crosshair);
    }
  }

  function handleClicks() {
    for (const point of input.takeClicks()) {
      sounds.unlock();
      if (handleButtonClick(point)) continue;
      if (game.screen !== SCREEN_PLAY) continue;
      const event = game.handleClick(point);
      if (event === EVENT_FOUND) announce(`Found! ${game.foundCount} of ${game.level.diffs.length}.`);
      else if (event === EVENT_WRONG) announce('Not a difference. Five seconds lost.');
      else if (event === EVENT_LEVEL_CLEAR) announce(`${game.level.name} cleared!`);
    }
  }

  function frame(now) {
    requestAnimationFrame(frame);
    const dt = Math.min((now - last) / 1000, MAX_FRAME);
    last = now;
    handleActions();
    handleClicks();
    const event = game.update(dt);
    if (event === EVENT_GAME_OVER) announce(`Out of time! You found ${game.foundCount} of ${game.level.diffs.length}.`);
    if (game.screen === SCREEN_VICTORY) saveBestIfBeaten();
    renderer.draw(game, input, sounds);
  }

  document.addEventListener('visibilitychange', () => {
    if (document.hidden && game.screen === SCREEN_PLAY) game.pause();
  });

  announce('Curious Differences. Press Enter or click to start. Find the differences between the two pictures.');
  requestAnimationFrame(frame);
}

if (shot) runShot(shot);
else runGame();
