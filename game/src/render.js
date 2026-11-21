// Everything the player sees: the header (title, timer, score, counter), the
// two picture panels with their markers, the footer (hint, pause, sound) and
// the overlay screens (title, paused, level-clear, game-over, victory).
// Buttons are plain rectangles this file names, so the boot code can ask
// which one a click landed on.

import {
  FIELD,
  FONT,
  FONT_DISPLAY,
  LOW_TIME_SECONDS,
  PALETTE,
  PANEL_H,
  PANEL_LEFT_X,
  PANEL_RIGHT_X,
  PANEL_W,
  PANEL_Y,
  POINTS,
} from './config.js';
import { LEVELS, LEVEL_COUNT } from './scenes.js';
import {
  SCREEN_GAME_OVER,
  SCREEN_LEVEL_CLEAR,
  SCREEN_PAUSED,
  SCREEN_PLAY,
  SCREEN_TITLE,
  SCREEN_VICTORY,
} from './game.js';
import { circle, fillRoundRect, line, star } from './draw.js';

export const BUTTONS = {
  hint: { x: 20, y: 560, w: 190, h: 46 },
  pause: { x: 222, y: 560, w: 120, h: 46 },
  mute: { x: 354, y: 560, w: 130, h: 46 },
  start: { x: 520, y: 520, w: 240, h: 52 },
  resume: { x: 530, y: 400, w: 220, h: 50 },
  next: { x: 530, y: 430, w: 220, h: 50 },
  retry: { x: 460, y: 430, w: 170, h: 50 },
  again: { x: 530, y: 470, w: 220, h: 50 },
  toTitlePause: { x: 530, y: 462, w: 220, h: 50 },
  toTitleOver: { x: 650, y: 430, w: 170, h: 50 },
  toTitleVictory: { x: 530, y: 532, w: 220, h: 50 },
};

function pointInRect(point, rect) {
  return point.x >= rect.x && point.x <= rect.x + rect.w && point.y >= rect.y && point.y <= rect.y + rect.h;
}

/** Which named button, if any, a logical point falls on, for this screen. */
export function hitButton(point, screen) {
  if (screen === SCREEN_PLAY) {
    if (pointInRect(point, BUTTONS.hint)) return 'hint';
    if (pointInRect(point, BUTTONS.pause)) return 'pause';
    if (pointInRect(point, BUTTONS.mute)) return 'mute';
    return null;
  }
  if (screen === SCREEN_TITLE) {
    if (pointInRect(point, BUTTONS.start)) return 'start';
    for (let i = 0; i < LEVEL_COUNT; i += 1) {
      const card = { x: 270, y: 268 + i * 74, w: 740, h: 62 };
      if (pointInRect(point, card)) return `level-${i}`;
    }
    return null;
  }
  if (screen === SCREEN_PAUSED) {
    if (pointInRect(point, BUTTONS.resume)) return 'resume';
    if (pointInRect(point, BUTTONS.toTitlePause)) return 'title';
    return null;
  }
  if (screen === SCREEN_LEVEL_CLEAR) {
    if (pointInRect(point, BUTTONS.next)) return 'next';
    return null;
  }
  if (screen === SCREEN_GAME_OVER) {
    if (pointInRect(point, BUTTONS.retry)) return 'retry';
    if (pointInRect(point, BUTTONS.toTitleOver)) return 'title';
    return null;
  }
  if (screen === SCREEN_VICTORY) {
    if (pointInRect(point, BUTTONS.again)) return 'again';
    if (pointInRect(point, BUTTONS.toTitleVictory)) return 'title';
    return null;
  }
  return null;
}

function formatTime(seconds) {
  const total = Math.max(0, Math.ceil(seconds));
  return `${Math.floor(total / 60)}:${String(total % 60).padStart(2, '0')}`;
}

function drawButton(ctx, rect, label, enabled, fill) {
  ctx.save();
  if (!enabled) ctx.globalAlpha = 0.45;
  fillRoundRect(ctx, rect.x, rect.y, rect.w, rect.h, 12, fill, PALETTE.header, 2);
  ctx.fillStyle = '#fff8e7';
  ctx.font = `bold 17px ${FONT}`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(label, rect.x + rect.w / 2, rect.y + rect.h / 2 + 1);
  ctx.restore();
}

function drawHeader(ctx, game) {
  const state = game.state;
  ctx.fillStyle = PALETTE.header;
  ctx.fillRect(0, 0, FIELD.width, 76);
  ctx.textBaseline = 'alphabetic';

  ctx.fillStyle = PALETTE.headerText;
  ctx.font = `bold 28px ${FONT_DISPLAY}`;
  ctx.textAlign = 'left';
  ctx.fillText('Curious Differences', 24, 32);
  ctx.fillStyle = PALETTE.headerMuted;
  ctx.font = `15px ${FONT}`;
  const level = LEVELS[state.levelIndex];
  ctx.fillText(`Level ${state.levelIndex + 1} of ${LEVEL_COUNT} · ${level.name}`, 24, 58);

  // Timer, centred.
  const low = state.timeLeft <= LOW_TIME_SECONDS && state.screen === SCREEN_PLAY;
  ctx.fillStyle = PALETTE.headerMuted;
  ctx.font = `bold 12px ${FONT}`;
  ctx.textAlign = 'center';
  ctx.fillText('TIME LEFT', 640, 24);
  ctx.fillStyle = low ? PALETTE.timerLow : PALETTE.headerText;
  ctx.font = `bold 26px ${FONT_DISPLAY}`;
  ctx.fillText(formatTime(state.timeLeft), 640, 52);
  const barWidth = 220;
  const share = Math.max(0, state.timeLeft / state.timeLimit);
  ctx.fillStyle = 'rgba(255,255,255,0.2)';
  ctx.fillRect(640 - barWidth / 2, 60, barWidth, 8);
  ctx.fillStyle = low ? PALETTE.timerLow : PALETTE.timerFull;
  ctx.fillRect(640 - barWidth / 2, 60, barWidth * share, 8);

  // Score and counter, right. Once a level is cleared its score is banked
  // into the total, so the header shows the total alone on those screens.
  const banked = state.screen === SCREEN_LEVEL_CLEAR || state.screen === SCREEN_VICTORY;
  const shownScore = banked ? state.totalScore : state.score + state.totalScore;
  ctx.fillStyle = PALETTE.headerText;
  ctx.font = `bold 22px ${FONT_DISPLAY}`;
  ctx.textAlign = 'right';
  ctx.fillText(`Score ${shownScore}`, 1256, 32);
  ctx.fillStyle = PALETTE.headerMuted;
  ctx.font = `bold 16px ${FONT}`;
  ctx.fillText(`Found ${game.foundCount} of ${level.diffs.length}`, 1256, 58);
}

function drawMarker(ctx, originX, diff, pop) {
  const x = originX + diff.x;
  const y = PANEL_Y + diff.y;
  const radius = Math.max(diff.r, 26) * (pop ?? 1);
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2);
  ctx.fillStyle = PALETTE.foundFill;
  ctx.fill();
  ctx.strokeStyle = PALETTE.foundRing;
  ctx.lineWidth = 4;
  ctx.stroke();
  // Check mark.
  ctx.beginPath();
  ctx.moveTo(x - radius * 0.45, y);
  ctx.lineTo(x - radius * 0.12, y + radius * 0.38);
  ctx.lineTo(x + radius * 0.5, y - radius * 0.38);
  ctx.strokeStyle = PALETTE.foundRing;
  ctx.lineWidth = 5;
  ctx.lineCap = 'round';
  ctx.stroke();
}

function drawPanels(ctx, game) {
  const state = game.state;
  const level = LEVELS[state.levelIndex];
  for (const [originX, altered] of [
    [PANEL_LEFT_X, false],
    [PANEL_RIGHT_X, true],
  ]) {
    ctx.save();
    ctx.shadowColor = PALETTE.panelShadow;
    ctx.shadowBlur = 14;
    ctx.shadowOffsetY = 4;
    fillRoundRect(ctx, originX - 4, PANEL_Y - 4, PANEL_W + 8, PANEL_H + 8, 10, '#ffffff', PALETTE.panelBorder, 3);
    ctx.restore();
    ctx.save();
    ctx.beginPath();
    ctx.rect(originX, PANEL_Y, PANEL_W, PANEL_H);
    ctx.clip();
    ctx.translate(originX, PANEL_Y);
    level.paint(ctx, altered);
    ctx.restore();
  }

  // Markers for every found difference, on both pictures.
  for (const diff of level.diffs) {
    if (!game.isFound(diff)) continue;
    const isNewest = state.foundFlash && state.foundFlash.diff.id === diff.id && state.now < state.foundFlash.until;
    const pop = isNewest ? 1 + 0.35 * (1 - (state.foundFlash.until - state.now) / 0.6) : 1;
    drawMarker(ctx, PANEL_LEFT_X, diff, pop);
    drawMarker(ctx, PANEL_RIGHT_X, diff, pop);
  }

  // A hint pulses a gold ring around one unfound difference, on both pictures.
  if (state.hint && state.now < state.hint.until) {
    const diff = state.hint.diff;
    const pulse = 1 + 0.12 * Math.sin(state.now * 7);
    for (const originX of [PANEL_LEFT_X, PANEL_RIGHT_X]) {
      const x = originX + diff.x;
      const y = PANEL_Y + diff.y;
      ctx.beginPath();
      ctx.arc(x, y, Math.max(diff.r, 26) * pulse + 5, 0, Math.PI * 2);
      ctx.strokeStyle = PALETTE.hintRing;
      ctx.lineWidth = 4;
      ctx.setLineDash([10, 7]);
      ctx.stroke();
      ctx.setLineDash([]);
    }
  }

  // A wrong click flashes a red cross where it landed.
  if (state.wrongFlash && state.now < state.wrongFlash.until) {
    const originX = state.wrongFlash.panel === 'left' ? PANEL_LEFT_X : PANEL_RIGHT_X;
    const x = originX + state.wrongFlash.x;
    const y = PANEL_Y + state.wrongFlash.y;
    line(ctx, x - 12, y - 12, x + 12, y + 12, PALETTE.wrongRing, 5);
    line(ctx, x + 12, y - 12, x - 12, y + 12, PALETTE.wrongRing, 5);
  }
}

function drawFooter(ctx, game, sounds) {
  const state = game.state;
  drawButton(ctx, BUTTONS.hint, `Hint (H) · ${state.hintsLeft} left`, state.hintsLeft > 0, PALETTE.gold);
  drawButton(ctx, BUTTONS.pause, 'Pause (P)', true, PALETTE.teal);
  drawButton(ctx, BUTTONS.mute, sounds.muted ? 'Sound: Off (M)' : 'Sound: On (M)', true, PALETTE.teal);

  // Level dots, right.
  for (let i = 0; i < LEVEL_COUNT; i += 1) {
    const x = 1160 + i * 34;
    const done = state.levelStars[i] !== undefined;
    const current = i === state.levelIndex && state.screen === SCREEN_PLAY;
    circle(ctx, x, 583, 13, done ? PALETTE.teal : current ? PALETTE.gold : '#e5d9bd', PALETTE.header, 2);
    ctx.fillStyle = done || current ? '#fff8e7' : PALETTE.muted;
    ctx.font = `bold 13px ${FONT}`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(String(i + 1), x, 584);
  }
  ctx.textBaseline = 'alphabetic';

  // The running message, then the controls line.
  ctx.fillStyle = PALETTE.text;
  ctx.font = `18px ${FONT}`;
  ctx.textAlign = 'center';
  const message = state.now < state.messageUntil ? state.message : '';
  ctx.fillText(message, 640, 646);
  ctx.fillStyle = PALETTE.muted;
  ctx.font = `14px ${FONT}`;
  ctx.fillText('Click a difference on either picture · Arrow keys move the crosshair, Enter marks it · H hint · P pause', 640, 676);
}

function drawCrosshair(ctx, input) {
  if (!input.usingKeyboard) return;
  const { x, y } = input.crosshair;
  ctx.strokeStyle = 'rgba(61, 44, 30, 0.85)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(x, y, 12, 0, Math.PI * 2);
  ctx.stroke();
  line(ctx, x - 18, y, x - 7, y, 'rgba(61, 44, 30, 0.85)', 2);
  line(ctx, x + 7, y, x + 18, y, 'rgba(61, 44, 30, 0.85)', 2);
  line(ctx, x, y - 18, x, y - 7, 'rgba(61, 44, 30, 0.85)', 2);
  line(ctx, x, y + 7, x, y + 18, 'rgba(61, 44, 30, 0.85)', 2);
}

function drawOverlayCard(ctx, x, y, w, h) {
  ctx.fillStyle = PALETTE.overlay;
  ctx.fillRect(0, 0, FIELD.width, FIELD.height);
  ctx.save();
  ctx.shadowColor = 'rgba(0,0,0,0.4)';
  ctx.shadowBlur = 24;
  ctx.shadowOffsetY = 8;
  fillRoundRect(ctx, x, y, w, h, 18, PALETTE.card, PALETTE.cardBorder, 2);
  ctx.restore();
}

function drawStars(ctx, x, y, earned, size) {
  for (let i = 0; i < 3; i += 1) {
    star(ctx, x + i * (size + 12), y, size / 2, i < earned ? PALETTE.gold : '#ddd2ba', '#b8a67e');
  }
}

function drawTitle(ctx, game) {
  // The garden scene sits behind the card, so the title already shows the game.
  drawPanels(ctx, game);
  drawOverlayCard(ctx, 240, 60, 800, 600);
  ctx.textAlign = 'center';
  ctx.fillStyle = PALETTE.text;
  ctx.font = `bold 52px ${FONT_DISPLAY}`;
  ctx.fillText('Curious Differences', 640, 140);
  ctx.font = `19px ${FONT}`;
  ctx.fillStyle = PALETTE.muted;
  ctx.fillText('Two pictures. One is hiding a few small changes. Find them all.', 640, 176);
  ctx.fillStyle = PALETTE.text;
  ctx.font = `16px ${FONT}`;
  ctx.fillText('Click a difference on either picture — or move with the arrow keys and press Enter.', 640, 214);
  ctx.fillText('Wrong clicks cost 5 seconds. Hints cost 50 points. Beat the clock!', 640, 240);

  for (let i = 0; i < LEVEL_COUNT; i += 1) {
    const level = LEVELS[i];
    const y = 268 + i * 74;
    fillRoundRect(ctx, 270, y, 740, 62, 12, '#fffdf4', PALETTE.cardBorder, 1.5);
    ctx.fillStyle = PALETTE.text;
    ctx.font = `bold 19px ${FONT_DISPLAY}`;
    ctx.textAlign = 'left';
    ctx.fillText(`${i + 1}. ${level.name}`, 292, y + 26);
    ctx.font = `14px ${FONT}`;
    ctx.fillStyle = PALETTE.muted;
    ctx.fillText(level.hook, 292, y + 48);
    ctx.textAlign = 'right';
    ctx.fillStyle = PALETTE.accentDark;
    ctx.font = `bold 15px ${FONT}`;
    ctx.fillText(`${level.diffs.length} to find · ${level.timeLimit}s`, 988, y + 26);
    const stars = game.state.levelStars[i];
    if (stars !== undefined) drawStars(ctx, 900, y + 46, stars, 16);
    ctx.textAlign = 'center';
  }

  drawButton(ctx, BUTTONS.start, 'Start playing', true, PALETTE.accent);
  if (game.state.best > 0) {
    ctx.fillStyle = PALETTE.muted;
    ctx.font = `15px ${FONT}`;
    ctx.fillText(`Best total score: ${game.state.best}`, 640, 606);
  }
}

function drawPaused(ctx) {
  drawOverlayCard(ctx, 440, 210, 400, 320);
  ctx.textAlign = 'center';
  ctx.fillStyle = PALETTE.text;
  ctx.font = `bold 36px ${FONT_DISPLAY}`;
  ctx.fillText('Paused', 640, 290);
  ctx.font = `16px ${FONT}`;
  ctx.fillStyle = PALETTE.muted;
  ctx.fillText('Take a breath. The clock is waiting.', 640, 326);
  drawButton(ctx, BUTTONS.resume, 'Resume', true, PALETTE.teal);
  drawButton(ctx, BUTTONS.toTitlePause, 'Back to title', true, PALETTE.accent);
}

function drawLevelClear(ctx, game) {
  const state = game.state;
  const level = LEVELS[state.levelIndex];
  const levelScore = state.levelScores[state.levelIndex] ?? 0;
  const stars = state.levelStars[state.levelIndex] ?? 1;
  const timeBonus = Math.ceil(state.timeLeft) * POINTS.timeBonusPerSecond;
  drawOverlayCard(ctx, 440, 150, 400, 380);
  ctx.textAlign = 'center';
  ctx.fillStyle = PALETTE.text;
  ctx.font = `bold 34px ${FONT_DISPLAY}`;
  ctx.fillText(`${level.name} cleared!`, 640, 214);
  drawStars(ctx, 574, 262, stars, 34);
  ctx.font = `17px ${FONT}`;
  ctx.fillStyle = PALETTE.muted;
  ctx.fillText(`Found all ${level.diffs.length} differences`, 640, 312);
  ctx.fillText(`Time bonus +${timeBonus}  ·  Level score ${levelScore}`, 640, 340);
  ctx.fillText(`Total score ${state.totalScore}`, 640, 368);
  const nextLabel = state.levelIndex + 1 < LEVEL_COUNT ? `Next: ${LEVELS[state.levelIndex + 1].name}` : 'See your results';
  drawButton(ctx, BUTTONS.next, nextLabel, true, PALETTE.accent);
}

function drawGameOver(ctx, game) {
  const state = game.state;
  const level = LEVELS[state.levelIndex];
  drawOverlayCard(ctx, 440, 170, 400, 340);
  ctx.textAlign = 'center';
  ctx.fillStyle = PALETTE.text;
  ctx.font = `bold 34px ${FONT_DISPLAY}`;
  ctx.fillText('Out of time!', 640, 234);
  ctx.font = `17px ${FONT}`;
  ctx.fillStyle = PALETTE.muted;
  ctx.fillText(`You found ${game.foundCount} of ${level.diffs.length} differences in ${level.name}.`, 640, 276);
  ctx.fillText('The rest are still hiding in the picture.', 640, 304);
  drawButton(ctx, BUTTONS.retry, 'Try again', true, PALETTE.accent);
  drawButton(ctx, BUTTONS.toTitleOver, 'Back to title', true, PALETTE.teal);
}

function drawVictory(ctx, game) {
  const state = game.state;
  drawOverlayCard(ctx, 400, 110, 480, 480);
  ctx.textAlign = 'center';
  ctx.fillStyle = PALETTE.text;
  ctx.font = `bold 34px ${FONT_DISPLAY}`;
  ctx.fillText('You found them all!', 640, 176);
  ctx.font = `17px ${FONT}`;
  ctx.fillStyle = PALETTE.muted;
  ctx.fillText('Every difference in every scene — sharp eyes!', 640, 208);
  ctx.fillStyle = PALETTE.accentDark;
  ctx.font = `bold 26px ${FONT_DISPLAY}`;
  ctx.fillText(`Total score ${state.totalScore}`, 640, 256);
  for (let i = 0; i < LEVEL_COUNT; i += 1) {
    const y = 300 + i * 44;
    ctx.fillStyle = PALETTE.text;
    ctx.font = `17px ${FONT}`;
    ctx.textAlign = 'left';
    ctx.fillText(LEVELS[i].name, 470, y);
    drawStars(ctx, 640, y - 5, state.levelStars[i] ?? 0, 22);
    ctx.textAlign = 'right';
    ctx.fillText(String(state.levelScores[i] ?? 0), 810, y);
    ctx.textAlign = 'center';
  }
  drawButton(ctx, BUTTONS.again, 'Play again', true, PALETTE.accent);
  drawButton(ctx, BUTTONS.toTitleVictory, 'Back to title', true, PALETTE.teal);
}

export function createRenderer(canvas) {
  const ctx = canvas.getContext('2d');
  canvas.width = FIELD.width;
  canvas.height = FIELD.height;

  return {
    draw(game, input, sounds) {
      const state = game.state;
      ctx.clearRect(0, 0, FIELD.width, FIELD.height);
      ctx.fillStyle = PALETTE.page;
      ctx.fillRect(0, 0, FIELD.width, FIELD.height);
      ctx.textBaseline = 'alphabetic';

      if (state.screen === SCREEN_TITLE) {
        drawTitle(ctx, game);
        return;
      }

      drawHeader(ctx, game);
      drawPanels(ctx, game);
      drawFooter(ctx, game, sounds);
      if (state.screen === SCREEN_PLAY) drawCrosshair(ctx, input);
      if (state.screen === SCREEN_PAUSED) drawPaused(ctx);
      else if (state.screen === SCREEN_LEVEL_CLEAR) drawLevelClear(ctx, game);
      else if (state.screen === SCREEN_GAME_OVER) drawGameOver(ctx, game);
      else if (state.screen === SCREEN_VICTORY) drawVictory(ctx, game);
    },
  };
}
