(function() {
  "use strict";

  // Each preview draws the shared composition once and scales it to the plate;
  // the poster is never rebuilt at preview size.
  function previewSize(box) {
    const width = Math.max(280, Math.floor(box.offsetWidth || 420));
    const ratio = Number(box.dataset.ratio) || 1.4138889;
    return { width: width, height: Math.floor(width * ratio) };
  }

  function makePosterPreview(box) {
    const work = window.GysinWorks[box.dataset.work];
    let sketch = null;

    new p5(function(p) {
      let plot;
      sketch = p;

      p.setup = function() {
        const size = previewSize(box);
        p.createCanvas(size.width, size.height).parent(box);
        p.pixelDensity(1);
        p.noLoop();
        plot = work.build({ p: p }).plot;
      };

      p.draw = function() {
        p.background(work.paper);
        p.push();
        p.scale(p.width / work.width);
        plot.draw();
        p.pop();
      };

      p.windowResized = function() {
        if (box.offsetWidth) refresh();
      };
    }, box);

    // A plate opens from hidden, so re-measure it at the open panel's width.
    function refresh() {
      if (!sketch || !sketch.canvas) return;
      const size = previewSize(box);
      if (sketch.width === size.width) return;
      sketch.resizeCanvas(size.width, size.height);
      sketch.redraw();
    }

    return { refresh: refresh };
  }

  // The sheet turner follows Openings: the contact sheet stays, and one plate
  // at a time enters the normal document flow while the primary navigation
  // stays put. Without JavaScript every plate remains a regular anchor target.
  const tiles = Array.from(document.querySelectorAll(".cs-tile[data-page]"));
  const previous = document.getElementById("plate-prev");
  const next = document.getElementById("plate-next");
  if (!tiles.length || !previous || !next) return;

  const items = tiles
    .map(function(tile) {
      const href = tile.getAttribute("href");
      const plate = href && href.charAt(0) === "#" ? document.querySelector(href) : null;
      return { tile: tile, plate: plate, slug: tile.dataset.slug, preview: null };
    })
    .filter(function(item) { return item.plate; });
  if (!items.length) return;

  let current = -1;

  document.body.classList.add("folder");
  items.forEach(function(item) {
    item.tile.setAttribute("aria-expanded", "false");
  });

  function openPlate(index, options) {
    options = options || {};
    current = (index + items.length) % items.length;
    previous.hidden = false;
    next.hidden = false;
    items.forEach(function(item, i) {
      item.plate.classList.toggle("plate-active", i === current);
      item.tile.classList.toggle("active", i === current);
      item.tile.setAttribute("aria-expanded", i === current ? "true" : "false");
    });

    // Draw the poster the first time its plate opens, once it has a width.
    const item = items[current];
    if (!item.preview) {
      item.preview = makePosterPreview(item.plate.querySelector(".ex-canvas"));
    } else {
      item.preview.refresh();
    }

    if (options.history !== false) {
      history.replaceState(null, "", "#sheet-" + item.slug);
    }
    if (options.scroll !== false) {
      const shown = current;
      requestAnimationFrame(function() {
        if (current === shown) items[shown].plate.scrollIntoView({ block: "start" });
      });
    }
  }

  function closePlates(options) {
    options = options || {};
    const closing = current;
    current = -1;
    previous.hidden = true;
    next.hidden = true;
    items.forEach(function(item) {
      item.plate.classList.remove("plate-active");
      item.tile.classList.remove("active");
      item.tile.setAttribute("aria-expanded", "false");
    });
    if (options.updateHistory !== false) {
      history.replaceState(null, "", location.pathname + location.search);
    }
    if (options.restoreFocus !== false && items[closing] && items[closing].tile) {
      items[closing].tile.focus();
    }
  }

  tiles.forEach(function(tile) {
    const index = items.findIndex(function(item) { return item.tile === tile; });
    if (index === -1) return;
    tile.addEventListener("click", function(event) {
      event.preventDefault();
      if (current === index) closePlates();
      else openPlate(index);
    });
  });

  previous.addEventListener("click", function() {
    if (current !== -1) openPlate(current - 1);
  });
  next.addEventListener("click", function() {
    if (current !== -1) openPlate(current + 1);
  });
  document.addEventListener("keydown", function(event) {
    if (current === -1) return;
    if (event.key === "Escape") {
      closePlates();
      return;
    }
    const target = event.target;
    if (target && (
      target.isContentEditable ||
      target.tagName === "INPUT" ||
      target.tagName === "TEXTAREA" ||
      target.tagName === "SELECT"
    )) return;
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      openPlate(current - 1);
    } else if (event.key === "ArrowRight") {
      event.preventDefault();
      openPlate(current + 1);
    }
  });

  // Deep links: #sheet-<slug>, plus the plate anchors. With no hash the first
  // poster opens, so the page never starts as an empty contact sheet.
  function openFromHash() {
    const hash = location.hash;
    let start = -1;
    let ordinaryTarget = null;
    if (hash.indexOf("#sheet-") === 0) {
      start = items.findIndex(function(item) { return item.slug === hash.slice(7); });
    } else if (hash) {
      start = items.findIndex(function(item) { return item.tile.getAttribute("href") === hash; });
      if (start === -1) {
        try {
          ordinaryTarget = document.querySelector(hash);
        } catch (error) { /* invalid hash: leave the current sheet untouched */ }
      }
    }
    if (start !== -1) openPlate(start);
    else if (!hash && current === -1) openPlate(0, { scroll: false, history: false });
    else if (current !== -1) {
      closePlates({ updateHistory: false, restoreFocus: false });
      if (ordinaryTarget) {
        requestAnimationFrame(function() {
          ordinaryTarget.scrollIntoView({ block: "start" });
        });
      }
    }
  }
  openFromHash();
  window.addEventListener("hashchange", openFromHash);
})();
