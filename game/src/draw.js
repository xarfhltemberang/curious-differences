// Small canvas helpers shared by the three scene painters, so each scene file
// stays about its own picture instead of re-teaching the canvas to draw.

// A rectangle with rounded corners, filled (and stroked when a stroke colour
// is given). Leaves the path open for the caller to fill or stroke.
export function roundRect(ctx, x, y, w, h, r) {
  const radius = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.arcTo(x + w, y, x + w, y + h, radius);
  ctx.arcTo(x + w, y + h, x, y + h, radius);
  ctx.arcTo(x, y + h, x, y, radius);
  ctx.arcTo(x, y, x + w, y, radius);
  ctx.closePath();
}

export function fillRoundRect(ctx, x, y, w, h, r, fill, stroke, lineWidth) {
  roundRect(ctx, x, y, w, h, r);
  ctx.fillStyle = fill;
  ctx.fill();
  if (stroke) {
    ctx.strokeStyle = stroke;
    ctx.lineWidth = lineWidth ?? 2;
    ctx.stroke();
  }
}

export function circle(ctx, x, y, r, fill, stroke, lineWidth) {
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  if (fill) {
    ctx.fillStyle = fill;
    ctx.fill();
  }
  if (stroke) {
    ctx.strokeStyle = stroke;
    ctx.lineWidth = lineWidth ?? 2;
    ctx.stroke();
  }
}

export function ellipse(ctx, x, y, rx, ry, fill, stroke, lineWidth) {
  ctx.beginPath();
  ctx.ellipse(x, y, rx, ry, 0, 0, Math.PI * 2);
  if (fill) {
    ctx.fillStyle = fill;
    ctx.fill();
  }
  if (stroke) {
    ctx.strokeStyle = stroke;
    ctx.lineWidth = lineWidth ?? 2;
    ctx.stroke();
  }
}

export function line(ctx, x1, y1, x2, y2, stroke, width) {
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.strokeStyle = stroke;
  ctx.lineWidth = width;
  ctx.lineCap = 'round';
  ctx.stroke();
}

// A five-point star centred at (x, y), outer radius r, inner radius r * 0.45.
export function star(ctx, x, y, r, fill, stroke) {
  ctx.beginPath();
  for (let i = 0; i < 10; i += 1) {
    const angle = (Math.PI / 5) * i - Math.PI / 2;
    const radius = i % 2 === 0 ? r : r * 0.45;
    const px = x + Math.cos(angle) * radius;
    const py = y + Math.sin(angle) * radius;
    if (i === 0) ctx.moveTo(px, py);
    else ctx.lineTo(px, py);
  }
  ctx.closePath();
  if (fill) {
    ctx.fillStyle = fill;
    ctx.fill();
  }
  if (stroke) {
    ctx.strokeStyle = stroke;
    ctx.lineWidth = 1.5;
    ctx.stroke();
  }
}

// A puffy cloud made of three circles and a flat base, at (x, y).
export function cloud(ctx, x, y, scale, fill) {
  circle(ctx, x, y, 22 * scale, fill);
  circle(ctx, x + 24 * scale, y - 8 * scale, 26 * scale, fill);
  circle(ctx, x + 50 * scale, y, 20 * scale, fill);
  ctx.fillStyle = fill;
  ctx.fillRect(x - 20 * scale, y - 2 * scale, 88 * scale, 20 * scale);
}

// A simple flower: a stem, two leaves and five round petals around a centre.
export function flower(ctx, x, y, petal, centre, stemHeight) {
  const top = y - stemHeight;
  line(ctx, x, y, x, top, '#2e7d4b', 4);
  ellipse(ctx, x - 8, y - stemHeight * 0.45, 9, 5, '#3d9e5f');
  ellipse(ctx, x + 8, y - stemHeight * 0.6, 9, 5, '#3d9e5f');
  for (let i = 0; i < 5; i += 1) {
    const angle = (Math.PI * 2 * i) / 5 - Math.PI / 2;
    circle(ctx, top + Math.cos(angle) * 10, top + Math.sin(angle) * 10, 8, petal);
  }
  circle(ctx, x, top, 7, centre);
}

// A vertical colour blend from `top` to `bottom` over a rectangle.
export function verticalGradient(ctx, x, y, w, h, top, bottom) {
  const gradient = ctx.createLinearGradient(x, y, x, y + h);
  gradient.addColorStop(0, top);
  gradient.addColorStop(1, bottom);
  ctx.fillStyle = gradient;
  ctx.fillRect(x, y, w, h);
}
