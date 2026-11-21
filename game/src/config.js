// Every tuning number, colour and layout constant for Curious Differences.
// The game draws in a fixed 1280x720 logical field; the renderer scales it to
// the window, so no rule below depends on the screen size.

export const FIELD = { width: 1280, height: 720 };

// The two picture panels. Both panels show the same scene in the same local
// coordinates (PANEL_W x PANEL_H), so a difference sits at the same spot in
// either picture and a click on either panel can find it.
export const PANEL_W = 600;
export const PANEL_H = 440;
export const PANEL_Y = 92;
export const PANEL_LEFT_X = 20;
export const PANEL_RIGHT_X = 660;
export const PANEL_GAP = 40;

export const HEADER_H = 76;
export const FOOTER_Y = 548;

// Click tolerance, in panel pixels, around a difference's centre.
export const HIT_RADIUS = 34;

// Points and penalties.
export const POINTS = {
  find: 100,
  streakBonus: 10,
  hintCost: 50,
  wrongClick: 25,
  wrongTimePenalty: 5,
  timeBonusPerSecond: 10,
};

export const HINTS_PER_LEVEL = 3;
export const LOW_TIME_SECONDS = 10;

// Stars for a finished level, by the share of time left.
export const STAR_THRESHOLDS = { three: 0.5, two: 0.2 };

export const PALETTE = {
  page: '#f6ead2',
  header: '#3d2c1e',
  headerText: '#f6ead2',
  headerMuted: '#d8c49a',
  accent: '#e07840',
  accentDark: '#b85a2a',
  teal: '#2e7d6b',
  tealDark: '#1f5c4e',
  gold: '#e9b44c',
  panelBorder: '#3d2c1e',
  panelShadow: 'rgba(61, 44, 30, 0.25)',
  foundRing: '#2f9e44',
  foundFill: 'rgba(47, 158, 68, 0.18)',
  wrongRing: '#d64545',
  hintRing: '#e9b44c',
  text: '#3d2c1e',
  muted: '#8a7a63',
  overlay: 'rgba(43, 30, 18, 0.72)',
  card: '#fff8e7',
  cardBorder: '#d8c49a',
  timerFull: '#2f9e44',
  timerLow: '#d64545',
};

export const FONT = '"Trebuchet MS", "Segoe UI", system-ui, sans-serif';
export const FONT_DISPLAY = '"Trebuchet MS", "Segoe UI", system-ui, sans-serif';

/** Where the best total score is kept between visits (this browser only). */
export const BEST_KEY = 'curious-differences.best';
