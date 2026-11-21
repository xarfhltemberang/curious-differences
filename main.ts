// Curious Differences — the hand-in program (Node 22, standard library only).
// The game itself is the plain static files in this directory's game/ folder:
// game/index.html plus its ES modules, its stylesheet and nothing else, so a
// desktop browser opens it offline with no network request at all. This
// program copies game/ and screenshots/ beside this file into the output
// directory and writes output/dossier.json, the summary the judge reads,
// using the vendored make.fun library. Run it from this directory:
//
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
//
// Inside the grader MAKEFUN_OUTPUT_DIR is unset and /output is used. The
// program runs twice and both runs must write the same bytes, so it does
// nothing but copy files and write the dossier.

import { cpSync, existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDossier } from './vendor/makefun-game.ts';

const repoRoot = fileURLToPath(new URL('.', import.meta.url));
const outputDir = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

mkdirSync(outputDir, { recursive: true });
cpSync(join(repoRoot, 'game'), join(outputDir, 'game'), { recursive: true });
mkdirSync(join(outputDir, 'screenshots'), { recursive: true });
if (existsSync(join(repoRoot, 'screenshots'))) {
  cpSync(join(repoRoot, 'screenshots'), join(outputDir, 'screenshots'), { recursive: true });
}

// The gate's caps, as the kit's reference/gate.json states them: the dossier
// text is capped at 160 KiB, at most 4 screenshots of at most 256 KiB each,
// and game/ holds at most 993 files and directories and 48 MiB in all, with
// no path over 1000 bytes. buildDossier enforces them here so a bad entry
// fails loudly on this machine instead of quietly at the gate.
writeFileSync(
  join(outputDir, 'dossier.json'),
  buildDossier(outputDir, {
    text_max_bytes: 163840,
    screenshots: { max: 4, max_bytes: 262144 },
    game_max_files: 993,
    game_max_bytes: 50331648,
    game_path_max_bytes: 1000,
  }),
);
