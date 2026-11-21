// A tiny seeded random number generator (mulberry32). Scenes use it for their
// stars, petals and pebbles, so the same scene always draws the same way and
// a screenshot of it is reproducible.

export function createRandom(seed) {
  let state = seed >>> 0;
  return function next() {
    state = (state + 0x6d2b79f5) | 0;
    let value = Math.imul(state ^ (state >>> 15), 1 | state);
    value = (value + Math.imul(value ^ (value >>> 7), 61 | value)) ^ value;
    return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
  };
}

/** A random integer in [min, max], from a seeded generator. */
export function randomInt(rng, min, max) {
  return min + Math.floor(rng() * (max - min + 1));
}

/** Pick one item from an array, from a seeded generator. */
export function randomPick(rng, items) {
  return items[Math.floor(rng() * items.length)];
}
