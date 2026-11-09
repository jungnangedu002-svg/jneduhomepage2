/* 중랑평교 도서관 — 음성 안내(소리로 듣기)
 * 브라우저에 내장된 음성 합성(Web Speech API)으로 지금 보고 있는 화면의 내용을 한국어로 읽어 줍니다.
 * - 화면 오른쪽 아래 ‘소리로 듣기’ 버튼, 상세 페이지의 ‘이 자료 소리로 듣기’ 버튼([data-tts-start])
 * - 읽고 있는 문단을 강조하고 그 위치로 화면을 옮김
 * - 재생/일시정지, 멈춤, 이전·다음 문단, 읽기 속도
 * - 단축키: Alt+R 듣기·일시정지, Esc 멈춤
 */
(function () {
  "use strict";

  var synth = window.speechSynthesis;
  var supported = !!(synth && window.SpeechSynthesisUtterance);
  var main = document.getElementById("main");

  /* ---------- 읽을 내용 모으기 ---------- */
  var SELECTOR = [
    ".hero h1", ".hero .lead",
    ".section__head h2",
    ".book__meta",
    ".result-count",
    ".detail__type", ".detail h1", ".detail .subtitle",
    ".biblio tr",
    ".panel h2", ".oneline", ".easy li", ".kpi",
    ".report h3", ".report > p", ".report li", ".report blockquote", ".rbox", ".rtable", ".rnote",
    ".source p", ".no-download",
    ".prose > p", ".steps li",
    ".empty"
  ].join(",");
  var SKIP = ".side-toc, .related, .crumbs, .btns, .callno, .tts-panel, .chips, .stats-row, .toolbar";

  function clean(t) {
    return String(t || "")
      .replace(/[“”"‘’「」『』《》]/g, " ")
      .replace(/\s*→\s*/g, ", ")
      .replace(/(\d)\s*~\s*(\d)/g, "$1에서 $2")
      .replace(/~/g, " ")
      .replace(/\s*[·•∩]\s*/g, ", ")
      .replace(/\*/g, "")
      .replace(/p\s*<\s*\.05/g, "p 0.05 미만")
      .replace(/\bp\s*=\s*/g, "p값 ")
      .replace(/(^|[^\d.])\.(\d)/g, "$10.$2")
      .replace(/#/g, ", ")
      .replace(/(,\s*){2,}/g, ", ")
      .replace(/^\s*,\s*/, "")
      .replace(/\s+/g, " ")
      .trim();
  }

  function tableText(el) {
    var parts = [];
    var cap = el.querySelector("caption");
    if (cap) parts.push(cap.textContent + ".");
    var heads = Array.prototype.map.call(el.querySelectorAll("thead th"), function (th) { return th.textContent.trim(); });
    el.querySelectorAll("tbody tr").forEach(function (tr) {
      var cells = Array.prototype.map.call(tr.children, function (td, i) {
        var v = td.textContent.trim();
        if (!v) return "";
        return heads[i] ? heads[i] + ", " + v : v;
      }).filter(Boolean);
      parts.push(cells.join(". ") + ".");
    });
    return parts;
  }

  function collect() {
    var segs = [];
    if (!main) return segs;
    main.querySelectorAll(SELECTOR).forEach(function (el) {
      if (el.closest(SKIP)) return;
      if (el.matches(".rtable")) {
        // 표는 행마다 한 덩어리로 읽음
        var lines = tableText(el);
        lines.forEach(function (t) { segs.push({ el: el, text: clean(t) }); });
        return;
      }
      if (el.matches(".biblio tr")) {
        var th = el.querySelector("th"), td = el.querySelector("td");
        segs.push({ el: el, text: clean((th ? th.textContent : "") + ", " + (td ? td.innerText || td.textContent : "")) });
        return;
      }
      if (el.matches(".kpi")) {
        var b = el.querySelector("b"), s = el.querySelector("span");
        segs.push({ el: el, text: clean((s ? s.textContent : "") + ", " + (b ? b.textContent : "")) });
        return;
      }
      if (el.matches(".book__meta")) {
        var h = el.querySelector("h3"), p = el.querySelector("p");
        segs.push({ el: el.closest(".book") || el, text: clean("자료. " + (h ? h.textContent : "") + ". " + (p ? p.textContent : "")) });
        return;
      }
      if (el.matches(".panel h2")) {
        segs.push({ el: el, text: clean(el.textContent.replace(/^[✦☺#≡↓]\s*/, "")) });
        return;
      }
      if (el.matches(".report blockquote")) {
        var cite = el.querySelector("cite");
        var body = el.textContent.replace(cite ? cite.textContent : "", "");
        segs.push({ el: el, text: clean("인용. " + body + (cite ? ". " + cite.textContent.replace(/^—\s*/, "") : "")) });
        return;
      }
      var t = clean(el.innerText || el.textContent);
      if (t) segs.push({ el: el, text: t });
    });
    return segs.filter(function (s) { return s.text; });
  }

  // 긴 문단은 문장 단위로 나눠 읽음 (일부 브라우저가 긴 문장을 중간에 끊는 문제 방지)
  function chunks(text) {
    var out = [], buf = "";
    text.replace(/([.!?。])\s+/g, "$1\n").split("\n").forEach(function (s) {
      if ((buf + " " + s).length > 160 && buf) { out.push(buf); buf = s; }
      else buf = buf ? buf + " " + s : s;
    });
    if (buf) out.push(buf);
    return out;
  }

  /* ---------- 목소리 ---------- */
  var voice = null;
  function pickVoice() {
    if (!supported) return;
    var vs = synth.getVoices().filter(function (v) { return /^ko/i.test(v.lang); });
    var prefer = ["Google", "Yuna", "유나", "Heami", "SunHi", "InJoon", "Microsoft"];
    voice = null;
    for (var i = 0; i < prefer.length && !voice; i++) {
      for (var j = 0; j < vs.length; j++) if (vs[j].name.indexOf(prefer[i]) >= 0) { voice = vs[j]; break; }
    }
    if (!voice && vs.length) voice = vs[0];
  }
  if (supported) {
    pickVoice();
    if (typeof synth.addEventListener === "function") synth.addEventListener("voiceschanged", pickVoice);
    else synth.onvoiceschanged = pickVoice;
  }

  /* ---------- 상태 ---------- */
  var RATES = [{ v: 0.8, label: "느리게" }, { v: 1, label: "보통" }, { v: 1.25, label: "빠르게" }];
  var rate = 1;
  try { var saved = parseFloat(localStorage.getItem("jn-tts-rate")); if (saved) rate = saved; } catch (e) {}

  var segs = [], idx = 0, part = 0, parts = [], state = "idle"; // idle | playing | paused
  var token = 0; // 멈춘 뒤 늦게 도착한 onend 무시용

  /* ---------- 화면 ---------- */
  var ICON_SPEAKER = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 9v6h4l5 4V5L8 9H4z" fill="currentColor"/><path d="M16 8.5a5 5 0 0 1 0 7M18.5 6a8.5 8.5 0 0 1 0 12" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>';
  var ICON_PAUSE = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 5h4v14H7zM13 5h4v14h-4z" fill="currentColor"/></svg>';
  var ICON_PLAY = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 5l12 7-12 7z" fill="currentColor"/></svg>';
  var ICON_STOP = '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="6" y="6" width="12" height="12" rx="1.5" fill="currentColor"/></svg>';
  var ICON_PREV = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 5h2v14H6zM19 5L9 12l10 7z" fill="currentColor"/></svg>';
  var ICON_NEXT = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M16 5h2v14h-2zM5 5l10 7-10 7z" fill="currentColor"/></svg>';

  var panel = document.createElement("div");
  panel.className = "tts-panel";
  panel.setAttribute("role", "region");
  panel.setAttribute("aria-label", "음성 안내");
  panel.innerHTML =
    '<div class="tts-controls" hidden>' +
      '<button type="button" class="tts-btn" data-act="prev" aria-label="이전 문단">' + ICON_PREV + "</button>" +
      '<button type="button" class="tts-btn" data-act="stop" aria-label="멈춤">' + ICON_STOP + "</button>" +
      '<button type="button" class="tts-btn" data-act="next" aria-label="다음 문단">' + ICON_NEXT + "</button>" +
      '<button type="button" class="tts-btn tts-rate" data-act="rate" aria-label="읽기 속도"></button>' +
    "</div>" +
    '<button type="button" class="tts-main" data-act="toggle" aria-keyshortcuts="Alt+R"></button>' +
    '<p class="tts-status" role="status" aria-live="polite"></p>';
  document.body.appendChild(panel);

  var mainBtn = panel.querySelector(".tts-main");
  var controls = panel.querySelector(".tts-controls");
  var rateBtn = panel.querySelector(".tts-rate");
  var status = panel.querySelector(".tts-status");

  function rateLabel() {
    for (var i = 0; i < RATES.length; i++) if (RATES[i].v === rate) return RATES[i].label;
    return "보통";
  }

  function render() {
    if (state === "playing") {
      mainBtn.innerHTML = ICON_PAUSE + "<span>일시정지</span>";
      mainBtn.setAttribute("aria-label", "음성 안내 일시정지 (Alt+R)");
    } else if (state === "paused") {
      mainBtn.innerHTML = ICON_PLAY + "<span>이어 듣기</span>";
      mainBtn.setAttribute("aria-label", "음성 안내 이어 듣기 (Alt+R)");
    } else {
      mainBtn.innerHTML = ICON_SPEAKER + "<span>소리로 듣기</span>";
      mainBtn.setAttribute("aria-label", "이 화면을 소리로 듣기 (Alt+R)");
    }
    mainBtn.setAttribute("aria-pressed", state === "playing" ? "true" : "false");
    controls.hidden = state === "idle";
    panel.classList.toggle("is-active", state !== "idle");
    rateBtn.innerHTML = "속도 <b>" + rateLabel() + "</b>";
    rateBtn.setAttribute("aria-label", "읽기 속도 " + rateLabel() + ", 눌러서 바꾸기");
    document.querySelectorAll("[data-tts-start]").forEach(function (b) {
      b.setAttribute("aria-pressed", state === "playing" ? "true" : "false");
      var lab = b.querySelector("span");
      if (lab) lab.textContent = state === "playing" ? "읽는 중 · 일시정지" : state === "paused" ? "이어 듣기" : "이 자료 소리로 듣기";
    });
  }

  var sayTimer = null;
  function say(msg, keep) {
    status.textContent = msg;
    clearTimeout(sayTimer);
    if (!keep) sayTimer = setTimeout(function () { status.textContent = ""; }, 5000);
  }

  function highlight(el) {
    document.querySelectorAll(".tts-reading").forEach(function (x) { x.classList.remove("tts-reading"); });
    if (!el) return;
    el.classList.add("tts-reading");
    var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    try { el.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "center" }); } catch (e) { el.scrollIntoView(); }
  }

  /* ---------- 재생 ---------- */
  function speakCurrent() {
    if (idx >= segs.length) { finish(); return; }
    var seg = segs[idx];
    if (part === 0) { parts = chunks(seg.text); highlight(seg.el); }
    var u = new SpeechSynthesisUtterance(parts[part]);
    u.lang = "ko-KR";
    if (voice) u.voice = voice;
    u.rate = rate;
    var my = ++token;
    u.onend = function () {
      if (my !== token || state !== "playing") return;
      part++;
      if (part >= parts.length) { part = 0; idx++; }
      speakCurrent();
    };
    u.onerror = function (e) {
      if (my !== token) return;
      if (e && (e.error === "interrupted" || e.error === "canceled")) return;
      say("음성을 재생하지 못했어요. 브라우저의 소리 설정을 확인해 주세요.", true);
      stop(true);
    };
    synth.speak(u);
  }

  function start(fromIdx) {
    if (!supported) {
      say("이 브라우저는 음성 안내를 지원하지 않아요. 크롬, 엣지, 사파리 최신 버전에서 이용해 주세요.", true);
      return;
    }
    segs = collect();
    if (!segs.length) { say("읽을 내용이 없어요."); return; }
    idx = Math.max(0, Math.min(fromIdx || 0, segs.length - 1));
    part = 0;
    token++;
    synth.cancel();
    state = "playing";
    render();
    say("음성 안내를 시작합니다. 모두 " + segs.length + "개 문단.");
    speakCurrent();
  }

  function pause() {
    // 일부 브라우저의 pause가 불안정해서, 멈춘 뒤 현재 문단부터 다시 읽는 방식으로 처리
    token++;
    synth.cancel();
    part = 0;
    state = "paused";
    render();
    say("일시정지했어요.");
  }

  function resume() {
    if (!segs.length) { start(0); return; }
    token++;
    synth.cancel();
    state = "playing";
    render();
    say("이어서 읽습니다.");
    speakCurrent();
  }

  function stop(silent) {
    token++;
    if (supported) synth.cancel();
    state = "idle";
    segs = []; idx = 0; part = 0;
    highlight(null);
    render();
    if (!silent) say("음성 안내를 멈췄어요.");
  }

  function finish() {
    stop(true);
    say("끝까지 읽었어요.");
  }

  function jump(delta) {
    if (!segs.length) return;
    idx = Math.max(0, Math.min(segs.length - 1, idx + delta));
    part = 0;
    token++;
    synth.cancel();
    state = "playing";
    render();
    speakCurrent();
  }

  function toggle() {
    if (state === "playing") pause();
    else if (state === "paused") resume();
    else start(0);
  }

  function cycleRate() {
    var i = 0;
    for (var k = 0; k < RATES.length; k++) if (RATES[k].v === rate) i = k;
    rate = RATES[(i + 1) % RATES.length].v;
    try { localStorage.setItem("jn-tts-rate", String(rate)); } catch (e) {}
    render();
    say("읽기 속도 " + rateLabel());
    if (state === "playing") { part = 0; token++; synth.cancel(); speakCurrent(); }
  }

  panel.addEventListener("click", function (e) {
    var b = e.target.closest("[data-act]");
    if (!b) return;
    var act = b.getAttribute("data-act");
    if (act === "toggle") toggle();
    else if (act === "stop") stop();
    else if (act === "prev") jump(-1);
    else if (act === "next") jump(1);
    else if (act === "rate") cycleRate();
  });

  // 상세 페이지의 ‘이 자료 소리로 듣기’ 버튼
  document.addEventListener("click", function (e) {
    var b = e.target.closest("[data-tts-start]");
    if (!b) return;
    e.preventDefault();
    toggle();
  });

  document.addEventListener("keydown", function (e) {
    if (e.altKey && (e.key === "r" || e.key === "R" || e.code === "KeyR")) { e.preventDefault(); toggle(); }
    else if (e.key === "Escape" && state !== "idle") stop();
  });

  // 다른 화면으로 이동하면 멈춤 (화면이 바뀐 뒤 버튼 상태도 다시 그림)
  window.addEventListener("hashchange", function () {
    if (state !== "idle") stop(true);
    setTimeout(render, 0);
  });
  window.addEventListener("pagehide", function () { if (supported) synth.cancel(); });

  if (!supported) panel.classList.add("is-unsupported");
  render();

  window.JNTTS = { start: start, stop: stop, toggle: toggle, collect: collect, state: function () { return state; } };
})();
