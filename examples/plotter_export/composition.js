(function(global) {
  "use strict";

  const WIDTH = 720;
  const HEIGHT = 900;
  const SEED = 19600319;
  const DECAY = 0.45;
  const PAPER = "#f0efe9";
  const INK = "#151515";
  const RED = "#c0392b";
  const PEN_MAP = { black: 1, red: 2 };

  function addFrames(plot) {
    plot.rect(80, -70, 544, 170, {
      fray: 0.3,
      dropout: 0.05 + DECAY * 0.2
    });
    plot.rect(80, 90, 544, 260, {
      fray: 0.3,
      dropout: 0.05 + DECAY * 0.2
    });
    plot.rect(80, 500, 544, 360, {
      fray: 0.3,
      dropout: 0.05 + DECAY * 0.2
    });
  }

  function addRules(plot) {
    for (let i = 1; i < 13; i += 1) {
      const y = 570 + i * 12.3;
      plot.line(82, y, 632, y, {
        dropout: 0.05 + DECAY * 0.35,
        rubout: DECAY * 0.42
      });
    }
  }

  function addSymbols(plot) {
    plot.symbols(70, 474, 580, 286, {
      set: '/"()-:',
      size: 20,
      alpha: 0.58,
      cluster: true,
      dropout: 0.15 + DECAY * 0.15
    });
  }

  function addRing(plot) {
    plot.circle(256, 337, 450, {
      stroke: RED,
      layer: "red",
      repeat: 3,
      rubout: 0.2,
      alpha: 0.7
    });
  }

  function addHand(plot) {
    for (let i = 0; i < 4; i += 1) {
      plot.asemic(160 * i, 690, 150, 210, {
        stroke: RED,
        layer: "red",
        breathe: 1.4
      });
    }
  }

  function addWords(plot) {
    plot.underwood("REMEMBERS", 82, 360, {
      size: 50,
      stroke: RED,
      layer: "red",
      bold: true,
      wear: 1.2 + DECAY * 2,
      strokeWeight: 1.4
    });
    plot.underwood("Brion Gysin", 70, 88);
    plot.underwood("Observe", 470, 88, {
      underline: 1,
      stroke: RED,
      layer: "red"
    });
    plot.underwood("Continue", 60, 260, { bold: true });
    plot.underwood("the small voice.", 60, 190);
    plot.underwood("Ghosts are real", 62, 425, {
      size: 26,
      wear: 1.4
    });
    plot.underwood("and KICK THAT HABIT MAN", 72, 470, {
      wear: 3
    });
  }

  function addWrite(plot) {
    plot.text("write", 60, 220, {
      size: 64,
      breathe: 0.4
    });
    plot.text("write", 60, 360, {
      size: 64,
      breathe: 1.4,
      dropout: 0.08
    });
    plot.text("write", 60, 420, {
      size: 64,
      breathe: 2.2,
      dropout: 0.2,
      rubout: 0.2
    });
  }

  const BUILDERS = Object.freeze({
    frames: addFrames,
    rules: addRules,
    symbols: addSymbols,
    ring: addRing,
    hand: addHand,
    words: addWords,
    write: addWrite
  });
  const STEPS = Object.freeze(Object.keys(BUILDERS));

  function build(options) {
    const o = options || {};
    const plot = new global.GysinPlot({
      p: o.p || null,
      seed: o.seed === undefined ? SEED : o.seed,
      width: WIDTH,
      height: HEIGHT,
      style: { stroke: INK },
      export: { layer: "black" }
    });

    if (o.step !== undefined) {
      if (!Object.prototype.hasOwnProperty.call(BUILDERS, o.step)) {
        throw new RangeError(`Unknown poster step: ${o.step}`);
      }
      BUILDERS[o.step](plot);
    } else {
      STEPS.forEach(function(step) {
        BUILDERS[step](plot);
      });
    }

    return {
      plot,
      width: WIDTH,
      height: HEIGHT,
      paper: PAPER,
      penMap: PEN_MAP
    };
  }

  global.GysinWorks = global.GysinWorks || {};
  global.GysinWorks.plotterPoster = Object.freeze({
    width: WIDTH,
    height: HEIGHT,
    seed: SEED,
    paper: PAPER,
    ink: INK,
    red: RED,
    penMap: PEN_MAP,
    steps: STEPS,
    build
  });
})(typeof window === "undefined" ? globalThis : window);
