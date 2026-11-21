// Mouse and keyboard input. Clicks are reported in logical field pixels
// (1280x720), already scaled from the window, and the keyboard drives a
// crosshair so the game is fully playable without a mouse. Actions are
// collected as a bitmask the game loop drains once a frame.

import { FIELD, PANEL_H, PANEL_LEFT_X, PANEL_RIGHT_X, PANEL_W, PANEL_Y } from './config.js';

export const ACTION_CONFIRM = 1;
export const ACTION_PAUSE = 2;
export const ACTION_HINT = 4;
export const ACTION_MUTE = 8;
export const ACTION_NEXT = 16;

const KEY_ACTIONS = {
  Enter: ACTION_CONFIRM,
  ' ': ACTION_CONFIRM,
  p: ACTION_PAUSE,
  P: ACTION_PAUSE,
  Escape: ACTION_PAUSE,
  h: ACTION_HINT,
  H: ACTION_HINT,
  m: ACTION_MUTE,
  M: ACTION_MUTE,
  n: ACTION_NEXT,
  N: ACTION_NEXT,
};

/** Which panel, if any, a logical point falls in: 'left', 'right' or null. */
export function panelAt(x, y) {
  if (y < PANEL_Y || y > PANEL_Y + PANEL_H) return null;
  if (x >= PANEL_LEFT_X && x <= PANEL_LEFT_X + PANEL_W) return 'left';
  if (x >= PANEL_RIGHT_X && x <= PANEL_RIGHT_X + PANEL_W) return 'right';
  return null;
}

/** Convert a logical field point to panel-local coordinates (0..600, 0..440). */
export function toPanelCoords(x, y) {
  const panel = panelAt(x, y);
  if (!panel) return null;
  const originX = panel === 'left' ? PANEL_LEFT_X : PANEL_RIGHT_X;
  return { panel, x: x - originX, y: y - PANEL_Y };
}

export function createInput(canvas) {
  let actions = 0;
  let clicks = [];
  let mouse = { x: FIELD.width / 2, y: FIELD.height / 2, inside: false };
  // The keyboard crosshair starts in the middle of the left picture.
  let crosshair = { x: PANEL_LEFT_X + PANEL_W / 2, y: PANEL_Y + PANEL_H / 2 };
  let usingKeyboard = false;

  function toLogical(event) {
    const rect = canvas.getBoundingClientRect();
    return {
      x: ((event.clientX - rect.left) / rect.width) * FIELD.width,
      y: ((event.clientY - rect.top) / rect.height) * FIELD.height,
    };
  }

  canvas.addEventListener('pointermove', (event) => {
    const point = toLogical(event);
    mouse = { x: point.x, y: point.y, inside: true };
    usingKeyboard = false;
  });

  canvas.addEventListener('pointerdown', (event) => {
    const point = toLogical(event);
    mouse = { x: point.x, y: point.y, inside: true };
    usingKeyboard = false;
    clicks.push(point);
  });

  canvas.addEventListener('pointerleave', () => {
    mouse.inside = false;
  });

  window.addEventListener('keydown', (event) => {
    const action = KEY_ACTIONS[event.key];
    if (action !== undefined) {
      actions |= action;
      usingKeyboard = true;
      if (event.key === ' ' || event.key === 'Enter') event.preventDefault();
      return;
    }
    const step = event.shiftKey ? 24 : 8;
    if (event.key === 'ArrowLeft') { crosshair.x = Math.max(0, crosshair.x - step); usingKeyboard = true; event.preventDefault(); }
    if (event.key === 'ArrowRight') { crosshair.x = Math.min(FIELD.width, crosshair.x + step); usingKeyboard = true; event.preventDefault(); }
    if (event.key === 'ArrowUp') { crosshair.y = Math.max(0, crosshair.y - step); usingKeyboard = true; event.preventDefault(); }
    if (event.key === 'ArrowDown') { crosshair.y = Math.min(FIELD.height, crosshair.y + step); usingKeyboard = true; event.preventDefault(); }
  });

  return {
    get mouse() {
      return mouse;
    },
    get crosshair() {
      return crosshair;
    },
    get usingKeyboard() {
      return usingKeyboard;
    },

    /** The clicks since the last call, as logical field points. */
    takeClicks() {
      const taken = clicks;
      clicks = [];
      return taken;
    },

    /** The actions since the last call, as a bitmask. */
    takeActions() {
      const taken = actions;
      actions = 0;
      return taken;
    },

    /** Move the crosshair to a point (used by tests and the hint pulse). */
    moveCrosshairTo(x, y) {
      crosshair = { x, y };
    },
  };
}
