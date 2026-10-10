(function() {
  "use strict";

  const data = JSON.parse(document.getElementById("mf-data").textContent);
  const cards = Array.from(document.querySelectorAll(".mf-canvas"));
  const dialog = document.getElementById("mf-dialog");
  const big = document.getElementById("mf-big");
  const status = document.getElementById("mf-status");

  // One poster drawn once and scaled to its box; the composition is never
  // rebuilt at preview size. redraw(seed) swaps in another seed.
  function makePoster(box, work, seed) {
    let sketch = null;
    let plot = null;
    let current = seed;

    function size() {
      const width = Math.max(240, Math.floor(box.offsetWidth || 320));
      return { width: width, height: Math.floor(width * work.height / work.width) };
    }

    new p5(function(p) {
      sketch = p;
      p.setup = function() {
        const s = size();
        p.createCanvas(s.width, s.height).parent(box);
        p.pixelDensity(1);
        p.noLoop();
        plot = work.build({ p: p, seed: current }).plot;
      };
      p.draw = function() {
        p.background(work.paper);
        p.push();
        p.scale(p.width / work.width);
        plot.draw();
        p.pop();
      };
      p.windowResized = function() { refresh(); };
    }, box);

    function refresh() {
      if (!sketch || !sketch.canvas || !box.offsetWidth) return;
      const s = size();
      if (sketch.width === s.width) return;
      sketch.resizeCanvas(s.width, s.height);
      sketch.redraw();
    }

    return {
      refresh: refresh,
      redraw: function(nextSeed) {
        current = nextSeed;
        if (!sketch || !sketch.canvas) return;
        plot = work.build({ p: sketch, seed: current }).plot;
        sketch.redraw();
      },
      get plot() { return plot; },
      get seed() { return current; }
    };
  }

  const workFor = function(item) { return window.GysinWorks[item.key]; };
  const randomSeed = function() { return 1 + Math.floor(Math.random() * 99999); };

  // The wall: each sheet is drawn when it comes near the viewport.
  const wall = cards.map(function(box) {
    const item = data.find(function(entry) { return entry.slug === box.dataset.slug; });
    return { box: box, item: item, poster: null };
  });
  function drawOnWall(entry) {
    if (!entry.poster) entry.poster = makePoster(entry.box, workFor(entry.item), workFor(entry.item).seed);
  }
  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver(function(hits) {
      hits.forEach(function(hit) {
        if (!hit.isIntersecting) return;
        io.unobserve(hit.target);
        drawOnWall(wall.find(function(entry) { return entry.box === hit.target; }));
      });
    }, { rootMargin: "300px" });
    wall.forEach(function(entry) { io.observe(entry.box); });
  } else {
    wall.forEach(drawOnWall);
  }

  // The open sheet: one larger poster that follows whichever work is chosen.
  let open = -1;
  let bigPoster = null;
  let bigKey = null;

  function show(index, seed) {
    open = (index + data.length) % data.length;
    const item = data[open];
    const work = workFor(item);
    const next = seed === undefined ? work.seed : seed;

    document.getElementById("mf-verbs").textContent = item.verbs;
    document.getElementById("mf-title").textContent = item.title;
    document.getElementById("mf-lead").textContent = item.lead;
    document.getElementById("mf-req").textContent = item.req;
    const code = document.getElementById("mf-code");
    code.textContent = item.code;
    if (window.Prism) window.Prism.highlightElement(code);
    document.getElementById("mf-open").href = "../../examples/" + item.slug + "/";
    document.getElementById("mf-composition").href = "../../examples/" + item.slug + "/composition.js";
    big.setAttribute("aria-label", item.title + ", seed " + next);

    // A different poster needs a different canvas; the same one only a new seed.
    if (bigPoster && bigKey !== item.key) {
      big.replaceChildren();
      bigPoster = null;
    }
    if (!bigPoster) {
      bigPoster = makePoster(big, work, next);
      bigKey = item.key;
    } else {
      bigPoster.redraw(next);
    }
    status.textContent = "seed " + next;
    history.replaceState(null, "", "#" + item.slug);
  }

  function openSheet(index, seed) {
    if (!dialog.open) dialog.showModal();
    show(index, seed);
    requestAnimationFrame(function() { if (bigPoster) bigPoster.refresh(); });
  }

  function closeSheet() {
    if (dialog.open) dialog.close();
  }

  wall.forEach(function(entry, index) {
    entry.box.parentElement.addEventListener("click", function() { openSheet(index); });
  });

  document.getElementById("mf-surprise").addEventListener("click", function() {
    openSheet(Math.floor(Math.random() * data.length), randomSeed());
  });
  document.getElementById("mf-redraw").addEventListener("click", function() {
    wall.forEach(function(entry) {
      if (entry.poster) entry.poster.redraw(randomSeed());
    });
  });
  document.getElementById("mf-seed").addEventListener("click", function() {
    show(open, randomSeed());
  });
  document.getElementById("mf-svg").addEventListener("click", function() {
    const item = data[open];
    bigPoster.plot.downloadSVG("p5-gysin-" + item.slug.replace(/_/g, "-") + "-" + bigPoster.seed + ".svg");
  });
  document.getElementById("mf-plotter-svg").addEventListener("click", savePlotterSVG);
  document.getElementById("mf-dryrun").addEventListener("click", dryRun);
  document.getElementById("mf-prev").addEventListener("click", function() { show(open - 1); });
  document.getElementById("mf-next").addEventListener("click", function() { show(open + 1); });
  document.getElementById("mf-close").addEventListener("click", closeSheet);

  // The plotter file: one Inkscape layer per pen on A3. Route optimization
  // stops at 2000 traces per pen, so a dense sheet is saved in drawing order.
  function savePlotterSVG() {
    const item = data[open];
    const options = { page: "A3", penMap: workFor(item).penMap };
    const name = "p5-gysin-" + item.slug.replace(/_/g, "-") + "-" + bigPoster.seed + "-a3.svg";
    try {
      bigPoster.plot.downloadPlotterSVG(name, options);
      status.textContent = "seed " + bigPoster.seed + " · plotter SVG saved";
    } catch (error) {
      bigPoster.plot.downloadPlotterSVG(name, Object.assign({}, options, { optimize: false }));
      status.textContent = "seed " + bigPoster.seed + " · too many traces to optimize the route: saved in drawing order";
    }
  }

  // The dry run plans the poster with vanilla.penplotter and draws the route.
  // It loads the pinned release only when asked, and never touches a machine.
  const PENPLOTTER = "https://cdn.jsdelivr.net/gh/seb-prjcts-be/vanilla.penplotter@v0.5.0/vanilla.penplotter.js";
  async function dryRun() {
    const note = document.getElementById("mf-dry-status");
    const panel = document.getElementById("mf-dry");
    const button = document.getElementById("mf-dryrun");
    const item = data[open];
    const work = workFor(item);
    panel.hidden = false;
    button.disabled = true;
    try {
      const traces = bigPoster.plot.exportTraces({ page: "A3", penMap: work.penMap });
      note.textContent = traces.length > 5000
        ? "Planning " + traces.length.toLocaleString("en") + " traces. This dense sheet can take a while…"
        : "Planning " + traces.length.toLocaleString("en") + " traces…";
      await new Promise(function(resolve) { setTimeout(resolve, 60); });
      const { PlotterEngine } = await import(PENPLOTTER);
      const plot = new PlotterEngine({ units: "mm", page: { width: 297, height: 420, margin: 10 } });
      const pens = Array.from(new Set(traces.map(function(trace) { return trace.pen; }))).sort(function(a, b) { return a - b; });
      pens.forEach(function(pen) {
        const first = traces.find(function(trace) { return trace.pen === pen; });
        plot.pen({ id: "pen-" + pen, name: "Pen " + pen, color: first.stroke });
        plot.layer("pen-" + pen, { toolId: "pen-" + pen });
        traces.forEach(function(trace) {
          if (trace.pen === pen) plot.polyline(trace.points);
        });
      });
      plot.optimize({ passes: ["clean"] });   // keep every passage and every gap
      const plan = plot.plan({ strategy: "nearest" });
      plot.drawRoute(document.getElementById("mf-route").getContext("2d"), {
        showTravel: false, padding: 8, paper: "#ffffff"
      });
      const minutes = Math.round(plan.stats.estimatedSeconds / 60);
      note.textContent = plan.stats.paths.toLocaleString("en") + " paths · " + pens.length + " pens · " +
        (plan.stats.drawDistance / 1000).toFixed(1) + " m drawn · about " +
        (minutes >= 90 ? (minutes / 60).toFixed(1) + " h" : minutes + " min") + " · " +
        plan.stats.penLifts.toLocaleString("en") + " pen lifts";
    } catch (error) {
      note.textContent = "The test could not run: " + error.message;
    } finally {
      button.disabled = false;
    }
  }

  // A click on the backdrop closes; Escape is native to <dialog>.
  dialog.addEventListener("click", function(event) {
    if (event.target === dialog) closeSheet();
  });
  dialog.addEventListener("close", function() {
    if (dialog.open) return;   // a late close event after the dialog reopened
    open = -1;
    history.replaceState(null, "", location.pathname + location.search);
  });
  dialog.addEventListener("keydown", function(event) {
    if (event.key === "ArrowLeft") { event.preventDefault(); show(open - 1); }
    else if (event.key === "ArrowRight") { event.preventDefault(); show(open + 1); }
  });
  window.addEventListener("resize", function() {
    if (bigPoster) bigPoster.refresh();
  });

  // Deep link: manifested/#on_hold opens that sheet.
  const start = data.findIndex(function(item) { return "#" + item.slug === location.hash; });
  if (start !== -1) openSheet(start);
})();
