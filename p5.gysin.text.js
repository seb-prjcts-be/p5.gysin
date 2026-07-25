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
  const SPLICE_UNITS = new Set(["word", "phrase", "clause"]);
  const MIN_SPLICE_SOURCES = 2;
  const MAX_SPLICE_SOURCES = 8;
  const MAX_SPLICE_SOURCE_LENGTH = 20000;
  const MAX_SPLICE_LINES = 100;
  const MIN_SPLICE_FRAGMENTS = 2;
  const MAX_SPLICE_FRAGMENTS = 6;

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

  function spliceSources(input, options = {}) {
    const sources = normalizeSpliceSources(input);
    const seed = options.seed === undefined ? 1 : options.seed;
    const unit = options.unit === undefined ? "phrase" : String(options.unit);
    if (!SPLICE_UNITS.has(unit)) {
      throw new RangeError(`unit must be one of: ${Array.from(SPLICE_UNITS).join(", ")}.`);
    }
    const lineCount = boundedWholeNumber(
      options.lines === undefined ? 4 : options.lines,
      "lines",
      1,
      MAX_SPLICE_LINES
    );
    const fragmentCount = boundedWholeNumber(
      options.fragments === undefined ? 3 : options.fragments,
      "fragments",
      MIN_SPLICE_FRAGMENTS,
      MAX_SPLICE_FRAGMENTS
    );
    const pools = sources.map((source) => spliceUnits(source, unit));
    if (pools.some((pool) => pool.length === 0)) {
      throw new RangeError(`splice() could not find a ${unit} fragment in every source.`);
    }

    const rng = new SeededRandom(seed);
    const lines = [];
    const seen = new Set();
    const attempts = lineCount * 80;

    for (let attempt = 0; attempt < attempts && lines.length < lineCount; attempt++) {
      const fragments = [];
      let previousSource = -1;
      for (let index = 0; index < fragmentCount; index++) {
        const available = pools
          .map((pool, sourceIndex) => ({ pool, sourceIndex }))
          .filter((entry) => entry.sourceIndex !== previousSource);
        const selected = available[rng.integer(available.length)];
        const token = selected.pool[rng.integer(selected.pool.length)];
        fragments.push(Object.freeze({
          source: sources[selected.sourceIndex].id,
          sourceIndex: selected.sourceIndex,
          start: token.start,
          end: token.end,
          text: token.text
        }));
        previousSource = selected.sourceIndex;
      }

      const text = joinSpliceFragments(fragments);
      if (!text || seen.has(text)) continue;
      seen.add(text);
      lines.push(Object.freeze({
        text,
        fragments: Object.freeze(fragments)
      }));
    }

    if (lines.length === 0) {
      throw new RangeError("splice() could not form a unique line from these sources.");
    }

    return Object.freeze({
      seed,
      unit,
      lines: Object.freeze(lines)
    });
  }

  function normalizeSpliceSources(input) {
    if (!Array.isArray(input)) {
      throw new TypeError("splice() sources must be an array.");
    }
    if (input.length < MIN_SPLICE_SOURCES || input.length > MAX_SPLICE_SOURCES) {
      throw new RangeError(`splice() needs from ${MIN_SPLICE_SOURCES} through ${MAX_SPLICE_SOURCES} sources.`);
    }

    const seen = new Set();
    return input.map((entry, index) => {
      const stringSource = typeof entry === "string";
      const objectSource = entry && typeof entry === "object" && !Array.isArray(entry);
      if (!stringSource && (!objectSource || typeof entry.text !== "string")) {
        throw new TypeError(`splice() source ${index + 1} must be text or an object with text.`);
      }
      const id = objectSource && entry.id !== undefined ? String(entry.id).trim() : `source-${index + 1}`;
      const text = String(objectSource ? entry.text : entry).trim();
      if (!id) throw new TypeError(`splice() source ${index + 1} needs a non-empty id.`);
      if (seen.has(id)) throw new RangeError(`splice() source id "${id}" is duplicated.`);
      if (!text) throw new TypeError(`splice() source "${id}" needs visible text.`);
      if (text.length > MAX_SPLICE_SOURCE_LENGTH) {
        throw new RangeError(`splice() source "${id}" exceeds ${MAX_SPLICE_SOURCE_LENGTH} characters.`);
      }
      seen.add(id);
      return Object.freeze({ id, text });
    });
  }

  function spliceUnits(source, unit) {
    if (unit === "word") return wordUnits(source.text);
    if (unit === "clause") return clauseUnits(source.text);
    const words = wordUnits(source.text);
    const units = [];
    for (let start = 0; start < words.length; start++) {
      for (let length = 2; length <= 4 && start + length <= words.length; length++) {
        const first = words[start];
        const last = words[start + length - 1];
        units.push({
          start: first.start,
          end: last.end,
          text: source.text.slice(first.start, last.end)
        });
      }
    }
    return units.length ? units : words;
  }

  function wordUnits(text) {
    return Array.from(text.matchAll(/\S+/gu), (match) => ({
      start: match.index,
      end: match.index + match[0].length,
      text: match[0]
    }));
  }

  function clauseUnits(text) {
    const units = [];
    const pattern = /[^,;:\n.!?—–]+(?:[,;:\n.!?—–]+|$)/gu;
    for (const match of text.matchAll(pattern)) {
      let start = match.index;
      let end = match.index + match[0].length;
      while (start < end && /\s/u.test(text[start])) start++;
      while (end > start && /\s/u.test(text[end - 1])) end--;
      if (end > start) units.push({ start, end, text: text.slice(start, end) });
    }
    return units;
  }

  function joinSpliceFragments(fragments) {
    return fragments
      .map((fragment) => fragment.text.replace(/\s+/gu, " ").trim())
      .filter(Boolean)
      .join(" ")
      .replace(/\s+([,.;:!?])/gu, "$1")
      .replace(/([([{])\s+/gu, "$1")
      .trim();
  }

  function boundedWholeNumber(value, label, min, max) {
    const number = Number(value);
    if (!Number.isInteger(number) || number < min || number > max) {
      throw new RangeError(`${label} must be a whole number from ${min} through ${max}.`);
    }
    return number;
  }

  global.GysinText = Object.freeze({ permute, splice: spliceSources });

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

  const SPLICE_OWN = new Set([
    "seed",
    "lines",
    "unit",
    "fragments",
    "size",
    "leading"
  ]);

  function splicePlot(sources, x, y, options) {
    if (!this || typeof this.text !== "function" || typeof this.update !== "function") {
      throw new TypeError("splice() needs a GysinPlot instance.");
    }
    const o = options || {};
    const startX = requireFinite(x, "splice x");
    const startY = requireFinite(y, "splice y");
    const seed = o.seed === undefined
      ? (this.globalSeed === undefined ? 1 : this.globalSeed)
      : o.seed;
    const size = o.size === undefined ? 26 : requirePositive(o.size, "splice size");
    const leading = o.leading === undefined
      ? 42
      : requirePositive(o.leading, "splice leading");
    const result = spliceSources(sources, {
      seed,
      lines: o.lines,
      unit: o.unit,
      fragments: o.fragments
    });
    const ids = [];

    result.lines.forEach((line, index) => {
      const textOptions = { size };
      for (const key of Object.keys(o)) {
        if (!SPLICE_OWN.has(key)) textOptions[key] = o[key];
      }
      const id = this.text(line.text, startX, startY + index * leading, textOptions);
      this.update(id, {
        params: {
          splice: {
            seed,
            unit: result.unit,
            line: index,
            fragments: line.fragments.map((fragment) => Object.assign({}, fragment))
          }
        }
      });
      ids.push(id);
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

  const coreChant = global.GysinPlot && global.GysinPlot.prototype && global.GysinPlot.prototype.chant;
  if (global.GysinPlot && global.GysinPlot.prototype && (!coreChant || coreChant.gysinAddonStub)) {
    global.GysinPlot.prototype.chant = chant;
  }
  const coreSplice = global.GysinPlot && global.GysinPlot.prototype && global.GysinPlot.prototype.splice;
  if (global.GysinPlot && global.GysinPlot.prototype && (!coreSplice || coreSplice.gysinAddonStub)) {
    global.GysinPlot.prototype.splice = splicePlot;
  }
})(typeof globalThis !== "undefined" ? globalThis : window);
