// Scene 1 — "Sunny Garden": a bright backyard with a tree, a fence, a flower
// bed, a birdhouse and a cat. Five differences hide in it. `paint` draws the
// picture into a 600x440 panel; `altered` draws the right-hand picture, where
// every difference is applied. Each difference's centre is in panel pixels.

import { circle, cloud, ellipse, flower, line, verticalGradient, fillRoundRect } from './draw.js';

export const GARDEN_DIFFS = [
  { id: 'apple', x: 186, y: 212, r: 24, label: 'An extra apple on the tree' },
  { id: 'tulip', x: 300, y: 372, r: 24, label: 'A tulip changed colour' },
  { id: 'butterfly', x: 450, y: 200, r: 28, label: 'A butterfly vanished' },
  { id: 'birdhouse', x: 480, y: 235, r: 22, label: 'The birdhouse door changed shape' },
  { id: 'drops', x: 376, y: 412, r: 26, label: 'The water drops disappeared' },
];

function drawSun(ctx) {
  for (let i = 0; i < 8; i += 1) {
    const angle = (Math.PI * i) / 4;
    line(ctx, 80 + Math.cos(angle) * 44, 70 + Math.sin(angle) * 44, 80 + Math.cos(angle) * 56, 70 + Math.sin(angle) * 56, '#f2b705', 4);
  }
  circle(ctx, 80, 70, 36, '#ffd94d', '#f2b705', 3);
  circle(ctx, 68, 64, 4, '#3d2c1e');
  circle(ctx, 92, 64, 4, '#3d2c1e');
  ctx.beginPath();
  ctx.arc(80, 76, 12, 0.15 * Math.PI, 0.85 * Math.PI);
  ctx.strokeStyle = '#3d2c1e';
  ctx.lineWidth = 3;
  ctx.stroke();
}

function drawTree(ctx, altered) {
  ctx.fillStyle = '#7a4a21';
  ctx.fillRect(142, 240, 16, 70);
  ctx.fillStyle = '#8a5a2b';
  ctx.fillRect(142, 240, 16, 70);
  ellipse(ctx, 118, 190, 48, 44, '#4f9e4d');
  ellipse(ctx, 182, 184, 50, 46, '#57ab55');
  ellipse(ctx, 150, 142, 52, 44, '#63b863');
  ellipse(ctx, 150, 185, 55, 40, '#4f9e4d');
  circle(ctx, 125, 190, 9, '#e5534b', '#a83a34', 1.5);
  circle(ctx, 168, 162, 9, '#e5534b', '#a83a34', 1.5);
  circle(ctx, 148, 205, 9, '#e5534b', '#a83a34', 1.5);
  // Difference: the right picture grows a fourth apple.
  if (altered) circle(ctx, 186, 212, 9, '#e5534b', '#a83a34', 1.5);
}

function drawFence(ctx) {
  ctx.fillStyle = '#8a5a2b';
  ctx.fillRect(0, 292, 600, 6);
  ctx.fillRect(0, 312, 600, 6);
  for (let x = 8; x < 600; x += 42) {
    ctx.fillStyle = '#f7f3e8';
    ctx.beginPath();
    ctx.moveTo(x, 326);
    ctx.lineTo(x, 282);
    ctx.lineTo(x + 7, 274);
    ctx.lineTo(x + 14, 282);
    ctx.lineTo(x + 14, 326);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = '#d8cdb4';
    ctx.lineWidth = 1;
    ctx.stroke();
  }
}

function drawBirdhouse(ctx, altered) {
  ctx.fillStyle = '#7a4a21';
  ctx.fillRect(476, 258, 8, 74);
  ctx.fillStyle = '#b85a2a';
  ctx.fillRect(452, 208, 56, 50);
  ctx.beginPath();
  ctx.moveTo(444, 210);
  ctx.lineTo(480, 184);
  ctx.lineTo(516, 210);
  ctx.closePath();
  ctx.fillStyle = '#8a3d1d';
  ctx.fill();
  // Difference: the round door becomes a square one.
  if (altered) {
    ctx.fillStyle = '#3d2c1e';
    ctx.fillRect(472, 227, 16, 16);
  } else {
    circle(ctx, 480, 235, 9, '#3d2c1e');
  }
  line(ctx, 452, 258, 444, 258, '#8a5a2b', 3);
}

function drawButterfly(ctx) {
  ctx.fillStyle = '#7b5cd6';
  ellipse(ctx, 438, 192, 14, 10, '#7b5cd6');
  ellipse(ctx, 462, 192, 14, 10, '#9a7ff0');
  ellipse(ctx, 440, 208, 11, 8, '#9a7ff0');
  ellipse(ctx, 460, 208, 11, 8, '#7b5cd6');
  line(ctx, 450, 190, 450, 212, '#3d2c1e', 3);
  circle(ctx, 450, 188, 4, '#3d2c1e');
}

function drawWateringCan(ctx, altered) {
  fillRoundRect(ctx, 300, 378, 62, 34, 8, '#2e7d6b', '#1f5c4e', 2);
  line(ctx, 360, 388, 388, 402, '#2e7d6b', 7);
  circle(ctx, 390, 404, 6, '#2e7d6b', '#1f5c4e', 2);
  line(ctx, 302, 384, 288, 372, '#2e7d6b', 5);
  // Difference: the drops under the spout are gone.
  if (!altered) {
    circle(ctx, 372, 414, 3.5, '#7ec8f7');
    circle(ctx, 384, 420, 3.5, '#7ec8f7');
    circle(ctx, 392, 412, 3, '#7ec8f7');
  }
}

function drawCat(ctx) {
  ellipse(ctx, 96, 412, 26, 18, '#e8a34c');
  circle(ctx, 116, 392, 14, '#e8a34c');
  ctx.beginPath();
  ctx.moveTo(106, 382);
  ctx.lineTo(110, 368);
  ctx.lineTo(118, 380);
  ctx.closePath();
  ctx.fillStyle = '#e8a34c';
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(120, 380);
  ctx.lineTo(126, 368);
  ctx.lineTo(130, 382);
  ctx.closePath();
  ctx.fill();
  circle(ctx, 111, 390, 2, '#3d2c1e');
  circle(ctx, 121, 390, 2, '#3d2c1e');
  ctx.beginPath();
  ctx.moveTo(70, 414);
  ctx.quadraticCurveTo(52, 408, 56, 388);
  ctx.strokeStyle = '#e8a34c';
  ctx.lineWidth = 7;
  ctx.lineCap = 'round';
  ctx.stroke();
}

function drawBee(ctx) {
  ellipse(ctx, 392, 330, 9, 6, '#f2c94c', '#3d2c1e', 1.5);
  line(ctx, 390, 328, 390, 334, '#3d2c1e', 2);
  line(ctx, 394, 328, 394, 334, '#3d2c1e', 2);
  ellipse(ctx, 388, 322, 6, 4, 'rgba(255,255,255,0.85)');
  ellipse(ctx, 396, 322, 6, 4, 'rgba(255,255,255,0.85)');
}

export function paintGarden(ctx, altered) {
  verticalGradient(ctx, 0, 0, 600, 440, '#a8dcf5', '#eaf9ff');
  drawSun(ctx);
  cloud(ctx, 190, 55, 0.9, '#ffffff');
  cloud(ctx, 410, 42, 1.1, '#ffffff');
  cloud(ctx, 505, 95, 0.75, '#ffffff');
  ellipse(ctx, 300, 540, 430, 140, '#7ec850');
  ellipse(ctx, 70, 560, 320, 110, '#6db84a');
  ellipse(ctx, 560, 560, 280, 100, '#8fd45e');
  drawFence(ctx);
  drawTree(ctx, altered);
  drawBirdhouse(ctx, altered);
  if (!altered) drawButterfly(ctx);
  drawBee(ctx);
  // Flower bed along the bottom.
  ctx.fillStyle = '#6b4a2f';
  ctx.fillRect(0, 398, 600, 42);
  const tulipColours = ['#e5534b', '#f2c94c', altered ? '#f2c94c' : '#e5534b', '#e07ab8', '#f2c94c'];
  const tulipXs = [60, 160, 300, 420, 520];
  for (let i = 0; i < 5; i += 1) {
    flower(ctx, tulipXs[i], 430, tulipColours[i], '#f2b705', 58);
  }
  drawWateringCan(ctx, altered);
  drawCat(ctx);
  // Grass tufts and pebbles.
  line(ctx, 240, 380, 236, 366, '#3d9e5f', 3);
  line(ctx, 246, 380, 250, 364, '#3d9e5f', 3);
  line(ctx, 540, 380, 536, 368, '#3d9e5f', 3);
  line(ctx, 546, 380, 550, 366, '#3d9e5f', 3);
  circle(ctx, 210, 386, 4, '#c9c2b2');
  circle(ctx, 440, 388, 4, '#c9c2b2');
}
