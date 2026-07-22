/*
 * p5.gysin.text
 * Optional, dependency-free text permutations for p5.gysin.
 */
(function (global) {
  "use strict";

  const DEFAULT_LIMIT = 24;
  const MAX_LIMIT = 1000;
  const MAX_WORDS = 12;
  const ORDERS = new Set(["walk", "random", "lexical", "rotate"]);

  class SeededRandom {
    constructor(seed) {
      this.state = hashSeed(seed);
      if (this.state === 0) this.state = 0x6d2b79f5;
    }

    next() {
      let t = this.state += 0x6d2b79f5;
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    }

    integer(max) {
      return Math.floor(this.next() * max);
    }
  }

  function permute(value, options = {}) {
    const words = tokenize(value);
    const limit = readLimit(options.limit);
    const order = options.order === undefined ? "walk" : String(options.order);
    if (!ORDERS.has(order)) {
      throw new RangeError(`order must be one of: ${Array.from(ORDERS).join(", ")}.`);
    }

    const target = Number(minBigInt(uniquePermutationCount(words), BigInt(limit)));
    if (target <= 1) return [words.join(" ")];

    if (order === "rotate") return rotateWords(words, target);
    if (order === "lexical") return lexicalWords(words, target);

    const rng = new SeededRandom(options.seed === undefined ? 1 : options.seed);
    if (order === "random") return randomWords(words, target, rng);
    return walkingWords(words, target, rng);
  }

  function tokenize(value) {
    const normalized = String(value).trim();
    if (!normalized) throw new TypeError("GysinText.permute() needs at least one word.");
    const words = normalized.split(/\s+/u);
    if (words.length > MAX_WORDS) {
      throw new RangeError(`GysinText.permute() supports at most ${MAX_WORDS} words.`);
    }
    return words;
  }

  function readLimit(value) {
    if (value === undefined) return DEFAULT_LIMIT;
    const number = Number(value);
    if (!Number.isInteger(number) || number < 1 || number > MAX_LIMIT) {
      throw new RangeError(`limit must be a whole number from 1 through ${MAX_LIMIT}.`);
    }
    return number;
  }

  function uniquePermutationCount(words) {
    const counts = new Map();
    for (const word of words) counts.set(word, (counts.get(word) || 0) + 1);
    let result = factorial(words.length);
    for (const count of counts.values()) result /= factorial(count);
    return result;
  }

  function factorial(number) {
    let result = 1n;
    for (let value = 2n; value <= BigInt(number); value++) result *= value;
    return result;
  }

  function rotateWords(words, target) {
    const result = [];
    const seen = new Set();
    for (let offset = 0; offset < words.length && result.length < target; offset++) {
      addWords(result, seen, words.slice(offset).concat(words.slice(0, offset)));
    }
    return result;
  }

  function lexicalWords(words, target) {
    const original = words.join(" ");
    const result = [original];
    const seen = new Set(result);
    const current = words.slice().sort(compareWords);

    do {
      addWords(result, seen, current);
    } while (result.length < target && nextPermutation(current));

    return result.slice(0, target);
  }

  function randomWords(words, target, rng) {
    const result = [words.join(" ")];
    const seen = new Set(result);
    const attempts = target * 100;

    for (let attempt = 0; attempt < attempts && result.length < target; attempt++) {
      addWords(result, seen, shuffled(words, rng));
    }

    fillFromLexical(result, seen, words, target);
    return result;
  }

  function walkingWords(words, target, rng) {
    const current = words.slice();
    const result = [current.join(" ")];
    const seen = new Set(result);
    const attempts = target * 120;

    for (let attempt = 0; attempt < attempts && result.length < target; attempt++) {
      const first = rng.integer(current.length);
      let second = rng.integer(current.length - 1);
      if (second >= first) second++;
      const swap = current[first];
      current[first] = current[second];
      current[second] = swap;
      addWords(result, seen, current);
    }

    fillFromLexical(result, seen, words, target);
    return result;
  }

  function fillFromLexical(result, seen, words, target) {
    const current = words.slice().sort(compareWords);
    do {
      addWords(result, seen, current);
    } while (result.length < target && nextPermutation(current));
  }

  function nextPermutation(values) {
    let pivot = values.length - 2;
    while (pivot >= 0 && compareWords(values[pivot], values[pivot + 1]) >= 0) pivot--;
    if (pivot < 0) return false;

    let successor = values.length - 1;
    while (compareWords(values[pivot], values[successor]) >= 0) successor--;
    const swap = values[pivot];
    values[pivot] = values[successor];
    values[successor] = swap;

    for (let left = pivot + 1, right = values.length - 1; left < right; left++, right--) {
      const tailSwap = values[left];
      values[left] = values[right];
      values[right] = tailSwap;
    }
    return true;
  }

  function shuffled(words, rng) {
    const result = words.slice();
    for (let index = result.length - 1; index > 0; index--) {
      const other = rng.integer(index + 1);
      const swap = result[index];
      result[index] = result[other];
      result[other] = swap;
    }
    return result;
  }

  function addWords(result, seen, words) {
    const line = words.join(" ");
    if (seen.has(line)) return;
    seen.add(line);
    result.push(line);
  }

  function compareWords(a, b) {
    return a < b ? -1 : a > b ? 1 : 0;
  }

  function minBigInt(a, b) {
    return a < b ? a : b;
  }

  function hashSeed(value) {
    const str = String(value);
    let hash = 2166136261;
    for (let index = 0; index < str.length; index++) {
      hash ^= str.charCodeAt(index);
      hash = Math.imul(hash, 16777619);
    }
    return hash >>> 0;
  }

  global.GysinText = Object.freeze({ permute });

  // chant() is the intent verb for a permutation poem: one call takes a phrase
  // through its permutations and sends every new order through the scissors,
  // each line cut a little deeper than the last. It lives in this addon
  // because it needs permute(); the core stays free of the dependency. Load
  // the core first, then this file, and the verb appears on every plot.
  // `descent` scales how much deeper every line is cut (0 = all lines equal);
  // every other option passes straight through to textCutup().
  const CHANT_OWN = new Set([
    "lines",
    "order",
    "seed",
    "size",
    "leading",
    "descent",
    "slices",
    "sliceOffset"
  ]);

  function chant(text, x, y, options) {
    if (!this || typeof this.textCutup !== "function") {
      throw new TypeError("chant() needs a GysinPlot instance.");
    }
    const o = options || {};
    requireFinite(x, "chant x");
    requireFinite(y, "chant y");
    const lines = o.lines === undefined ? 5 : readLimit(o.lines);
    const order = o.order === undefined ? "walk" : o.order;
    const seed = o.seed === undefined
      ? (this.globalSeed === undefined ? 1 : this.globalSeed)
      : o.seed;
    const size = o.size === undefined ? 34 : requirePositive(o.size, "chant size");
    const leading = o.leading === undefined
      ? size * 2.65
      : requirePositive(o.leading, "chant leading");
    const descent = o.descent === undefined
      ? 1
      : requireNonNegative(o.descent, "chant descent");
    const slices = o.slices === undefined
      ? 5
      : requirePositive(o.slices, "chant slices");
    const sliceOffset = o.sliceOffset === undefined
      ? 2
      : requireFinite(o.sliceOffset, "chant sliceOffset");

    const rows = permute(text, { seed, limit: lines, order });
    const ids = [];
    rows.forEach((row, index) => {
      const opts = {
        size,
        slices: Math.max(1, Math.round(slices + index * descent)),
        sliceOffset: sliceOffset + index * 4 * descent
      };
      for (const key of Object.keys(o)) {
        if (!CHANT_OWN.has(key)) opts[key] = o[key];
      }
      ids.push(this.textCutup(row, x, y + index * leading, opts));
    });
    return ids;
  }

  function requireFinite(value, label) {
    const number = Number(value);
    if (!Number.isFinite(number)) {
      throw new TypeError(`${label} must be a finite number.`);
    }
    return number;
  }

  function requirePositive(value, label) {
    const number = requireFinite(value, label);
    if (number <= 0) throw new RangeError(`${label} must be greater than zero.`);
    return number;
  }

  function requireNonNegative(value, label) {
    const number = requireFinite(value, label);
    if (number < 0) throw new RangeError(`${label} must be zero or greater.`);
    return number;
  }

  if (global.GysinPlot && global.GysinPlot.prototype && !global.GysinPlot.prototype.chant) {
    global.GysinPlot.prototype.chant = chant;
  }
})(typeof globalThis !== "undefined" ? globalThis : window);
