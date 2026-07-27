(function (global) {
  "use strict";

  const WIDTH = 560;
  const HEIGHT = 792;
  const SEED = 19600319;
  const PAPER = "#f0efe9";
  const INK = "#17140f";
  const RED = "#c0392b";

  const FORMATS = Object.freeze({
    A4: Object.freeze({ width: 210, height: 297 }),
    A3: Object.freeze({ width: 297, height: 420 }),
    A2: Object.freeze({ width: 420, height: 594 })
  });

  const LAYERS = Object.freeze({
    frame: "frame",
    rules: "rules",
    word: "word",
    machine: "machine",
    fields: "fields",
    return: "return",
    hand: "hand"
  });

  const PEN_MAP = Object.freeze({
    frame: 1,
    rules: 1,
    word: 1,
    machine: 1,
    fields: 1,
    return: 2,
    hand: 2
  });

  const SOURCES = Object.freeze({
    rubOut: "I rub out the word.",
    breathe: "Words breathe you IN.",
    word: "WRITE",
    returnWord: "REMEMBERS",
    permutation: "CUT TURN RETURN"
  });

  const INGREDIENTS = Object.freeze([
    "frames",
    "rules",
    "word",
    "permutation",
    "cut",
    "surface",
    "letters",
    "marks",
    "typed",
    "turn",
    "return",
    "worn",
    "hand",
    "ink"
  ]);

  function measures(width, height) {
    const sx = width / WIDTH;
    const sy = height / HEIGHT;
    return {
      x(value) { return value * sx; },
      y(value) { return value * sy; },
      w(value) { return value * sx; },
      h(value) { return value * sy; },
      s(value) { return value * Math.min(sx, sy); }
    };
  }

  function black(layer, extra) {
    return Object.assign({ layer, stroke: INK }, extra || {});
  }

  function red(layer, extra) {
    return Object.assign({ layer, stroke: RED }, extra || {});
  }

  function addFrames(plot, m) {
    const style = black(LAYERS.frame, { breathe: m.s(0.35), dropout: 0.04 });
    plot.rect(m.x(30), m.y(28), m.w(500), m.h(160), style);
    plot.rect(m.x(30), m.y(210), m.w(500), m.h(245), style);
    plot.rect(m.x(30), m.y(478), m.w(500), m.h(270), style);
  }

  function addRules(plot, m) {
    for (let row = 0; row < 6; row++) {
      const y = m.y(510 + row * 15);
      plot.line(m.x(45), y, m.x(515), y, black(LAYERS.rules, {
        breathe: m.s(0.22),
        dropout: 0.08
      }));
    }
  }

  function addWord(plot, m) {
    plot.text(SOURCES.word, m.x(50), m.y(174), black(LAYERS.word, {
      size: m.s(50),
      breathe: m.s(0.3)
    }));
  }

  function addPermutation(plot, m) {
    plot.chant(SOURCES.permutation, m.x(290), m.y(72), black(LAYERS.word, {
      lines: 4,
      order: "rotate",
      size: m.s(8.5),
      leading: m.h(19)
    }));
  }

  function addCut(plot, m) {
    plot.weave([SOURCES.rubOut, SOURCES.breathe], m.x(50), m.y(255), black(LAYERS.word, {
      lines: 2,
      unit: "clause",
      fragments: 2,
      size: m.s(7.5),
      leading: m.h(18),
      maxWidth: m.w(225)
    }));
  }

  function addSurface(plot, m) {
    plot.textCutup(SOURCES.returnWord, m.x(50), m.y(397), black(LAYERS.word, {
      size: m.s(27),
      slices: 5,
      sliceOffset: m.w(7)
    }));
  }

  function addLetters(plot, m) {
    plot.letters(SOURCES.returnWord, m.x(48), m.y(515), m.w(205), m.h(72), black(LAYERS.fields, {
      size: m.s(8.2),
      glyphJitter: m.s(0.28),
      breathe: m.s(0.18),
      dropout: 0.08
    }));
  }

  function addMarks(plot, m) {
    plot.symbols(m.x(295), m.y(515), m.w(215), m.h(72), black(LAYERS.fields, {
      set: '/"()-:',
      cluster: true,
      size: m.s(8.2),
      breathe: m.s(0.18),
      dropout: 0.08
    }));
  }

  function addTyped(plot, m) {
    plot.underwood(SOURCES.rubOut, m.x(50), m.y(58), black(LAYERS.machine, {
      size: m.s(8.5)
    }));
    plot.underwood("Brion Gysin", m.x(50), m.y(79), black(LAYERS.machine, {
      size: m.s(6.5)
    }));
    plot.underwood("observe / continue", m.x(358), m.y(756), black(LAYERS.machine, {
      size: m.s(5.8)
    }));
  }

  function addTurn(plot, m) {
    plot.lattice(SOURCES.permutation, m.x(270), m.y(608), m.w(235), m.h(82), black(LAYERS.fields, {
      size: m.s(5.8),
      wear: 0.55
    }));
  }

  function addReturn(plot, m) {
    plot.circle(m.x(280), m.y(335), m.w(305), red(LAYERS.return, {
      repeat: 3,
      rubout: 0.12,
      breathe: m.s(0.35)
    }));
  }

  function addWorn(plot, m) {
    const ids = plot.rub(SOURCES.word, m.x(50), m.y(602), {
      size: m.s(21),
      stroke: INK
    });
    ids.flat(Infinity).forEach(function (id) {
      plot.update(id, { layer: LAYERS.word });
    });
  }

  function addHand(plot, m) {
    for (let gesture = 0; gesture < 4; gesture++) {
      plot.asemic(m.x(315 + gesture * 47), m.y(681), m.w(42), m.h(62), red(LAYERS.hand, {
        breathe: m.s(0.8),
        loops: 4 + (gesture % 2)
      }));
    }
  }

  function addInk(plot, m) {
    plot.line(m.x(45), m.y(444), m.x(515), m.y(444), black(LAYERS.rules, {
      breathe: m.s(0.2),
      bleed: 0.32,
      bleedPasses: 2,
      bleedSpread: m.s(0.8),
      bleedCluster: m.s(10)
    }));
  }

  const BUILDERS = Object.freeze({
    frames: addFrames,
    rules: addRules,
    word: addWord,
    permutation: addPermutation,
    cut: addCut,
    surface: addSurface,
    letters: addLetters,
    marks: addMarks,
    typed: addTyped,
    turn: addTurn,
    return: addReturn,
    worn: addWorn,
    hand: addHand,
    ink: addInk
  });

  function build(plot, options) {
    const viewport = options || {};
    const m = measures(viewport.width || WIDTH, viewport.height || HEIGHT);
    INGREDIENTS.forEach(function (name) {
      BUILDERS[name](plot, m);
    });
    return plot;
  }

  function buildStep(plot, name, options) {
    if (!Object.prototype.hasOwnProperty.call(BUILDERS, name)) {
      throw new RangeError(`Unknown poster ingredient: ${name}`);
    }
    const viewport = options || {};
    BUILDERS[name](plot, measures(viewport.width || WIDTH, viewport.height || HEIGHT));
    return plot;
  }

  function createPlot(options) {
    const settings = options || {};
    const width = settings.width === undefined ? WIDTH : settings.width;
    const height = settings.height === undefined ? HEIGHT : settings.height;
    const plot = new global.GysinPlot({
      p: settings.p || null,
      seed: settings.seed === undefined ? SEED : settings.seed,
      width,
      height,
      style: { stroke: INK }
    });
    return settings.step
      ? buildStep(plot, settings.step, { width, height })
      : build(plot, { width, height });
  }

  function pageFor(name) {
    // Advanced exception: preserve this poster's exact vertical centring.
    // The normal A5-A2 presets deliberately use top-left width fitting.
    const formatName = String(name || "A4").toUpperCase();
    const sheet = FORMATS[formatName];
    if (!sheet) throw new RangeError("Poster format must be A4, A3 or A2.");
    const scale = (sheet.width - 20) / WIDTH;
    const verticalMargin = (sheet.height - HEIGHT * scale) / 2;
    return {
      width: sheet.width,
      height: sheet.height,
      units: "mm",
      margin: {
        top: verticalMargin,
        right: 10,
        bottom: verticalMargin,
        left: 10
      },
      scale,
      clip: true
    };
  }

  global.GysinPoster = Object.freeze({
    width: WIDTH,
    height: HEIGHT,
    seed: SEED,
    paper: PAPER,
    ink: INK,
    red: RED,
    formats: FORMATS,
    layers: LAYERS,
    penMap: PEN_MAP,
    sources: SOURCES,
    ingredients: INGREDIENTS,
    build,
    buildStep,
    createPlot,
    pageFor
  });
})(typeof globalThis !== "undefined" ? globalThis : window);
