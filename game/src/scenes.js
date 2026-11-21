// The three hunts, in order. Each level names its scene painter, its
// differences, its time limit and a one-line hook shown on the title screen.
// Difficulty rises: more differences to find, in busier pictures, with less
// time per difference.

import { paintGarden, GARDEN_DIFFS } from './scene-garden.js';
import { paintShop, SHOP_DIFFS } from './scene-shop.js';
import { paintHarbour, HARBOUR_DIFFS } from './scene-harbour.js';

export const LEVELS = [
  {
    id: 'garden',
    name: 'Sunny Garden',
    hook: 'A bright backyard, five small changes. Warm up your eyes.',
    diffs: GARDEN_DIFFS,
    paint: paintGarden,
    timeLimit: 90,
  },
  {
    id: 'shop',
    name: 'The Curiosity Shop',
    hook: 'Shelves full of jars, books and oddities. Seven things moved.',
    diffs: SHOP_DIFFS,
    paint: paintShop,
    timeLimit: 120,
  },
  {
    id: 'harbour',
    name: 'Night Harbour',
    hook: 'A moonlit bay, a lighthouse and three boats. Nine to find.',
    diffs: HARBOUR_DIFFS,
    paint: paintHarbour,
    timeLimit: 150,
  },
];

export const LEVEL_COUNT = LEVELS.length;
