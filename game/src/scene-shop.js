// Scene 2 — "The Curiosity Shop": a cosy room of shelves, jars, books, a
// globe, a wall clock and a teapot, with a cat asleep on the rug. Seven
// differences hide in it. `paint` draws the picture into a 600x440 panel;
// `altered` draws the right-hand picture, where every difference is applied.

import { circle, ellipse, fillRoundRect, line, star } from './draw.js';

export const SHOP_DIFFS = [
  { id: 'clock', x: 300, y: 80, r: 28, label: 'The clock hands moved' },
  { id: 'book', x: 131, y: 245, r: 22, label: 'A book went missing' },
  { id: 'jar', x: 167, y: 138, r: 22, label: 'A jar changed colour' },
  { id: 'globe', x: 300, y: 245, r: 26, label: 'The globe turned' },
  { id: 'teapot', x: 430, y: 322, r: 22, label: 'The teapot lost its lid' },
  { id: 'candle', x: 350, y: 128, r: 22, label: 'The candle flame went out' },
  { id: 'painting', x: 115, y: 90, r: 28, label: 'The painting changed' },
];

function drawWindow(ctx) {
  ctx.fillStyle = '#7a4a21';
  ctx.fillRect(448, 38, 134, 154);
  ctx.fillStyle = '#1b2f4a';
  ctx.fillRect(456, 46, 118, 138);
  circle(ctx, 540, 80, 16, '#f2e6b8');
  circle(ctx, 534, 76, 14, '#1b2f4a');
  star(ctx, 480, 70, 5, '#f2e6b8');
  star(ctx, 500, 120, 4, '#f2e6b8');
  star(ctx, 545, 140, 5, '#f2e6b8');
  star(ctx, 470, 150, 4, '#f2e6b8');
  ctx.fillStyle = '#1b2f4a';
  ctx.fillRect(508, 46, 6, 138);
  ctx.fillRect(456, 110, 118, 6);
  // Curtains.
  ctx.fillStyle = '#b8452f';
  ctx.beginPath();
  ctx.moveTo(448, 38);
  ctx.lineTo(470, 38);
  ctx.lineTo(462, 192);
  ctx.lineTo(448, 192);
  ctx.closePath();
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(582, 38);
  ctx.lineTo(560, 38);
  ctx.lineTo(568, 192);
  ctx.lineTo(582, 192);
  ctx.closePath();
  ctx.fill();
}

function drawPainting(ctx, altered) {
  ctx.fillStyle = '#8a5a2b';
  ctx.fillRect(58, 48, 114, 84);
  ctx.fillStyle = '#cfe8f5';
  ctx.fillRect(64, 54, 102, 72);
  if (altered) {
    // The sunny hill scene becomes a moonlit one.
    ctx.fillStyle = '#1b2f4a';
    ctx.fillRect(64, 54, 102, 72);
    circle(ctx, 140, 78, 14, '#f2e6b8');
    star(ctx, 88, 70, 4, '#ffffff');
    star(ctx, 150, 108, 4, '#ffffff');
    ellipse(ctx, 64, 126, 51, 12, '#2e4a3a');
  } else {
    circle(ctx, 92, 78, 14, '#ffd94d');
    ellipse(ctx, 64, 126, 51, 14, '#5da85a');
    ellipse(ctx, 166, 126, 51, 10, '#7ec850');
  }
}

function drawClock(ctx, altered) {
  circle(ctx, 300, 80, 34, '#fff8e7', '#3d2c1e', 3);
  for (let i = 0; i < 12; i += 1) {
    const angle = (Math.PI * i) / 6;
    line(ctx, 300 + Math.cos(angle) * 28, 80 + Math.sin(angle) * 28, 300 + Math.cos(angle) * 31, 80 + Math.sin(angle) * 31, '#3d2c1e', 2);
  }
  // Difference: three o'clock becomes half past four.
  if (altered) {
    line(ctx, 300, 80, 300 + 14, 80 + 14, '#3d2c1e', 3);
    line(ctx, 300, 80, 300 - 4, 80 + 22, '#3d2c1e', 3);
  } else {
    line(ctx, 300, 80, 300, 80 - 20, '#3d2c1e', 3);
    line(ctx, 300, 80, 300 + 20, 80, '#3d2c1e', 3);
  }
  circle(ctx, 300, 80, 3.5, '#3d2c1e');
}

function drawShelf(ctx, y) {
  ctx.fillStyle = '#8a5a2b';
  ctx.fillRect(30, y, 390, 10);
  ctx.fillStyle = '#6b4423';
  ctx.fillRect(30, y + 10, 390, 3);
}

function drawJar(ctx, x, y, colour) {
  fillRoundRect(ctx, x, y, 34, 44, 6, colour, '#3d2c1e', 1.5);
  ctx.fillStyle = '#8a5a2b';
  ctx.fillRect(x + 4, y - 6, 26, 7);
  circle(ctx, x + 12, y + 16, 4, 'rgba(255,255,255,0.5)');
}

function drawCandle(ctx, altered) {
  ctx.fillStyle = '#fff8e7';
  ctx.fillRect(344, 128, 12, 32);
  ctx.fillStyle = '#d8c49a';
  ctx.fillRect(340, 160, 20, 4);
  if (!altered) {
    ellipse(ctx, 350, 118, 5, 9, '#ffb347');
    ellipse(ctx, 350, 120, 2.5, 5, '#ffe08a');
  } else {
    // Difference: the flame is out; a thin wisp of smoke rises instead.
    ctx.beginPath();
    ctx.moveTo(350, 126);
    ctx.quadraticCurveTo(354, 118, 348, 110);
    ctx.strokeStyle = 'rgba(120,120,120,0.7)';
    ctx.lineWidth = 2;
    ctx.stroke();
  }
}

function drawBooks(ctx, altered) {
  const colours = ['#b8452f', '#2e7d6b', '#e9b44c', '#7b5cd6', '#4f9e4d'];
  for (let i = 0; i < 5; i += 1) {
    // Difference: the third book is missing from the right picture.
    if (altered && i === 2) continue;
    const x = 70 + i * 25;
    ctx.fillStyle = colours[i];
    ctx.fillRect(x, 222, 22, 48);
    ctx.fillStyle = 'rgba(255,255,255,0.35)';
    ctx.fillRect(x, 230, 22, 4);
    ctx.fillStyle = 'rgba(0,0,0,0.25)';
    ctx.fillRect(x, 262, 22, 8);
  }
}

function drawGlobe(ctx, altered) {
  circle(ctx, 300, 245, 30, '#7ec8f7', '#3d2c1e', 2);
  // Difference: the landmass sits on the other side of the globe.
  if (altered) {
    ellipse(ctx, 312, 252, 12, 9, '#4f9e4d');
    ellipse(ctx, 288, 232, 8, 6, '#8fd45e');
  } else {
    ellipse(ctx, 288, 238, 12, 9, '#4f9e4d');
    ellipse(ctx, 310, 258, 8, 6, '#8fd45e');
  }
  ctx.fillStyle = '#8a5a2b';
  ctx.fillRect(296, 272, 8, 8);
  ctx.fillRect(282, 280, 36, 5);
}

function drawTeapot(ctx, altered) {
  // Table.
  ctx.fillStyle = '#8a5a2b';
  ctx.fillRect(392, 352, 130, 10);
  ctx.fillStyle = '#6b4423';
  ctx.fillRect(400, 362, 8, 40);
  ctx.fillRect(506, 362, 8, 40);
  // Teapot body.
  ellipse(ctx, 430, 338, 30, 18, '#2e7d6b', '#1f5c4e', 2);
  ctx.beginPath();
  ctx.moveTo(402, 336);
  ctx.quadraticCurveTo(384, 330, 388, 318);
  ctx.strokeStyle = '#1f5c4e';
  ctx.lineWidth = 5;
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(458, 338, 12, -Math.PI / 2, Math.PI / 2);
  ctx.strokeStyle = '#1f5c4e';
  ctx.lineWidth = 4;
  ctx.stroke();
  // Difference: the lid is gone from the right picture.
  if (!altered) {
    ellipse(ctx, 430, 322, 16, 6, '#1f5c4e');
    circle(ctx, 430, 316, 4, '#e9b44c');
  }
  // Teacup beside it.
  fillRoundRect(ctx, 478, 340, 26, 14, 4, '#fff8e7', '#d8c49a', 1.5);
}

function drawLamp(ctx, x) {
  line(ctx, x, 0, x, 34, '#3d2c1e', 3);
  ctx.beginPath();
  ctx.moveTo(x - 24, 52);
  ctx.lineTo(x + 24, 52);
  ctx.lineTo(x + 12, 30);
  ctx.lineTo(x - 12, 30);
  ctx.closePath();
  ctx.fillStyle = '#e9b44c';
  ctx.fill();
  ctx.strokeStyle = '#b85a2a';
  ctx.lineWidth = 2;
  ctx.stroke();
  const glow = ctx.createRadialGradient(x, 60, 4, x, 60, 60);
  glow.addColorStop(0, 'rgba(255, 220, 130, 0.55)');
  glow.addColorStop(1, 'rgba(255, 220, 130, 0)');
  ctx.fillStyle = glow;
  ctx.fillRect(x - 60, 0, 120, 120);
  circle(ctx, x, 58, 7, '#ffe08a');
}

function drawRugAndCat(ctx) {
  ellipse(ctx, 300, 412, 135, 20, '#b8452f');
  ellipse(ctx, 300, 412, 110, 15, '#d8c49a');
  ellipse(ctx, 300, 412, 84, 10, '#b8452f');
  // A cat asleep on the rug.
  ellipse(ctx, 250, 404, 24, 10, '#6b6b6b');
  circle(ctx, 272, 400, 9, '#6b6b6b');
  ctx.beginPath();
  ctx.moveTo(266, 394);
  ctx.lineTo(268, 386);
  ctx.lineTo(274, 392);
  ctx.closePath();
  ctx.fillStyle = '#6b6b6b';
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(276, 392);
  ctx.lineTo(280, 385);
  ctx.lineTo(282, 394);
  ctx.closePath();
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(226, 404);
  ctx.quadraticCurveTo(212, 398, 216, 388);
  ctx.strokeStyle = '#6b6b6b';
  ctx.lineWidth = 5;
  ctx.lineCap = 'round';
  ctx.stroke();
}

function drawPlant(ctx) {
  ctx.fillStyle = '#b8452f';
  ctx.beginPath();
  ctx.moveTo(28, 380);
  ctx.lineTo(64, 380);
  ctx.lineTo(58, 404);
  ctx.lineTo(34, 404);
  ctx.closePath();
  ctx.fill();
  ellipse(ctx, 46, 366, 8, 20, '#3d9e5f');
  ellipse(ctx, 34, 372, 7, 16, '#4f9e4d');
  ellipse(ctx, 58, 372, 7, 16, '#57ab55');
}

export function paintShop(ctx, altered) {
  ctx.fillStyle = '#f3e2c7';
  ctx.fillRect(0, 0, 600, 440);
  // Wooden floor.
  ctx.fillStyle = '#a97c50';
  ctx.fillRect(0, 372, 600, 68);
  ctx.strokeStyle = '#8a5a2b';
  ctx.lineWidth = 2;
  for (let y = 388; y < 440; y += 17) {
    line(ctx, 0, y, 600, y, '#8a5a2b', 2);
  }
  drawWindow(ctx);
  drawPainting(ctx, altered);
  drawClock(ctx, altered);
  drawShelf(ctx, 160);
  drawJar(ctx, 80, 116, '#e07ab8');
  drawJar(ctx, 150, 116, altered ? '#7b5cd6' : '#4f9e4d');
  drawJar(ctx, 220, 116, '#e9b44c');
  drawCandle(ctx, altered);
  drawShelf(ctx, 270);
  drawBooks(ctx, altered);
  drawGlobe(ctx, altered);
  drawRugAndCat(ctx);
  drawTeapot(ctx, altered);
  drawLamp(ctx, 210);
  drawPlant(ctx);
}
