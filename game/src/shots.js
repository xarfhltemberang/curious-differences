// The screenshot scenes behind ?shot=play|start|shop|end. Each one puts the
// real game into a fixed, deterministic state — no loop, no timer running —
// so the frame is what real play looks like and the same seed always gives
// the same frame. The cover shot (play) shows two differences already found
// and circled, three still hiding, and the counter reading 2 of 5.

import { SCREEN_VICTORY } from './game.js';

function stagePlay(game) {
  game.startGame();
  const state = game.state;
  state.found.add('apple');
  state.found.add('tulip');
  state.streak = 2;
  state.score = 210;
  state.timeLeft = 47;
  state.foundFlash = null;
  state.message = 'A tulip changed colour! +110';
  state.messageUntil = 10;
}

function stageShop(game) {
  game.startGame();
  const state = game.state;
  state.levelScores = [820];
  state.levelStars = [3];
  state.totalScore = 820;
  game.startLevel(1);
  state.found.add('clock');
  state.found.add('jar');
  state.found.add('globe');
  state.streak = 1;
  state.score = 340;
  state.timeLeft = 63;
  state.foundFlash = null;
  state.message = 'The globe turned! +120';
  state.messageUntil = 10;
}

function stageEnd(game) {
  game.startGame();
  const state = game.state;
  state.levelScores = [820, 760, 870];
  state.levelStars = [3, 2, 3];
  state.totalScore = 2450;
  state.best = 2450;
  // The victory card sits over the last scene, all nine differences found.
  game.startLevel(2);
  for (const diff of game.level.diffs) state.found.add(diff.id);
  state.score = 870;
  state.timeLeft = 23;
  state.message = '';
  state.messageUntil = 0;
  state.screen = SCREEN_VICTORY;
}

/**
 * Put `game` into the named scene and return nothing; the boot code paints
 * the frame. Unknown names stage the title screen.
 */
export function stageShot(name, game) {
  if (name === 'play') stagePlay(game);
  else if (name === 'shop') stageShop(game);
  else if (name === 'end') stageEnd(game);
  else {
    game.backToTitle();
    game.setBest(1240);
  }
}
