(function() {
  "use strict";

  const poster = window.GysinPoster;
  const live = new Map();
  const state = { format: "A4" };
  const FORMATS = {
    A5: "148 × 210 mm",
    A4: "210 × 297 mm",
    A3: "297 × 420 mm",
    A2: "420 × 594 mm"
  };

  function canvasSize(element) {
    const width = Math.max(280, Math.round(element.clientWidth || 420));
    return {
      width,
      height: Math.round(width * poster.height / poster.width)
    };
  }

  function buildPlot(record) {
    const step = record.step === "all" ? undefined : record.step;
    record.work = poster.build({
      p: record.p,
      seed: poster.seed,
      step
    });
  }

  function paint(record) {
    record.p.background(poster.paper);
    if (!record.work) return;
    record.p.push();
    record.p.scale(record.p.width / poster.width);
    record.work.plot.draw();
    record.p.pop();
  }

  function resizePreview(record) {
    const size = canvasSize(record.element);
    if (record.p.width !== size.width || record.p.height !== size.height) {
      record.p.resizeCanvas(size.width, size.height);
    }
    record.p.redraw();
  }

  function ensurePreview(element) {
    if (live.has(element)) {
      resizePreview(live.get(element));
      return;
    }

    const record = {
      element,
      step: element.dataset.step,
      p: null,
      work: null
    };
    live.set(element, record);

    new p5(function(p) {
      record.p = p;
      p.setup = function() {
        const size = canvasSize(element);
        p.createCanvas(size.width, size.height).parent(element);
        p.pixelDensity(1);
        p.noLoop();
        buildPlot(record);
      };
      p.draw = function() {
        paint(record);
      };
    }, element);
  }

  function activatePreviews(module) {
    window.requestAnimationFrame(function() {
      module.querySelectorAll(".ce-canvas[data-step]").forEach(ensurePreview);
    });
  }

  window.copyCode = function(button) {
    const code = button.parentElement.querySelector("code");
    navigator.clipboard.writeText(code.innerText).then(function() {
      const label = button.textContent;
      button.textContent = "Copied";
      window.setTimeout(function() {
        button.textContent = label;
      }, 1200);
    });
  };

  const modules = Array.from(document.querySelectorAll("section.ce-module"));
  const chips = Array.from(document.querySelectorAll(".ce-chips a"));
  let current = -1;

  function show(index, updateLocation) {
    current = (index + modules.length) % modules.length;
    modules.forEach(function(module, moduleIndex) {
      module.classList.toggle("chapter-active", moduleIndex === current);
    });
    chips.forEach(function(chip) {
      chip.classList.toggle("active", chip.getAttribute("href") === `#${modules[current].id}`);
    });
    if (updateLocation !== false) {
      history.replaceState(null, "", `#${modules[current].id}`);
    }
    activatePreviews(modules[current]);
  }

  document.body.classList.add("chapters");
  chips.forEach(function(chip) {
    chip.addEventListener("click", function(event) {
      const target = document.querySelector(chip.getAttribute("href"));
      const index = modules.indexOf(target);
      if (index === -1) return;
      event.preventDefault();
      show(index);
    });
  });
  document.getElementById("chapter-prev").addEventListener("click", function() {
    show(current - 1);
  });
  document.getElementById("chapter-next").addEventListener("click", function() {
    show(current + 1);
  });
  document.addEventListener("keydown", function(event) {
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

  const formatControl = document.getElementById("poster-format");
  const output = document.getElementById("physical-settings");

  function updatePhysicalSettings() {
    output.textContent =
      `${state.format} · ${FORMATS[state.format]} · 10 mm margin · ` +
      "black layer → pen 1 · red layer → pen 2";
  }

  formatControl.addEventListener("change", function() {
    state.format = formatControl.value;
    updatePhysicalSettings();
  });

  document.getElementById("poster-download").addEventListener("click", function() {
    const work = poster.build({ seed: poster.seed });
    work.plot.downloadPlotterSVG(`gysin-remembers-${state.format.toLowerCase()}.svg`, {
      page: state.format,
      penMap: poster.penMap
    });
  });

  window.addEventListener("resize", function() {
    const active = modules[current];
    if (!active) return;
    active.querySelectorAll(".ce-canvas[data-step]").forEach(function(element) {
      const record = live.get(element);
      if (record) resizePreview(record);
    });
  });

  updatePhysicalSettings();
})();
