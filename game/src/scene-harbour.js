// Scene 3 — "Night Harbour": a moonlit bay with a lighthouse, three boats, a
// wooden dock, a jumping fish and a buoy. Nine differences hide in it — the
// hardest hunt of the three. `paint` draws the picture into a 600x440 panel;
// `altered` draws the right-hand picture, where every difference is applied.

import { circle, cloud, ellipse, line, star, verticalGradient } from './draw.js';
import { createRandom } from './random.js';

export const HARBOUR_DIFFS = [
  { id: 'beam', x: 200, y: 80, r: 40, label: 'The lighthouse beam went dark' },
  { id: 'sail', x: 400, y: 310, r: 28, label: 'A sail changed colour' },
  { id: 'star', x: 440, y: 45, r: 20, label: 'A bright star vanished' },
  { id: 'moon', x: 500, y: 70, r: 30, label: 'The moon changed phase' },
  { id: 'gull', x: 320, y: 90, r: 24, label: 'An extra gull appeared' },
  { id: 'fish', x: 350, y: 380, r: 26, label: 'The jumping fish is gone' },
  { id: 'lantern', x: 200, y: 362, r: 22, label: 'A dock lantern went missing' },
  { id: 'buoy', x: 480, y: 400, r: 24, label: 'The buoy changed colour' },
  { id: 'flag', x: 250, y: 262, r: 20, label: 'A boat flag changed colour' },
];

function drawStars(ctx, altered) {
  const rng = createRandom(7);
  for (let i = 0; i < 45; i += 1) {
    const x = 10 + rng() * 580;
    const y = 10 + rng() * 220;
    // Keep the moon's patch of sky clear.
    if (Math.hypot(x - 500, y - 70) < 42) continue;
    const r = 1 + rng() * 1.6;
    circle(ctx, x, y, r, rng() > 0.8 ? '#ffe08a' : '#ffffff');
  }
  // Difference: the brightest star near the moon is gone.
  if (!altered) star(ctx, 440, 45, 8, '#ffe08a');
}

function drawMoon(ctx, altered) {
  if (altered) {
    // Difference: a full moon becomes a crescent.
    circle(ctx, 500, 70, 26, '#f2e6b8');
    circle(ctx, 510, 64, 24, '#274b73');
  } else {
    circle(ctx, 500, 70, 26, '#f2e6b8', '#d8c49a', 2);
    circle(ctx, 492, 62, 4, '#d8c49a');
    circle(ctx, 508, 78, 3, '#d8c49a');
    circle(ctx, 498, 84, 2.5, '#d8c49a');
  }
}

function drawGull(ctx, x, y, scale) {
  ctx.beginPath();
  ctx.moveTo(x - 12 * scale, y);
  ctx.quadraticCurveTo(x - 4 * scale, y - 8 * scale, x, y);
  ctx.quadraticCurveTo(x + 4 * scale, y - 8 * scale, x + 12 * scale, y);
  ctx.strokeStyle = '#eef1f5';
  ctx.lineWidth = 2.5;
  ctx.stroke();
}

function drawLighthouse(ctx, altered) {
  // Rocks at the base.
  ellipse(ctx, 95, 302, 55, 18, '#4a4a55');
  ellipse(ctx, 60, 306, 30, 12, '#3d3d48');
  // Striped tower.
  ctx.fillStyle = '#e8e4da';
  ctx.fillRect(62, 96, 46, 204);
  ctx.fillStyle = '#c4453c';
  ctx.fillRect(62, 140, 46, 34);
  ctx.fillRect(62, 208, 46, 34);
  ctx.strokeStyle = '#3d2c1e';
  ctx.lineWidth = 2;
  ctx.strokeRect(62, 96, 46, 204);
  // Lamp room.
  ctx.fillStyle = '#3d2c1e';
  ctx.fillRect(58, 72, 54, 26);
  ctx.fillStyle = '#ffe08a';
  ctx.fillRect(66, 78, 38, 14);
  ctx.beginPath();
  ctx.moveTo(54, 72);
  ctx.lineTo(85, 52);
  ctx.lineTo(116, 72);
  ctx.closePath();
  ctx.fillStyle = '#c4453c';
  ctx.fill();
  // Difference: the beam is switched off.
  if (!altered) {
    const beam = ctx.createLinearGradient(104, 85, 340, 85);
    beam.addColorStop(0, 'rgba(255, 224, 138, 0.75)');
    beam.addColorStop(1, 'rgba(255, 224, 138, 0)');
    ctx.fillStyle = beam;
    ctx.beginPath();
    ctx.moveTo(104, 78);
    ctx.lineTo(340, 44);
    ctx.lineTo(340, 116);
    ctx.lineTo(104, 92);
    ctx.closePath();
    ctx.fill();
  }
}

function drawBoat(ctx, x, y, scale, sailColour, flagColour) {
  // Hull.
  ctx.beginPath();
  ctx.moveTo(x - 38 * scale, y);
  ctx.lineTo(x + 38 * scale, y);
  ctx.lineTo(x + 28 * scale, y + 12 * scale);
  ctx.lineTo(x - 28 * scale, y + 12 * scale);
  ctx.closePath();
  ctx.fillStyle = '#8a5a2b';
  ctx.fill();
  ctx.strokeStyle = '#5c3a1a';
  ctx.lineWidth = 2;
  ctx.stroke();
  // Mast and sail.
  line(ctx, x, y, x, y - 48 * scale, '#5c3a1a', 3);
  ctx.beginPath();
  ctx.moveTo(x, y - 46 * scale);
  ctx.lineTo(x, y - 2 * scale);
  ctx.lineTo(x + 32 * scale, y - 2 * scale);
  ctx.closePath();
  ctx.fillStyle = sailColour;
  ctx.fill();
  ctx.strokeStyle = 'rgba(61, 44, 30, 0.5)';
  ctx.lineWidth = 1.5;
  ctx.stroke();
  // Flag on the mast top.
  if (flagColour) {
    ctx.beginPath();
    ctx.moveTo(x, y - 48 * scale);
    ctx.lineTo(x + 16 * scale, y - 44 * scale);
    ctx.lineTo(x, y - 40 * scale);
    ctx.closePath();
    ctx.fillStyle = flagColour;
    ctx.fill();
  }
}

function drawDock(ctx, altered) {
  ctx.fillStyle = '#7a4a21';
  ctx.fillRect(0, 372, 280, 12);
  ctx.fillStyle = '#8a5a2b';
  ctx.fillRect(0, 384, 280, 6);
  for (let x = 20; x < 280; x += 44) {
    line(ctx, x, 372, x, 384, '#5c3a1a', 2);
  }
  // Posts.
  ctx.fillStyle = '#5c3a1a';
  ctx.fillRect(56, 340, 10, 60);
  ctx.fillRect(196, 340, 10, 60);
  // Lanterns on the posts.
  circle(ctx, 61, 352, 4, '#ffe08a');
  ctx.fillStyle = '#2e2a26';
  ctx.fillRect(53, 340, 16, 10);
  circle(ctx, 61, 336, 3, '#ffe08a');
  if (!altered) {
    // Difference: the far lantern is missing.
    circle(ctx, 201, 352, 4, '#ffe08a');
    ctx.fillStyle = '#2e2a26';
    ctx.fillRect(193, 340, 16, 10);
    circle(ctx, 201, 336, 3, '#ffe08a');
  }
}

function drawFish(ctx) {
  ctx.beginPath();
  ctx.moveTo(332, 384);
  ctx.quadraticCurveTo(350, 356, 368, 384);
  ctx.quadraticCurveTo(350, 374, 332, 384);
  ctx.closePath();
  ctx.fillStyle = '#7ec8f7';
  ctx.fill();
  ctx.strokeStyle = '#3d6b8a';
  ctx.lineWidth = 1.5;
  ctx.stroke();
  circle(ctx, 336, 380, 2, '#3d2c1e');
  // Splash drops.
  circle(ctx, 330, 392, 3, '#bfe8ff');
  circle(ctx, 344, 396, 2.5, '#bfe8ff');
  circle(ctx, 360, 394, 3, '#bfe8ff');
  circle(ctx, 372, 390, 2, '#bfe8ff');
}

function drawBuoy(ctx, altered) {
  // Difference: the buoy's red top becomes blue.
  ctx.fillStyle = altered ? '#3d6b8a' : '#c4453c';
  ctx.beginPath();
  ctx.moveTo(470, 404);
  ctx.lineTo(490, 404);
  ctx.lineTo(484, 384);
  ctx.lineTo(476, 384);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = '#e8e4da';
  ctx.fillRect(472, 392, 16, 6);
  circle(ctx, 480, 382, 3, '#e9b44c');
  ellipse(ctx, 480, 406, 16, 4, 'rgba(255,255,255,0.25)');
}

function drawWaves(ctx) {
  const rng = createRandom(21);
  ctx.strokeStyle = 'rgba(191, 232, 255, 0.55)';
  ctx.lineWidth = 2.5;
  for (let i = 0; i < 16; i += 1) {
    const x = 20 + rng() * 560;
    const y = 250 + rng() * 180;
    const w = 14 + rng() * 22;
    ctx.beginPath();
    ctx.arc(x, y, w / 2, Math.PI * 1.1, Math.PI * 1.9);
    ctx.stroke();
  }
}

export function paintHarbour(ctx, altered) {
  verticalGradient(ctx, 0, 0, 600, 250, '#0b1e3a', '#274b73');
  drawStars(ctx, altered);
  cloud(ctx, 140, 55, 1.0, '#1b3a5c');
  cloud(ctx, 370, 38, 0.8, '#1b3a5c');
  drawMoon(ctx, altered);
  drawGull(ctx, 150, 100, 1);
  drawGull(ctx, 250, 70, 0.9);
  drawGull(ctx, 380, 115, 1);
  // Difference: a fourth gull joins the sky.
  if (altered) drawGull(ctx, 320, 90, 0.9);
  // Sea.
  verticalGradient(ctx, 0, 240, 600, 200, '#1d4e6b', '#0f2f4a');
  ctx.fillStyle = '#bfe8ff';
  ctx.fillRect(0, 238, 600, 3);
  drawWaves(ctx);
  drawLighthouse(ctx, altered);
  drawBoat(ctx, 250, 300, 1, '#fff8e7', altered ? '#3d6b8a' : '#c4453c');
  drawBoat(ctx, 400, 330, 1.15, altered ? '#fff8e7' : '#c4453c', null);
  drawBoat(ctx, 520, 292, 0.8, '#fff8e7', null);
  drawDock(ctx, altered);
  if (!altered) drawFish(ctx);
  drawBuoy(ctx, altered);
}
