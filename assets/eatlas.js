/* Eatlas site: the mapped plate, the live phones and the step-by-step story. */
(function () {
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const $ = (el, s) => (s === undefined ? document.querySelector(el) : el.querySelector(s));
  const $$ = (el, s) => [...(s === undefined ? document.querySelectorAll(el) : el.querySelectorAll(s))];
  const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
  const ease = t => (t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
  const out = t => 1 - Math.pow(1 - t, 3);
  const fmt = n => Math.round(n).toLocaleString("en-US");

  /* icons, drawn on a 24 grid in one stroke */
  const P = {
    x: '<path d="M6 6l12 12M18 6L6 18"/>',
    lib: '<rect x="3" y="5" width="18" height="14" rx="3"/><circle cx="9" cy="10" r="1.6"/><path d="M21 16l-5-5-8 8"/>',
    boltOff: '<path d="M13 3L5 14h6l-1 7 8-11h-6z"/><path d="M3 3l18 18"/>',
    cam: '<path d="M4 8h3l2-3h6l2 3h3v11H4z"/><circle cx="12" cy="13" r="3.5"/>',
    code: '<path d="M4 6v12M7 6v12M10 6v12M14 6v12M17 6v12M20 6v12"/>',
    retake: '<path d="M4 8h3l2-3h6l2 3h3v11H4z"/><path d="M9 13a3 3 0 0 1 5.5-1.6M15 13a3 3 0 0 1-5.5 1.6"/>',
    pen: '<path d="M4 20l4-1L19 8l-3-3L5 16z"/>',
    ok: '<path d="M5 12l5 5 9-10"/>',
    sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>',
    rise: '<path d="M4 18h16M7 18a5 5 0 0 1 10 0M12 4v4M5 11l1.5 1M19 11l-1.5 1M9 7l3-3 3 3"/>',
    moon: '<path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5z"/>',
    cup: '<path d="M5 9h11v5a5 5 0 0 1-5 5h-1a5 5 0 0 1-5-5z"/><path d="M16 10h1.5a2.5 2.5 0 0 1 0 5H16M8 3v3M11 3v3"/>',
    house: '<path d="M4 11l8-7 8 7v9H4z"/><path d="M10 20v-5h4v5"/>',
    calendar: '<rect x="4" y="5" width="16" height="15" rx="3"/><path d="M4 10h16M9 3v4M15 3v4"/>',
    chart: '<path d="M6 20V11M12 20V5M18 20v-6"/>',
    person: '<circle cx="12" cy="8" r="4"/><path d="M4.5 20a7.5 7.5 0 0 1 15 0"/>',
    chevL: '<path d="M15 6l-6 6 6 6"/>', chevR: '<path d="M9 6l6 6-6 6"/>',
    spark: '<path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8z"/><path d="M19 15l.8 2.2L22 18l-2.2.8L19 21l-.8-2.2L16 18l2.2-.8z"/>',
    leaf: '<path d="M5 19c0-8 5-13 14-14 0 9-5 14-13 14z"/><path d="M5 19l8-8"/>',
    fork: '<path d="M7 3v8M5 3v5a2 2 0 0 0 4 0V3M7 11v10M16 3c-2 2-2 7 0 9v9"/>',
    drop: '<path d="M12 3s6 6.5 6 11a6 6 0 0 1-12 0c0-4.5 6-11 6-11z"/>',
    plus: '<path d="M12 5v14M5 12h14"/>', minus: '<circle cx="12" cy="12" r="9"/><path d="M8 12h8"/>',
    torch: '<path d="M9 3h6v4l-2 3v11h-2V10L9 7z"/>',
    viewfinder: '<path d="M4 8V6a2 2 0 0 1 2-2h2M16 4h2a2 2 0 0 1 2 2v2M20 16v2a2 2 0 0 1-2 2h-2M8 20H6a2 2 0 0 1-2-2v-2"/><path d="M8 10h1.5l1-1.5h3l1 1.5H16v5H8z"/><circle cx="12" cy="12.5" r="1.6"/>',
    laurel: '<path d="M7 20c6-2 10-7 10-14"/><path d="M15 9c2 0 3.5-1 4-3-2 0-3.5 1-4 3zM13 13c2 .5 3.6-.2 4.6-2-2-.5-3.6.2-4.6 2zM10.5 16.5c2 .8 3.7.3 4.9-1.3-2-.8-3.7-.3-4.9 1.3z"/>'
  };
  const icon = (s, body, cls = "") => `<svg class="ico ${cls}" width="${s}" height="${s}" viewBox="0 0 24 24" aria-hidden="true">${body}</svg>`;
  const STATUS = `<span class="ic"><svg width="18" height="12" viewBox="0 0 18 12" fill="currentColor"><rect x="0" y="8" width="3" height="4" rx="1"/><rect x="5" y="5.5" width="3" height="6.5" rx="1"/><rect x="10" y="3" width="3" height="9" rx="1"/><rect x="15" y="0" width="3" height="12" rx="1"/></svg><svg width="16" height="12" viewBox="0 0 16 12" fill="currentColor"><path d="M8 2.6c2.3 0 4.4.9 6 2.4l1.2-1.3A10.4 10.4 0 0 0 8 .8 10.4 10.4 0 0 0 .8 3.7L2 5c1.6-1.5 3.7-2.4 6-2.4zm0 3.6c1.3 0 2.5.5 3.4 1.3l1.2-1.3A6.6 6.6 0 0 0 8 4.4c-1.8 0-3.4.7-4.6 1.8l1.2 1.3c.9-.8 2.1-1.3 3.4-1.3zM8 9.8l1.9-2a2.8 2.8 0 0 0-3.8 0z"/></svg><svg width="27" height="13" viewBox="0 0 27 13"><rect x=".5" y=".5" width="23" height="12" rx="3.5" fill="none" stroke="currentColor" opacity=".4"/><rect x="2" y="2" width="17" height="9" rx="2" fill="currentColor"/><path d="M25 4.5v4c.8-.3 1.3-1.1 1.3-2s-.5-1.7-1.3-2z" fill="currentColor" opacity=".45"/></svg></span>`;
  const sb = (light = false) => `<div class="sb${light ? " light" : ""}"><span>1:05</span>${STATUS}</div>`;
  const tabbar = on => `<div class="tabbar">${[["house", "Home"], ["calendar", "Diary"], ["chart", "Insights"], ["person", "Me"]].map(([ic, n]) => `<span class="${n === on ? "on" : ""}">${icon(24, P[ic])}${n}</span>`).join("")}</div>`;
  const mealIcon = t => `<span class="mt">${icon(16, P[{ Breakfast: "rise", Lunch: "sun", Dinner: "moon", Snacks: "cup" }[t]])}</span>`;
  const recent = (time, name, type, kcal, fresh) => `<div class="trow${fresh ? " new" : ""}"><span class="tm">${time}</span><span class="nm">${name}<small>${type}</small></span><small>${kcal} kcal</small></div>`;

  /* the example meal. The weights and calories are estimates for this photo, not a recorded scan. */
  const MEAL = { name: "Salmon poke bowl", k: 623, p: 35, f: 29, c: 54,
    ing: [["Salmon", 120], ["Rice", 150], ["Edamame", 50], ["Cucumber", 60], ["Seaweed", 40], ["Sesame sauce", 20]] };
  const PHOTO = "img/plate-720.webp";
  /* one day, the same on the Home screen, the widgets and the diary: five meals, earliest first */
  const DAY = { k: 1373, p: 63, f: 58, c: 150, meals: 5,
    list: [["Snacks", "Flat white", 110], ["Breakfast", "Oat porridge", 320], ["Snacks", "Apple with almond butter", 210], ["Lunch", MEAL.name, MEAL.k], ["Snacks", "Flat white", 110]] };
  const DAY0 = { k: 1263, p: 57, f: 52, c: 141 };                       // before the second flat white
  const MACROS = [["Protein", "protein", "p", 130], ["Fat", "fat", "f", 70], ["Carbs", "carbs", "c", 235]];
  const pc = (v, of) => Math.round((v / of) * 100) + "%";

  /* ===================== the hero: one photo, every ingredient mapped ===================== */
  (function atlas() {
    const fig = $(".atlas"); if (!fig) return;
    const svg = $(fig, "svg");
    // the bowl is the circle (500, 350) r 300 in the 1000 × 700 drawing; [name, anchor x, anchor y]
    const AT = { Salmon: [364, 199], Rice: [262, 334], Seaweed: [440, 560], Cucumber: [539, 244], Edamame: [703, 399], "Sesame sauce": [569, 474] };
    const items = MEAL.ing.map(([n, g]) => [n, `${g} g`, ...AT[n]]);
    const side = (list, right) => {
      list.sort((a, b) => a[3] - b[3]);
      let y = -1e9; const ys = list.map(i => (y = Math.max(i[3], y + 92)));
      const over = ys[ys.length - 1] - 640; if (over > 0) ys.forEach((v, k) => (ys[k] = Math.max(70 + k * 92, v - over)));
      return list.map((i, k) => {
        const ly = ys[k], ex = right ? 812 : 188, lx = right ? 832 : 168, a = right ? "start" : "end", d = `M${i[2]} ${i[3]} L${ex} ${ly} L${lx + (right ? -8 : 8)} ${ly}`;
        return `<g data-i><path class="ln halo" d="${d}"/><path class="ln" d="${d}"/><circle class="pt" cx="${i[2]}" cy="${i[3]}" r="6"/>` +
          `<g class="tx"><text class="lab" x="${lx}" y="${ly + 2}" text-anchor="${a}">${i[0]}</text><text class="sub" x="${lx}" y="${ly + 28}" text-anchor="${a}">${i[1]}</text></g></g>`;
      }).join("");
    };
    svg.insertAdjacentHTML("beforeend", side(items.filter(i => i[2] < 500), false) + side(items.filter(i => i[2] >= 500), true));
    $(fig, "ul").innerHTML = MEAL.ing.map(([n, g]) => `<li>${n}<span>${g} g</span></li>`).join("");
    const marks = $$(fig, "[data-i]"), nums = $$(fig, "[data-t]");
    const set = e => nums.forEach(n => (n.textContent = fmt(MEAL[n.dataset.t] * e)));
    const count = ms => { const t0 = performance.now(); const step = t => { const k = clamp((t - t0) / ms); set(out(k)); if (k < 1) requestAnimationFrame(step); }; requestAnimationFrame(step); };
    let timers = [];
    // nothing is known before the scan: the sweep passes, each ingredient gets its line, then the totals count up
    const play = () => {
      timers.forEach(clearTimeout); timers = [];
      marks.forEach(m => m.classList.remove("on")); fig.classList.remove("done"); set(0);
      if (reduce) { marks.forEach(m => m.classList.add("on")); fig.classList.add("done"); set(1); return; }
      fig.classList.remove("scan"); void fig.offsetWidth; fig.classList.add("scan");
      marks.forEach((m, k) => timers.push(setTimeout(() => m.classList.add("on"), 1500 + k * 420)));
      timers.push(setTimeout(() => { fig.classList.add("done"); count(1100); }, 1500 + marks.length * 420));
    };
    play();
    if (!reduce) {
      let loop = 0;
      new IntersectionObserver(([e]) => { clearInterval(loop); if (e.isIntersecting) loop = setInterval(play, 15000); }, { threshold: .4 }).observe(fig);
    }
  })();

  /* ===================== a live phone ===================== */
  function mountDevice(wrap, opts) {
    wrap.innerHTML = `<div class="dev"><span class="island"></span><div class="scr"></div></div>`;
    const scr = $(wrap, ".scr");
    let timers = [], frames = [];
    const later = (ms, fn) => { const id = setTimeout(fn, reduce ? 0 : ms); timers.push(id); };
    const seq = steps => { let t = 0; steps.forEach(([ms, fn]) => { t += ms; later(t, fn); }); };
    const tween = (dur, fn, done) => {
      if (reduce) { fn(1); if (done) done(); return; }
      const t0 = performance.now();
      const step = now => { const k = clamp((now - t0) / dur); fn(k); if (k < 1) frames.push(requestAnimationFrame(step)); else if (done) done(); };
      frames.push(requestAnimationFrame(step));
    };
    const count = (els, from, to, dur = 1100, f = fmt) => tween(dur, k => [].concat(els).forEach(e => (e.textContent = f(from + (to - from) * out(k)))));
    const tap = el => { if (!el || reduce) return; el.classList.remove("tap"); void el.offsetWidth; el.classList.add("tap"); };
    const type = (el, values, gap = 150) => values.forEach((v, i) => later(i * gap, () => (el.textContent = v)));
    const ctx = { scr, later, seq, tween, count, tap, type, q: s => $(scr, s), qa: s => $$(scr, s) };
    SCENES[opts.scene](ctx, opts.play);
    function size() {
      const h = opts.height();
      wrap.style.setProperty("--s", (h / 864).toFixed(4));
    }
    addEventListener("resize", size); size();
    return {
      destroy() { removeEventListener("resize", size); timers.forEach(clearTimeout); frames.forEach(cancelAnimationFrame); timers = []; frames = []; }
    };
  }

  /* the review screen, shared by the scan and the editing steps */
  const review = (vals, shown) => `<div class="layer rev${shown.scrolled ? " scrolled" : ""}${shown.on ? "" : " off"}" data-l="rev">
    <div class="body">
      <div class="photo"><img src="${PHOTO}" alt=""><div class="x">${icon(18, P.x)}</div><div class="retake">${icon(15, P.retake)}Retake photo</div></div>
      <div class="head">
        <div class="meta">${icon(14, P.fork)}Today • 1:05 PM</div>
        <div class="name">${MEAL.name} ${icon(13, P.pen)}</div>
        <div class="kcalrow"><div class="kcal"><b data-k>${vals.k}</b><span>kcal</span>${icon(13, P.pen)}</div><div class="ied"><b>Calories</b><span class="fld" data-kf>${vals.k}</span><small>kcal</small><em>Done</em></div></div>
      </div>
      <div class="macros">
        <div class="mcard" style="--t:var(--protein)"><small>Protein</small><b><span data-p>${vals.p}</span><i>g</i></b></div>
        <div class="mcard" style="--t:var(--fat)"><small>Fat</small><b><span data-f>${vals.f}</span><i>g</i></b></div>
        <div class="mcard" style="--t:var(--carbs)"><small>Carbs</small><b><span data-c>${vals.c}</span><i>g</i></b></div>
      </div>
      <div class="surf card"><h5>Ingredients ${icon(16, P.pen)}</h5>${MEAL.ing.slice(0, 4).map(([n, g]) => `<div class="ing${shown.ing ? "" : " hide"}" data-ing="${n}">${n}<span>${g} g</span></div>`).join("")}</div>
      <div class="surf card"><h5>Meal type</h5><div class="chips"><span>Breakfast</span><span class="on">Lunch</span><span>Dinner</span><span>Snacks</span></div></div>
    </div>
    <div class="savebar"><div>${icon(18, P.ok)}Save</div></div>
  </div>`;

  /* ===================== the seven scenes, one per step ===================== */
  const SCENES = [
    // 1 · snap: the shutter, the analysis, then the numbers
    (c, play) => {
      c.scr.innerHTML = `${sb(true)}
        <div class="layer cam" data-l="cam">
          <div class="feed"><img src="${PHOTO}" alt=""></div>
          <div class="btn x">${icon(18, P.x)}</div>
          <div class="ctrl"><span class="s50">${icon(22, P.lib)}</span><span class="shutter"></span><span class="s50">${icon(20, P.boltOff)}</span></div>
          <div class="mode"><span class="on">${icon(17, P.cam)}Photo</span><span>${icon(17, P.code)}Barcode</span></div>
        </div>
        <div class="layer ana off" data-l="ana"><div class="pic"><img src="${PHOTO}" alt=""></div><div class="spin"></div><h4>Analyzing your meal</h4><div class="cancel">Cancel</div></div>
        ${review({ k: 0, p: 0, f: 0, c: 0 }, { on: false, ing: false })}
        <div class="flash"></div><div class="home-ind light"></div>`;
      if (!play) return;
      const show = n => ["cam", "ana", "rev"].forEach(k => c.q(`[data-l="${k}"]`).classList.toggle("off", k !== n));
      const sbar = c.q(".sb"), ind = c.q(".home-ind");
      c.seq([
        [800, () => { c.q(".shutter").classList.add("press"); c.q(".flash").classList.add("go"); }],
        [180, () => { c.q(".shutter").classList.remove("press"); show("ana"); sbar.classList.remove("light"); ind.classList.remove("light"); }],
        [1800, () => show("rev")],
        [250, () => { c.count(c.q("[data-k]"), 0, MEAL.k); c.count(c.q("[data-p]"), 0, MEAL.p); c.count(c.q("[data-f]"), 0, MEAL.f); c.count(c.q("[data-c]"), 0, MEAL.c); }],
        [1500, () => c.q(".rev").classList.add("scrolled")],
        ...c.qa(".ing").map((el, i) => [i ? 260 : 900, () => el.classList.remove("hide")])
      ]);
    },

    // 2 · every ingredient, weighed: fix a weight, then the calories, by hand
    (c, play) => {
      const rows = MEAL.ing.map(([n, g]) => `<div class="irow"><b>${n}</b><span class="amt" data-amt="${n}">${g}</span><span class="u">g</span><span class="rm">${icon(20, P.minus)}</span></div>`).join("");
      c.scr.innerHTML = `${sb()}${review(MEAL, { on: true, ing: true, scrolled: true })}
        <div class="sheet"><div class="grab"></div><div class="nav"><span style="visibility:hidden">Done</span><b>Ingredients</b><span data-done>Done</span></div>${rows}</div>
        <div class="home-ind"></div>`;
      if (!play) return;
      const sheet = c.q(".sheet"), amt = c.q('[data-amt="Rice"]'), row = c.q('[data-ing="Rice"] span'), kr = c.q(".kcalrow"), kb = c.q("[data-k]");
      c.seq([
        [900, () => c.tap(c.q(".card h5"))],
        [300, () => sheet.classList.add("up")],
        [1000, () => { c.tap(amt.parentElement); amt.classList.add("edit"); }],
        [400, () => c.type(amt, ["15", "1", "10", "100"], 170)],
        [1100, () => { amt.classList.remove("edit"); c.tap(c.q("[data-done]")); }],
        [300, () => sheet.classList.remove("up")],
        [450, () => (row.textContent = "100 g")],
        [900, () => { c.tap(c.q(".kcal")); kr.classList.add("edit"); }],
        [500, () => c.type(c.q("[data-kf]"), ["62", "6", "", "5", "55", "558"], 170)],
        [1300, () => { c.tap(c.q(".ied em")); }],
        [250, () => { kb.textContent = "558"; kr.classList.remove("edit"); }]
      ]);
    },

    // 3 · packaged food: the barcode, the label, the portion
    (c, play) => {
      const bars = [3, 1, 2, 1, 1, 3, 2, 1, 1, 2, 3, 1, 2, 1, 1, 2, 1, 3, 1, 2, 2, 1, 1, 3, 1, 2, 1];
      let x = 0; const code = bars.map((w, i) => { const r = i % 2 ? "" : `<rect x="${x}" y="0" width="${w}" height="40"/>`; x += w; return r; }).join("");
      c.scr.innerHTML = `${sb(true)}
        <div class="layer cam bc" data-l="cam">
          <div class="feed"><div class="pack"><div class="lid"></div><div class="lbl">Greek yogurt<small>2% · 500 G</small></div><div class="code"><svg viewBox="0 0 ${x} 40" preserveAspectRatio="none" fill="#111">${code}</svg><span>5 012345 678900</span></div></div></div>
          <div class="btn x">${icon(18, P.x)}</div>
          <div class="reticle"><i></i><i></i><i></i><i></i></div>
          <div class="camtip"><span data-tip>Point at the barcode on the pack</span></div>
          <div class="mode"><span>${icon(17, P.cam)}Photo</span><span class="on">${icon(17, P.code)}Barcode</span></div>
        </div>
        <div class="layer portion off" data-l="por">
          <div class="found">Found on the label</div>
          <div class="prod">Greek yogurt 2%</div>
          <div class="per">Per 100 g: 73 kcal · 10 g · 2 g · 4 g</div>
          <div class="q">How much did you have?</div>
          <div class="slider" style="--p:20%"><div class="track"></div><div class="fill"></div><div class="knob"></div></div>
          <div class="grams"><span class="field tnum"><span data-g>100</span> g</span><div class="chips"><span data-serv>One serving</span><span class="on" data-100>100 g</span></div></div>
          <div class="tot surf"><div class="lab">Calories</div><div class="k"><b data-bk>73</b><span>kcal</span></div>
            <div class="macros">
              <div class="mcard" style="--t:var(--protein)"><small>Protein</small><b><span data-bp>10</span><i>g</i></b></div>
              <div class="mcard" style="--t:var(--fat)"><small>Fat</small><b><span data-bf>2</span><i>g</i></b></div>
              <div class="mcard" style="--t:var(--carbs)"><small>Carbs</small><b><span data-bc>4</span><i>g</i></b></div>
            </div></div>
          <div class="savebar"><div>${icon(18, P.ok)}Save</div></div>
        </div>
        <div class="home-ind light"></div>`;
      if (!play) return;
      c.seq([
        [1000, () => { c.q(".reticle").classList.add("hit"); c.q("[data-tip]").textContent = "Looking up the product"; }],
        [1100, () => { c.q('[data-l="cam"]').classList.add("off"); c.q('[data-l="por"]').classList.remove("off"); c.q(".sb").classList.remove("light"); c.q(".home-ind").classList.remove("light"); }],
        [1200, () => { const s = c.q("[data-serv]"); c.tap(s); s.classList.add("on"); c.q("[data-100]").classList.remove("on"); }],
        [200, () => {
          c.tween(900, k => c.q(".slider").style.setProperty("--p", `${20 + 14 * out(k)}%`));
          c.count(c.q("[data-g]"), 100, 170, 900); c.count(c.q("[data-bk]"), 73, 124, 900);
          c.count(c.q("[data-bp]"), 10, 17, 900); c.count(c.q("[data-bf]"), 2, 3, 900); c.count(c.q("[data-bc]"), 4, 7, 900);
        }],
        [1600, () => c.tap(c.q(".savebar div"))]
      ]);
    },

    // 4 · log again: the usual flat white, one tap
    (c, play) => {
      const tiles = [["Breakfast", "Oat porridge", 320], ["Snacks", "Flat white", 110], ["Snacks", "Apple with almond butter", 210]];
      c.scr.innerHTML = `${sb()}<div class="app home"><div class="scroll">
          <div class="greet"><small>Good afternoon,</small><b>Alex ${icon(40, P.laurel)}</b></div>
          <div class="scanhero"><span class="c">${icon(28, P.cam)}</span><b>Scan<br>your meal</b></div>
          <div class="surf sum" style="margin-top:22px">
            <div class="kc"><b data-hk>${fmt(DAY0.k)}</b><s>/</s><em>2,100</em><small>kcal</small></div>
            <div class="bar"><i data-hb style="--v:${pc(DAY0.k, 2100)}"></i></div>
            <div class="cols">${MACROS.map(([n, t, k, goal]) => `<div>${n}<div class="bar"><i data-cb="${k}" style="--v:${pc(DAY0[k], goal)};--t:var(--${t})"></i></div><small><span data-h${k}>${DAY0[k]}</span> g / ${goal} g</small></div>`).join("")}</div>
          </div>
          <div class="surf"><h5>Log again</h5><div class="tiles">${tiles.map(([t, n, k]) => `<div class="tile" data-tile="${n}">${mealIcon(t)}<b>${n}</b><small>${k} kcal</small></div>`).join("")}</div></div>
          <div class="surf"><h5>Recent <small class="all">See all</small></h5><div data-recent>${recent("1:05 PM", MEAL.name, "Lunch", MEAL.k)}${recent("11:00 AM", "Apple with almond butter", "Snacks", 210)}${recent("8:40 AM", "Oat porridge", "Breakfast", 320)}</div></div>
        </div></div>
        <div class="toast">${icon(16, P.ok)}Logged again</div>${tabbar("Home")}<div class="home-ind"></div>`;
      if (!play) return;
      const scroll = c.q(".scroll");
      c.seq([
        [700, () => (scroll.style.transform = "translateY(-275px)")],
        [1300, () => c.tap(c.q('[data-tile="Flat white"]'))],
        [250, () => {
          c.q(".toast").classList.add("on");
          const box = c.q("[data-recent]"); box.insertAdjacentHTML("afterbegin", recent("1:06 PM", "Flat white", "Snacks", 110, true));
          c.later(30, () => box.firstElementChild.classList.remove("new"));
          c.count(c.q("[data-hk]"), DAY0.k, DAY.k, 1000);
          c.q("[data-hb]").style.setProperty("--v", pc(DAY.k, 2100));
          MACROS.forEach(([, , k, goal]) => { c.count(c.q(`[data-h${k}]`), DAY0[k], DAY[k], 1000); c.q(`[data-cb="${k}"]`).style.setProperty("--v", pc(DAY[k], goal)); });
        }],
        [2000, () => c.q(".toast").classList.remove("on")]
      ]);
    },

    // 5 · what's left: today's numbers on the Lock Screen, then on the Home Screen
    (c, play) => {
      const left = 2100 - DAY.k, share = DAY.k / 2100;
      const ring = (r, w, track, ink, attr) => { const len = 2 * Math.PI * r; return `<svg viewBox="0 0 ${2 * (r + w)} ${2 * (r + w)}"><circle cx="${r + w}" cy="${r + w}" r="${r}" fill="none" stroke="${track}" stroke-width="${w}"/><circle class="ringv" cx="${r + w}" cy="${r + w}" r="${r}" fill="none" stroke="${ink}" stroke-width="${w}" stroke-linecap="round" stroke-dasharray="${len}" stroke-dashoffset="${len}" data-len="${len}" transform="rotate(-90 ${r + w} ${r + w})" ${attr}/></svg>`; };
      const minis = MACROS.map(([n, t, k]) => `<span><b>${n[0]}</b><i class="bar"><i data-mb style="--v:0%;--t:var(--${t})" data-v="${pc(DAY[k], MACROS.find(m => m[2] === k)[3])}"></i></i></span>`).join("");
      const rows = MACROS.map(([n, t, k, goal]) => `<div class="mrw"><span><b>${n}</b><small>${DAY[k]}/${goal}</small></span><i class="bar"><i data-mb style="--v:0%;--t:var(--${t})" data-v="${pc(DAY[k], goal)}"></i></i></div>`).join("");
      c.scr.innerHTML = `<div class="layer lock" data-l="lock">${sb(true)}
          <div class="date">Wednesday, 11 November</div><div class="time">1:05</div>
          <div class="wid">
            <div class="w circ">${ring(25, 4, "rgba(255,255,255,.28)", "#fff", "data-ring")}<div>${icon(12, P.fork)}<b data-left>0</b></div></div>
            <div class="w rect"><b><span data-lk>0</span> / 2,100 kcal</b><span>P <span data-lp>0</span>&nbsp; F <span data-lf>0</span>&nbsp; C <span data-lc>0</span></span><i class="pbar"><i data-pb></i></i></div>
          </div>
          <div class="lockbtns"><span>${icon(22, P.torch)}</span><span>${icon(22, P.cam)}</span></div>
        </div>
        <div class="layer hs off" data-l="home">${sb(true)}
          <div class="hgrid">
            <div><div class="sq today"><div class="th"><b>Today</b><small>${DAY.meals} meals</small></div><div class="ring">${ring(30, 7, "#E9DECC", "#344026", "data-ring")}<div><b data-left>0</b><small>kcal left</small></div></div><div class="minis">${minis}</div></div><div class="lbl">Eatlas</div></div>
            <div><div class="sq scanw"><span class="c">${icon(26, P.viewfinder)}</span><b>Scan a meal</b><p><span data-left>0</span> kcal left today</p></div><div class="lbl">Eatlas</div></div>
          </div>
          <div class="hmed"><div class="md"><div class="ml"><div class="ring">${ring(38, 10, "#E9DECC", "#344026", "data-ring")}<div><b data-left>0</b><small>kcal left</small></div></div><small><span data-lk>0</span> of 2,100</small></div>
            <div class="mr"><div class="th"><b>Today</b><small>${DAY.meals} meals</small></div>${rows}</div></div><div class="lbl">Eatlas</div></div>
        </div>
        <div class="home-ind light"></div>`;
      const fill = () => {
        c.qa("[data-ring]").forEach(r => (r.style.strokeDashoffset = r.dataset.len * (1 - share)));
        c.qa("[data-mb]").forEach(b => b.style.setProperty("--v", b.dataset.v)); c.q("[data-pb]").style.width = pc(DAY.k, 2100);
        c.count(c.qa("[data-left]"), 0, left, 1200); c.count(c.qa("[data-lk]"), 0, DAY.k, 1200);
        c.count(c.q("[data-lp]"), 0, DAY.p, 1200); c.count(c.q("[data-lf]"), 0, DAY.f, 1200); c.count(c.q("[data-lc]"), 0, DAY.c, 1200);
      };
      if (!play) return;
      c.seq([[600, fill], [2800, () => { c.q('[data-l="lock"]').classList.add("up"); c.q('[data-l="home"]').classList.remove("off"); }]]);
    },

    // 6 · the month: tap a day, see what you ate
    (c, play) => {
      const logged = [1, 3, 4, 5, 6, 7, 8, 9, 10, 11];
      const days = [26, 27, 28, 29, 30, 31].map(d => `<span class="f"><em>${d}</em></span>`).join("") +
        Array.from({ length: 30 }, (_, i) => i + 1).map(d => `<span class="${logged.includes(d) ? "l" : ""}${d === 11 ? " t s" : ""}" data-d="${d}"><em>${d}</em></span>`).join("");
      const DAYS = {
        11: ["Wednesday, 11 November", DAY, DAY.list],
        7: ["Saturday, 7 November", { k: 1995, p: 121, f: 68, c: 224 }, [["Breakfast", "Avocado toast with eggs", 430], ["Lunch", "Chicken quinoa bowl", 560], ["Snacks", "Protein smoothie", 285], ["Dinner", "Beef sweet potato bowl", 720]]],
        4: ["Wednesday, 4 November", { k: 1785, p: 112, f: 61, c: 196 }, [["Breakfast", "Greek yogurt with berries", 315], ["Lunch", "Turkey rice plate", 610], ["Snacks", "Apple with almond butter", 210], ["Dinner", "Salmon with roasted vegetables", 650]]]
      };
      const dayHTML = d => { const [t, n, meals] = DAYS[d]; return `<h6>${t}</h6><div class="dk"><b>${fmt(n.k)}</b><span>kcal</span></div>
        <div class="dm"><i style="color:var(--protein-ink)">Protein ${n.p} g</i> · <i style="color:var(--fat-ink)">Fat ${n.f} g</i> · <i style="color:var(--carbs-ink)">Carbs ${n.c} g</i></div>
        <div style="margin-top:10px">${meals.map(([ty, nm, kc]) => `<div class="mrow">${mealIcon(ty)}<span>${nm}<small>${ty}</small></span><small>${kc} kcal</small></div>`).join("")}</div>`; };
      c.scr.innerHTML = `${sb()}<div class="app"><div class="title">Diary</div>
          <div class="surf" style="padding:16px"><div class="calhead"><b>November 2026</b><span><i>${icon(16, P.chevL)}</i><i>${icon(16, P.chevR)}</i></span></div>
            <div class="cal">${["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map(w => `<span class="w">${w}</span>`).join("")}${days}</div></div>
          <div class="surf day"><div class="fade" data-day>${dayHTML(11)}</div></div>
        </div>${tabbar("Diary")}<div class="home-ind"></div>`;
      if (!play) return;
      const pick = d => {
        const cell = c.q(`[data-d="${d}"]`); c.tap(cell);
        c.qa(".cal .s").forEach(s => s.classList.remove("s")); cell.classList.add("s");
        const box = c.q("[data-day]"); box.style.opacity = 0;
        c.later(250, () => { box.innerHTML = dayHTML(d); box.style.opacity = 1; });
      };
      c.seq([[1300, () => pick(7)], [2600, () => pick(4)], [2600, () => pick(11)]]);
    },

    // 7 · the coach: a read of your week, made on the iPhone
    (c, play) => {
      const RECS = [["leaf", "Add protein earlier"], ["fork", "Balance carb-heavy meals"], ["drop", "Keep hydration steady"]];
      c.scr.innerHTML = `${sb()}<div class="app"><div class="title">Insights</div>
          <div class="surf hcard"><span class="mark">${icon(26, P.spark)}</span>
            <h4 class="swap" data-h>Ready for your AI Coach Summary</h4>
            <p class="swap" data-s>Generate a calm, personalized read on your recent nutrition and what to improve next.</p>
            <span class="go">${icon(15, P.spark)}<span data-go>Generate insight</span></span><span class="gen"><span class="spin"></span>Generating insight</span>
          </div>
          <div class="surf recs"><h5>Recommendations</h5><p class="empty">Generate an insight to see three personalized recommendations.</p>
            ${RECS.map(([ic, n]) => `<div class="rrow hide" style="display:none"><i>${icon(18, P[ic])}</i><span>${n}</span>${icon(16, P.chevR, "c")}</div>`).join("")}</div>
        </div>${tabbar("Insights")}<div class="home-ind"></div>`;
      if (!play) return;
      const h = c.q("[data-h]"), s = c.q("[data-s]"), card = c.q(".hcard");
      const swap = (el, text) => { el.style.opacity = 0; c.later(300, () => { el.textContent = text; el.style.opacity = 1; }); };
      c.seq([
        [1000, () => c.tap(c.q(".go"))],
        [250, () => { card.classList.add("busy"); swap(h, "Analyzing your recent meals"); swap(s, "Reviewing your calories, macro balance, goals, and recent meal rhythm."); }],
        [2300, () => {
          card.classList.remove("busy"); c.q("[data-go]").textContent = "Refresh insight";
          swap(h, "Your week is leaning light on protein");
          swap(s, "You averaged 72 g of protein a day against a 130 g target. Breakfast is the easiest place to add some.");
          c.q(".recs .empty").style.display = "none"; c.qa(".rrow").forEach(r => (r.style.display = ""));
        }],
        ...c.qa(".rrow").map((r, i) => [i ? 220 : 500, () => r.classList.remove("hide")])
      ]);
    }
  ];

  /* ===================== the story: a step is current once its heading passes the middle ===================== */
  const story = $("#story");
  if (story) {
    const steps = $$(story, ".step"), dots = $$(story, ".dots i"), stage = $(story, "[data-stage]");
    const stageH = () => clamp(innerHeight - 160, 380, 640);
    let cur = -1, key = null, dev = null, swap = 0;
    steps.forEach(st => { st.style.setProperty("--sb", st.dataset.bg); st.style.setProperty("--sf", st.dataset.fg); st.style.setProperty("--ss", st.dataset.sub); });
    const drop = () => { if (dev) { dev.destroy(); dev = null; stage.innerHTML = ""; } key = null; clearTimeout(swap); };
    function stageScene(k) {
      if (k === key) return;
      const first = key === null; key = k; clearTimeout(swap);
      const mount = () => { if (dev) dev.destroy(); dev = mountDevice(stage, { scene: Math.max(0, k), play: k >= 0, height: stageH }); stage.style.opacity = 1; };
      if (first || reduce) { mount(); return; }
      stage.style.opacity = 0; swap = setTimeout(mount, 300);
    }
    // phones: each step has its own phone, which plays its scene while it is on screen
    $$(story, ".devwrap.inline").forEach(w => {
      const n = +w.dataset.scene, h = () => Math.min(250, innerWidth * .64) / .4745;
      let d = null, on = false;
      const mount = play => { if (d) d.destroy(); d = mountDevice(w, { scene: n, play: play || reduce, height: h }); };
      if (innerWidth <= 900) mount(false);
      new IntersectionObserver(es => es.forEach(e => {
        if (!e.rootBounds || !e.boundingClientRect.width) return;   // hidden on wide screens
        if (reduce) { if (!d) mount(true); return; }
        if (e.isIntersecting === on && d) return; on = e.isIntersecting; mount(on);
      }), { rootMargin: "-25% 0px -25% 0px" }).observe(w);
    });
    function sync() {
      if (innerWidth <= 900) { drop(); cur = -1; return; }
      const line = innerHeight * .5;
      let n = 0;
      steps.forEach((s, i) => { if (s.getBoundingClientRect().top < line) n = i; });
      stageScene(steps[0].getBoundingClientRect().top < innerHeight * .75 ? n : -1);
      if (n === cur) return; cur = n;
      const d = steps[n].dataset;
      dots.forEach((dt, i) => dt.classList.toggle("on", i === n));
      story.style.setProperty("--bg", d.bg); story.style.setProperty("--fg", d.fg); story.style.setProperty("--sub", d.sub);
    }
    addEventListener("scroll", sync, { passive: true });
    addEventListener("resize", () => { cur = -1; sync(); });
    sync();

    /* on wide screens the story moves one step per swipe, as on Detent's site */
    let animating = false, target = 0, glideId = 0;
    let lastWheel = -1e4, lastDir = 0, lastFresh = -1e4, peak = 0, recent = [], used = false;
    const stepY = i => steps[i].getBoundingClientRect().top + scrollY;
    function glide(to, dur = 760) {
      const moving = animating, curve = moving ? out : ease; if (moving) dur = 640;
      const from = scrollY, t0 = performance.now(), id = ++glideId; animating = true; target = to;
      const go = now => {
        if (id !== glideId) return;
        const k = Math.min(1, (now - t0) / dur);
        window.scrollTo(0, from + (to - from) * curve(k));
        if (k < 1) requestAnimationFrame(go); else { animating = false; sync(); }
      };
      requestAnimationFrame(go);
    }
    function stepTarget(dir, y = scrollY) {
      const first = stepY(0), last = stepY(steps.length - 1);
      if (dir > 0) {
        if (y < first - 2 && y >= first - innerHeight - 2) return first;            // from the hero into step 1
        if (y >= first - 2 && y < last - 2) { for (let i = 0; i < steps.length; i++) if (stepY(i) > y + 2) return stepY(i); }
      } else {
        if (y > 2 && y <= first + 2 && first <= innerHeight + 2) return 0;          // from step 1 back up to the hero
        if (y > last + 2 && y < last + innerHeight * .95) return last;              // from below back into the last step
        if (y > first + 2 && y <= last + 2) { for (let i = steps.length - 1; i >= 0; i--) if (stepY(i) < y - 2) return stepY(i); }
      }
      return null;
    }
    /* A trackpad keeps sending a swipe's momentum for a second or more after the fingers lift.
       A new swipe is a pause, a turn the other way, or a rise out of a dip in that momentum. */
    addEventListener("wheel", e => {
      if (innerWidth <= 900 || reduce || e.ctrlKey || Math.abs(e.deltaY) < Math.abs(e.deltaX)) return;
      const now = e.timeStamp, a = Math.abs(e.deltaY), dir = Math.sign(e.deltaY), gap = now - lastWheel;
      lastWheel = now;
      if (!dir || (gap <= 160 && dir !== lastDir && a < 4)) { if (used || animating) e.preventDefault(); return; }
      const low = recent.length ? Math.min(...recent) : 0, settled = now - lastFresh > 420;
      const fresh = gap > 160 || dir !== lastDir || (settled && ((gap > 60 && a > 4) || (a > 10 && a > low * 2.5 && low < peak * .5)));
      lastDir = dir;
      if (fresh) { lastFresh = now; used = false; peak = a; recent = [a]; }
      else { peak = Math.max(peak, a); recent.push(a); if (recent.length > 4) recent.shift(); }
      if (used || (animating && !fresh)) { e.preventDefault(); return; }
      const to = stepTarget(dir, animating ? target : scrollY);
      if (to === null) { if (animating) e.preventDefault(); return; }
      e.preventDefault(); used = true; glide(to);
    }, { passive: false });
    addEventListener("keydown", e => {
      if (innerWidth <= 900 || reduce || e.shiftKey || e.metaKey || e.ctrlKey || e.altKey || e.target.closest("a, button, input, textarea")) return;
      const dir = ["ArrowDown", "PageDown", " "].includes(e.key) ? 1 : ["ArrowUp", "PageUp"].includes(e.key) ? -1 : 0;
      if (!dir) return;
      if (e.repeat && animating) { e.preventDefault(); return; }
      const to = stepTarget(dir, animating ? target : scrollY);
      if (to !== null) { e.preventDefault(); glide(to); }
    });
  }
})();
