// The game itself: one state machine over the screens title, play, paused,
// level-clear, game-over and victory. It owns the timer, the score, the
// streak, the hints and which differences are found, and it answers the one
// question the renderer and the screenshots need: what is on screen now?
//
// A click on either picture at a difference's spot finds it on both. A click
// on nothing costs points and five seconds. A hint pulses one unfound
// difference for three seconds and costs points. Clearing a level banks a
// time bonus; running out of time ends the run.

import {
  HINTS_PER_LEVEL,
  LOW_TIME_SECONDS,
  POINTS,
  STAR_THRESHOLDS,
} from './config.js';
import { LEVELS, LEVEL_COUNT } from './scenes.js';
import { toPanelCoords } from './input.js';

export const SCREEN_TITLE = 'title';
export const SCREEN_PLAY = 'play';
export const SCREEN_PAUSED = 'paused';
export const SCREEN_LEVEL_CLEAR = 'level-clear';
export const SCREEN_GAME_OVER = 'game-over';
export const SCREEN_VICTORY = 'victory';

export const EVENT_NONE = 0;
export const EVENT_FOUND = 1;
export const EVENT_WRONG = 2;
export const EVENT_LEVEL_CLEAR = 4;
export const EVENT_GAME_OVER = 8;
export const EVENT_TICK = 16;

export function starsForLevel(timeLeft, timeLimit) {
  const share = timeLeft / timeLimit;
  if (share >= STAR_THRESHOLDS.three) return 3;
  if (share >= STAR_THRESHOLDS.two) return 2;
  return 1;
}

export function createGame(sounds) {
  const state = {
    screen: SCREEN_TITLE,
    levelIndex: 0,
    found: new Set(),
    score: 0,
    totalScore: 0,
    streak: 0,
    wrongStreak: 0,
    hintsLeft: HINTS_PER_LEVEL,
    hint: null, // { diff, until } while a hint pulse is showing
    timeLeft: LEVELS[0].timeLimit,
    timeLimit: LEVELS[0].timeLimit,
    levelScores: [],
    levelStars: [],
    best: 0,
    lastTickSecond: -1,
    message: '',
    messageUntil: 0,
    wrongFlash: null, // { x, y, until } where a wrong click landed
    foundFlash: null, // { diff, until } for the newest find's pop
    now: 0,
  };

  function level() {
    return LEVELS[state.levelIndex];
  }

  function showMessage(text, seconds) {
    state.message = text;
    state.messageUntil = state.now + seconds;
  }

  function startLevel(index) {
    const next = LEVELS[index];
    state.levelIndex = index;
    state.found = new Set();
    state.score = 0;
    state.streak = 0;
    state.wrongStreak = 0;
    state.hintsLeft = HINTS_PER_LEVEL;
    state.hint = null;
    state.timeLeft = next.timeLimit;
    state.timeLimit = next.timeLimit;
    state.lastTickSecond = -1;
    state.wrongFlash = null;
    state.foundFlash = null;
    state.screen = SCREEN_PLAY;
    showMessage(`${next.name} — find ${next.diffs.length} differences!`, 2.5);
  }

  function finishLevel() {
    const timeBonus = Math.ceil(state.timeLeft) * POINTS.timeBonusPerSecond;
    const levelScore = state.score + timeBonus;
    const stars = starsForLevel(state.timeLeft, state.timeLimit);
    state.levelScores[state.levelIndex] = levelScore;
    state.levelStars[state.levelIndex] = stars;
    state.totalScore += levelScore;
    state.screen = SCREEN_LEVEL_CLEAR;
    sounds.levelClear();
    return { timeBonus, levelScore, stars };
  }

  function endRun() {
    state.screen = SCREEN_GAME_OVER;
    sounds.wrong();
  }

  function findDifference(diff) {
    state.found.add(diff.id);
    state.streak += 1;
    state.wrongStreak = 0;
    const gained = POINTS.find + (state.streak - 1) * POINTS.streakBonus;
    state.score += gained;
    state.foundFlash = { diff, until: state.now + 0.6 };
    sounds.found();
    showMessage(`${diff.label}! +${gained}`, 1.6);
    if (state.found.size === level().diffs.length) {
      finishLevel();
      return EVENT_LEVEL_CLEAR;
    }
    return EVENT_FOUND;
  }

  function markAt(panelPoint) {
    const already = level().diffs.find(
      (diff) => state.found.has(diff.id) && Math.hypot(panelPoint.x - diff.x, panelPoint.y - diff.y) <= Math.max(diff.r, 26),
    );
    if (already) {
      showMessage('You already found that one!', 1.2);
      return EVENT_NONE;
    }
    const found = level().diffs.find(
      (diff) => !state.found.has(diff.id) && Math.hypot(panelPoint.x - diff.x, panelPoint.y - diff.y) <= Math.max(diff.r, 26),
    );
    if (found) {
      return findDifference(found);
    }
    state.score = Math.max(0, state.score - POINTS.wrongClick);
    state.timeLeft = Math.max(0, state.timeLeft - POINTS.wrongTimePenalty);
    state.streak = 0;
    state.wrongStreak += 1;
    state.wrongFlash = { panel: panelPoint.panel, x: panelPoint.x, y: panelPoint.y, until: state.now + 0.5 };
    sounds.wrong();
    showMessage('Not a difference — 5 seconds lost!', 1.4);
    return EVENT_WRONG;
  }

  function useHint() {
    if (state.screen !== SCREEN_PLAY) return false;
    const unfound = level().diffs.filter((diff) => !state.found.has(diff.id));
    if (unfound.length === 0 || state.hintsLeft <= 0) return false;
    state.hintsLeft -= 1;
    state.score = Math.max(0, state.score - POINTS.hintCost);
    state.hint = { diff: unfound[0], until: state.now + 3 };
    sounds.hint();
    showMessage('Hint: look where the ring is pulsing!', 2);
    return true;
  }

  function handleClick(point) {
    if (state.screen !== SCREEN_PLAY) return EVENT_NONE;
    const panelPoint = toPanelCoords(point.x, point.y);
    if (!panelPoint) return EVENT_NONE;
    return markAt(panelPoint);
  }

  function update(dt) {
    state.now += dt;
    if (state.screen !== SCREEN_PLAY) return EVENT_NONE;
    state.timeLeft -= dt;
    const whole = Math.ceil(state.timeLeft);
    if (state.timeLeft <= LOW_TIME_SECONDS && whole !== state.lastTickSecond && state.timeLeft > 0) {
      state.lastTickSecond = whole;
      sounds.tick();
      return EVENT_TICK;
    }
    if (state.timeLeft <= 0) {
      state.timeLeft = 0;
      endRun();
      return EVENT_GAME_OVER;
    }
    return EVENT_NONE;
  }

  return {
    state,

    get level() {
      return level();
    },

    get screen() {
      return state.screen;
    },

    get foundCount() {
      return state.found.size;
    },

    get remainingCount() {
      return level().diffs.length - state.found.size;
    },

    startLevel,
    useHint,
    handleClick,
    update,

    startGame() {
      state.totalScore = 0;
      state.levelScores = [];
      state.levelStars = [];
      startLevel(0);
    },

    nextLevel() {
      if (state.levelIndex + 1 < LEVEL_COUNT) startLevel(state.levelIndex + 1);
      else {
        state.screen = SCREEN_VICTORY;
        sounds.victory();
      }
    },

    retryLevel() {
      startLevel(state.levelIndex);
    },

    backToTitle() {
      state.screen = SCREEN_TITLE;
      state.levelIndex = 0;
      state.found = new Set();
      state.score = 0;
      state.totalScore = 0;
      state.levelScores = [];
      state.levelStars = [];
      state.hint = null;
    },

    pause() {
      if (state.screen === SCREEN_PLAY) state.screen = SCREEN_PAUSED;
    },

    resume() {
      if (state.screen === SCREEN_PAUSED) state.screen = SCREEN_PLAY;
    },

    setBest(value) {
      state.best = value;
    },

    isFound(diff) {
      return state.found.has(diff.id);
    },

    /** Panel-local point of the crosshair, for keyboard marking. */
    markCrosshair(crosshair) {
      if (state.screen !== SCREEN_PLAY) return EVENT_NONE;
      const panelPoint = toPanelCoords(crosshair.x, crosshair.y);
      if (!panelPoint) return EVENT_NONE;
      return markAt(panelPoint);
    },
  };
}
