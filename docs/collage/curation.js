(function () {
  "use strict";

  const poster = window.GysinPoster;
  const live = new Map();
  const state = {
    seed: poster.seed,
    format: "A4"
  };

  function canvasSize(element) {
    const width = Math.max(280, Math.round(element.clientWidth || 420));
    return {
      width,
      height: Math.round(width * poster.height / poster.width)
    };
  }

  function buildPlot(record) {
    const p = record.p;
    const plot = poster.createPlot({
      p,
      seed: record.step === "all" ? state.seed : poster.seed,
      width: p.width,
      height: p.height,
      step: record.step === "all" ? null : record.step
    });
    record.plot = plot;
  }

  function paint(record) {
    record.p.background(poster.paper);
    if (record.plot) record.plot.draw();
  }

  function resizePreview(record) {
    const size = canvasSize(record.element);
    if (record.p.width !== size.width || record.p.height !== size.height) {
      record.p.resizeCanvas(size.width, size.height);
    }
    buildPlot(record);
    record.p.redraw();
  }

  function ensurePreview(element) {
    if (live.has(element)) {
      resizePreview(live.get(element));
      return live.get(element);
    }

    const record = {
      element,
      step: element.dataset.step,
      p: null,
      plot: null,
      instance: null
    };
    live.set(element, record);
    record.instance = new p5(function (p) {
      record.p = p;
      p.setup = function () {
        const size = canvasSize(element);
        p.createCanvas(size.width, size.height).parent(element);
        p.pixelDensity(1);
        p.noLoop();
        buildPlot(record);
      };
      p.draw = function () {
        paint(record);
      };
    }, element);
    return record;
  }

  function activatePreviews(module) {
    window.requestAnimationFrame(function () {
      module.querySelectorAll(".ce-canvas[data-step]").forEach(ensurePreview);
    });
  }

  window.copyCode = function (button) {
    const code = button.parentElement.querySelector("code");
    navigator.clipboard.writeText(code.innerText).then(function () {
      const label = button.textContent;
      button.textContent = "Copied";
      window.setTimeout(function () {
        button.textContent = label;
      }, 1200);
    });
  };

  const modules = Array.from(document.querySelectorAll("section.ce-module"));
  const chips = Array.from(document.querySelectorAll(".ce-chips a"));
  let current = -1;

  function show(index, updateLocation) {
    current = (index + modules.length) % modules.length;
    modules.forEach(function (module, moduleIndex) {
      module.classList.toggle("chapter-active", moduleIndex === current);
    });
    chips.forEach(function (chip) {
      chip.classList.toggle("active", chip.getAttribute("href") === `#${modules[current].id}`);
    });
    if (updateLocation !== false) {
      history.replaceState(null, "", `#${modules[current].id}`);
    }
    activatePreviews(modules[current]);
  }

  if (modules.length && chips.length) {
    document.body.classList.add("chapters");
    chips.forEach(function (chip) {
      chip.addEventListener("click", function (event) {
        const target = document.querySelector(chip.getAttribute("href"));
        const index = modules.indexOf(target);
        if (index === -1) return;
        event.preventDefault();
        show(index);
      });
    });

    document.getElementById("chapter-prev").addEventListener("click", function () {
      show(current - 1);
    });
    document.getElementById("chapter-next").addEventListener("click", function () {
      show(current + 1);
    });
    document.addEventListener("keydown", function (event) {
      if (event.key === "ArrowLeft") show(current - 1);
      if (event.key === "ArrowRight") show(current + 1);
    });

    let start = 0;
    try {
      const fromHash = modules.indexOf(document.querySelector(location.hash));
      if (fromHash !== -1) start = fromHash;
    } catch (error) {
      start = 0;
    }
    show(start, Boolean(location.hash));
  }

  const formatControl = document.getElementById("poster-format");
  const output = document.getElementById("physical-settings");
  const reroll = document.getElementById("poster-reroll");
  const download = document.getElementById("poster-download");

  function updatePhysicalSettings() {
    const format = poster.formats[state.format];
    output.textContent = `${state.format} · ${format.width} × ${format.height} mm · 10 mm side margin · pen 1 black · pen 2 red`;
  }

  formatControl.addEventListener("change", function () {
    state.format = formatControl.value;
    updatePhysicalSettings();
  });

  reroll.addEventListener("click", function () {
    state.seed += 1;
    live.forEach(function (record) {
      if (record.step !== "all") return;
      buildPlot(record);
      record.p.redraw();
    });
  });

  download.addEventListener("click", function () {
    const exportPlot = poster.createPlot({
      seed: state.seed,
      width: poster.width,
      height: poster.height
    });
    exportPlot.downloadPlotterSVG(`gysin-remembers-${state.format.toLowerCase()}.svg`, {
      page: poster.pageFor(state.format),
      penMap: poster.penMap,
      tool: "pen",
      optimize: true,
      title: "Gysin remembers"
    });
  });

  window.addEventListener("resize", function () {
    const active = modules[current];
    if (!active) return;
    active.querySelectorAll(".ce-canvas[data-step]").forEach(function (element) {
      const record = live.get(element);
      if (record) resizePreview(record);
    });
  });

  updatePhysicalSettings();
})();
