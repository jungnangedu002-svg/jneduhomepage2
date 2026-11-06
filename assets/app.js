/* 중랑평교 도서관 — 화면 렌더링 (자료 목록은 data/catalog.js) */
(function () {
  "use strict";

  var BOOKS = (window.CATALOG || []).slice().sort(function (a, b) {
    return (b.year - a.year) || String(b.callNo).localeCompare(String(a.callNo));
  });
  var main = document.getElementById("main");

  /* ---------- helpers ---------- */
  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
  function authorsShort(a) {
    if (!a || !a.length) return "";
    return a.length > 2 ? a[0] + " 외 " + (a.length - 1) + "인" : a.join(", ");
  }
  function byId(id) { return BOOKS.filter(function (b) { return b.id === id; })[0]; }
  function types() {
    var t = [];
    BOOKS.forEach(function (b) { if (t.indexOf(b.type) < 0) t.push(b.type); });
    return t;
  }
  function haystack(b) {
    return [b.title, b.subtitle, b.type, b.publisher, b.callNo, (b.authors || []).join(" "),
      (b.keywords || []).join(" "), b.summary && b.summary.oneLine].join(" ").toLowerCase();
  }

  /* ---------- cover motifs (inline SVG, stroke = currentColor) ---------- */
  var MOTIFS = {
    basketball:
      '<svg viewBox="0 0 100 100" fill="none" stroke="currentColor" stroke-width="3.2" stroke-linecap="round">' +
      '<circle cx="50" cy="56" r="30"/><path d="M20 56h60M50 26v60"/>' +
      '<path d="M29 35c8 8 8 34 0 42M71 35c-8 8-8 34 0 42"/>' +
      '<path d="M62 12q8 -4 14 2" opacity=".7"/><path d="M70 20q6-2 10 3" opacity=".5"/></svg>',
    chart:
      '<svg viewBox="0 0 100 100" fill="none" stroke="currentColor" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round">' +
      '<path d="M16 84h70M16 84V18"/><rect x="26" y="56" width="11" height="28" rx="2"/>' +
      '<rect x="44" y="40" width="11" height="44" rx="2"/><rect x="62" y="28" width="11" height="56" rx="2"/>' +
      '<path d="M24 44l18-14 16 8 22-20"/><circle cx="80" cy="18" r="3" fill="currentColor"/></svg>',
    puppy:
      '<svg viewBox="0 0 100 100" fill="none" stroke="currentColor" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round">' +
      '<path d="M30 40c-10-4-14 6-12 18 1 6 6 7 9 3"/><path d="M70 40c10-4 14 6 12 18-1 6-6 7-9 3"/>' +
      '<path d="M28 46c0-14 10-22 22-22s22 8 22 22v10c0 14-10 22-22 22S28 70 28 56z"/>' +
      '<circle cx="41" cy="50" r="2.6" fill="currentColor"/><circle cx="59" cy="50" r="2.6" fill="currentColor"/>' +
      '<path d="M46 60h8l-4 5z" fill="currentColor"/><path d="M50 65v4m-6 2q6 4 12 0"/>' +
      '<path d="M78 82l8-8m-4 12l8-8" opacity=".6"/><circle cx="16" cy="84" r="3" opacity=".6"/></svg>',
    sprout:
      '<svg viewBox="0 0 100 100" fill="none" stroke="currentColor" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round">' +
      '<path d="M50 86V46"/><path d="M50 58c-18 0-26-10-26-26 16 0 26 8 26 26z"/>' +
      '<path d="M50 48c0-18 10-28 28-28 0 18-10 28-28 28z"/><path d="M22 86h56"/>' +
      '<path d="M30 86l4-8h32l4 8" opacity=".7"/><circle cx="82" cy="66" r="2.6" fill="currentColor" opacity=".7"/>' +
      '<circle cx="16" cy="44" r="2.6" fill="currentColor" opacity=".6"/></svg>',
    book:
      '<svg viewBox="0 0 100 100" fill="none" stroke="currentColor" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round">' +
      '<path d="M14 26h26a10 10 0 0 1 10 10v48a8 8 0 0 0-8-8H14z"/><path d="M86 26H60a10 10 0 0 0-10 10v48a8 8 0 0 1 8-8h28z"/>' +
      '<path d="M22 40h18M22 50h18M60 40h18M60 50h18" opacity=".7"/></svg>',
    heart:
      '<svg viewBox="0 0 100 100" fill="none" stroke="currentColor" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round">' +
      '<path d="M50 82S16 62 16 38a16 16 0 0 1 34-6 16 16 0 0 1 34 6c0 24-34 44-34 44z"/>' +
      '<path d="M34 46h8l4-8 6 16 4-8h10" opacity=".8"/></svg>',
    puzzle:
      '<svg viewBox="0 0 100 100" fill="none" stroke="currentColor" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round">' +
      '<path d="M20 20h22a8 8 0 1 1 16 0h22v22a8 8 0 1 0 0 16v22H58a8 8 0 1 0-16 0H20V58a8 8 0 1 1 0-16z"/></svg>',
    music:
      '<svg viewBox="0 0 100 100" fill="none" stroke="currentColor" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round">' +
      '<path d="M38 72V24l40-8v48"/><circle cx="30" cy="72" r="9"/><circle cx="70" cy="64" r="9"/><path d="M38 36l40-8" opacity=".7"/></svg>'
  };

  function cover(b, lg) {
    var c = b.cover || {};
    var theme = c.theme || "navy";
    var motif = MOTIFS[c.motif] || MOTIFS.book;
    return (
      '<div class="cover t-' + esc(theme) + (lg ? " cover--lg" : "") + (b.title.length > 20 ? " cover--long" : "") + ' book__cover" role="img" aria-label="' +
      esc(b.title) + ' 표지">' +
      '<div class="cover__inner">' +
      '<div class="cover__type">' + esc(b.type) + "</div>" +
      '<div class="cover__title">' + esc(b.title) + "</div>" +
      (b.subtitle ? '<div class="cover__sub">' + esc(b.subtitle) + "</div>" : "") +
      '<div class="cover__motif" aria-hidden="true">' + motif + "</div>" +
      '<div class="cover__foot"><div class="cover__authors">' + esc(authorsShort(b.authors)) +
      '</div><div class="cover__year">' + esc(b.year) + "</div></div>" +
      "</div></div>"
    );
  }

  function bookCard(b) {
    return (
      '<a class="book" href="#/book/' + encodeURIComponent(b.id) + '">' + cover(b) +
      '<div class="book__meta"><h3>' + esc(b.title) + "</h3><p>" + esc(authorsShort(b.authors)) +
      " · " + esc(b.year) + "</p></div></a>"
    );
  }

  /* ---------- views ---------- */
  function viewHome() {
    var kws = {};
    BOOKS.forEach(function (b) { (b.keywords || []).forEach(function (k) { kws[k] = (kws[k] || 0) + 1; }); });
    var topKw = Object.keys(kws).sort(function (a, b) { return kws[b] - kws[a]; }).slice(0, 7);
    var tcount = types().map(function (t) {
      return { t: t, n: BOOKS.filter(function (b) { return b.type === t; }).length };
    });
    var years = BOOKS.map(function (b) { return b.year; });
    var minY = Math.min.apply(null, years), maxY = Math.max.apply(null, years);

    var html =
      '<section class="hero"><div class="wrap">' +
      "<h1>배움과 연구를 함께 나누는<br>중랑평교 도서관</h1>" +
      '<p class="lead">중랑구발달장애인평생교육센터가 만든 연구논문과 교육자료를 한곳에서 찾아보고, 쉬운 요약으로 읽어보세요.</p>' +
      '<form class="search" role="search" id="homeSearch"><label class="skip" for="q">자료 검색</label>' +
      '<input id="q" name="q" type="search" placeholder="자료명, 저자, 키워드로 검색" autocomplete="off">' +
      '<button type="submit">검색</button></form>' +
      '<div class="chips"><span class="chips__label">인기 키워드</span>' +
      topKw.map(function (k) { return '<a class="chip" href="#/list?q=' + encodeURIComponent(k) + '">#' + esc(k) + "</a>"; }).join("") +
      "</div>" +
      '<div class="stats-row">' +
      '<div class="stat"><b>' + BOOKS.length + "</b><span>소장 자료</span></div>" +
      tcount.slice(0, 2).map(function (x) { return '<div class="stat"><b>' + x.n + "</b><span>" + esc(x.t) + "</span></div>"; }).join("") +
      '<div class="stat"><b>' + (minY === maxY ? minY : minY + "–" + String(maxY).slice(2)) + "</b><span>발행 연도</span></div>" +
      "</div></div></section>" +

      '<section class="section"><div class="wrap">' +
      '<div class="section__head"><h2>신착 자료</h2><a class="more" href="#/list">전체 자료 보기 →</a></div>' +
      '<div class="shelf"><div class="shelf__row">' + BOOKS.slice(0, 8).map(bookCard).join("") +
      '</div></div><div class="shelf__board" aria-hidden="true"></div>' +
      "</div></section>";

    types().forEach(function (t) {
      var list = BOOKS.filter(function (b) { return b.type === t; });
      html +=
        '<section class="section"><div class="wrap">' +
        '<div class="section__head"><h2>' + esc(t) + '</h2><a class="more" href="#/list?type=' +
        encodeURIComponent(t) + '">' + esc(t) + " 더보기 →</a></div>" +
        '<div class="grid">' + list.slice(0, 5).map(bookCard).join("") + "</div></div></section>";
    });

    main.innerHTML = html;
    document.getElementById("homeSearch").addEventListener("submit", function (e) {
      e.preventDefault();
      var q = document.getElementById("q").value.trim();
      location.hash = "#/list" + (q ? "?q=" + encodeURIComponent(q) : "");
    });
  }

  function viewList(params) {
    var state = { type: params.type || "전체", q: params.q || "", sort: params.sort || "new" };
    main.innerHTML =
      '<section class="section"><div class="wrap">' +
      '<div class="section__head"><h2>전체 자료</h2></div>' +
      '<div class="toolbar"><div class="tabs" role="group" aria-label="자료 유형">' +
      ["전체"].concat(types()).map(function (t) {
        return '<button class="tab" data-type="' + esc(t) + '" aria-pressed="' + (t === state.type) + '">' + esc(t) + "</button>";
      }).join("") +
      '</div><span class="spacer"></span>' +
      '<input type="search" id="lq" placeholder="목록 내 검색" aria-label="목록 내 검색" value="' + esc(state.q) + '">' +
      '<select id="ls" aria-label="정렬"><option value="new">최신순</option><option value="old">오래된순</option><option value="title">제목순</option></select>' +
      '</div><p class="result-count" id="rc"></p><div class="grid" id="grid"></div></div></section>';

    var grid = document.getElementById("grid"), rc = document.getElementById("rc");
    document.getElementById("ls").value = state.sort;

    function render() {
      var q = state.q.toLowerCase().trim();
      var list = BOOKS.filter(function (b) {
        return (state.type === "전체" || b.type === state.type) && (!q || haystack(b).indexOf(q) >= 0);
      });
      if (state.sort === "old") list = list.slice().reverse();
      if (state.sort === "title") list = list.slice().sort(function (a, b) { return a.title.localeCompare(b.title, "ko"); });
      rc.textContent = "총 " + list.length + "건" + (q ? " · ‘" + state.q + "’ 검색 결과" : "");
      grid.innerHTML = list.length ? list.map(bookCard).join("")
        : '<div class="empty" style="grid-column:1/-1">찾는 자료가 없어요. 다른 낱말로 검색해 보세요.</div>';
      var qs = [];
      if (state.type !== "전체") qs.push("type=" + encodeURIComponent(state.type));
      if (state.q) qs.push("q=" + encodeURIComponent(state.q));
      if (state.sort !== "new") qs.push("sort=" + state.sort);
      history.replaceState(null, "", "#/list" + (qs.length ? "?" + qs.join("&") : ""));
    }
    main.querySelectorAll(".tab").forEach(function (btn) {
      btn.addEventListener("click", function () {
        state.type = btn.getAttribute("data-type");
        main.querySelectorAll(".tab").forEach(function (x) { x.setAttribute("aria-pressed", String(x === btn)); });
        render();
      });
    });
    document.getElementById("lq").addEventListener("input", function (e) { state.q = e.target.value; render(); });
    document.getElementById("ls").addEventListener("change", function (e) { state.sort = e.target.value; render(); });
    render();
  }

  function viewBook(id) {
    var b = byId(id);
    if (!b) {
      main.innerHTML = '<div class="wrap section"><div class="empty">자료를 찾을 수 없습니다. <a href="#/list">전체 자료로 가기</a></div></div>';
      return;
    }
    var s = b.summary || {};
    var rows = [
      ["저자", (b.authors || []).join(", ")],
      ["발행", b.publisher],
      ["발행연도", b.year],
      ["자료유형", b.type + (b.format ? " (" + b.format + ")" : "")],
      ["분량", b.pages ? b.pages + "쪽" : ""],
      ["청구기호", b.callNo]
    ].filter(function (r) { return r[1]; });

    var related = BOOKS.filter(function (x) {
      return x.id !== b.id && (x.keywords || []).some(function (k) { return (b.keywords || []).indexOf(k) >= 0; });
    });
    if (!related.length) related = BOOKS.filter(function (x) { return x.id !== b.id; });

    var dlIcon = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M12 4v11m0 0l-4-4m4 4l4-4M5 19h14"/></svg>';

    main.innerHTML =
      '<div class="wrap">' +
      '<nav class="crumbs" aria-label="현재 위치"><a href="#/">홈</a> › <a href="#/list?type=' + encodeURIComponent(b.type) + '">' +
      esc(b.type) + "</a> › " + esc(b.title) + "</nav>" +
      '<article class="detail">' +
      '<aside class="detail__aside">' + cover(b, true) +
      '<div class="callno">청구기호 <b>' + esc(b.callNo) + "</b></div>" +
      '<div class="btns">' +
      (b.file ? '<a class="btn btn--primary" href="' + esc(b.file) + '" download>' + dlIcon + "원문 내려받기 (" + esc(b.format || "파일") + ")</a>" : "") +
      '<a class="btn btn--ghost" href="#/list">← 목록으로</a></div></aside>' +

      "<div>" +
      '<span class="detail__type">' + esc(b.type) + "</span>" +
      "<h1>" + esc(b.title) + "</h1>" +
      (b.subtitle ? '<p class="subtitle">' + esc(b.subtitle) + "</p>" : "") +
      '<table class="biblio"><tbody>' +
      rows.map(function (r) { return "<tr><th scope=\"row\">" + esc(r[0]) + "</th><td>" + esc(r[1]) + "</td></tr>"; }).join("") +
      (b.keywords && b.keywords.length ? '<tr><th scope="row">키워드</th><td><div class="kw">' +
        b.keywords.map(function (k) { return '<a href="#/list?q=' + encodeURIComponent(k) + '">#' + esc(k) + "</a>"; }).join("") +
        "</div></td></tr>" : "") +
      "</tbody></table>" +

      (s.oneLine ? '<section class="panel"><h2><span class="ico" aria-hidden="true">✦</span>한눈에 보기</h2><p class="oneline">' + esc(s.oneLine) + "</p></section>" : "") +
      (s.easy && s.easy.length ? '<section class="panel easy"><h2><span class="ico" aria-hidden="true">☺</span>쉬운 말 요약</h2><ol>' +
        s.easy.map(function (t) { return "<li>" + esc(t) + "</li>"; }).join("") + "</ol></section>" : "") +
      (s.stats && s.stats.length ? '<section class="panel"><h2><span class="ico" aria-hidden="true">#</span>핵심 숫자</h2><div class="kpis">' +
        s.stats.map(function (k) { return '<div class="kpi"><b>' + esc(k.value) + "</b><span>" + esc(k.label) + "</span></div>"; }).join("") +
        "</div></section>" : "") +
      (s.sections && s.sections.length ? '<section class="panel"><h2><span class="ico" aria-hidden="true">≡</span>요약본</h2>' +
        s.sections.map(function (sec) {
          return '<div class="sum-sec"><h3>' + esc(sec.heading) + "</h3>" +
            (sec.body ? "<p>" + esc(sec.body) + "</p>" : "") +
            (sec.items ? "<ul>" + sec.items.map(function (i) { return "<li>" + esc(i) + "</li>"; }).join("") + "</ul>" : "") +
            "</div>";
        }).join("") + "</section>" : "") +
      "</div></article>" +

      '<section class="related"><div class="section__head"><h2>함께 보면 좋은 자료</h2></div>' +
      '<div class="grid">' + related.slice(0, 5).map(bookCard).join("") + "</div></section>" +
      "</div>";
    document.title = b.title + " · 중랑평교 도서관";
  }

  function viewAbout() {
    main.innerHTML =
      '<section class="section"><div class="wrap prose">' +
      '<div class="section__head"><h2>이용안내</h2></div>' +
      "<p><b>중랑평교 도서관</b>은 중랑구발달장애인평생교육센터가 만들고 참여한 연구논문, 활동북, 교육자료를 누구나 쉽게 찾아 읽을 수 있도록 모아 둔 온라인 자료실입니다.</p>" +
      '<ol class="steps">' +
      "<li><b>찾기</b><br>홈의 검색창이나 키워드, 자료 유형 탭으로 원하는 자료를 찾아요.</li>" +
      "<li><b>표지 누르기</b><br>책 표지를 누르면 서지정보와 요약본이 열려요.</li>" +
      "<li><b>요약 읽기</b><br>‘한눈에 보기’, ‘쉬운 말 요약’, ‘요약본’ 순서로 읽어 보세요.</li>" +
      "<li><b>원문 보기</b><br>‘원문 내려받기’ 버튼으로 전체 파일을 받을 수 있어요.</li>" +
      "</ol>" +
      "<p>자료 문의: 중랑구발달장애인평생교육센터 · T. 02-6953-0704</p>" +
      "</div></section>";
  }

  /* ---------- router ---------- */
  function parse() {
    var h = location.hash.replace(/^#/, "") || "/";
    var qi = h.indexOf("?"), path = qi >= 0 ? h.slice(0, qi) : h, params = {};
    if (qi >= 0) h.slice(qi + 1).split("&").forEach(function (p) {
      var kv = p.split("="); if (kv[0]) params[decodeURIComponent(kv[0])] = decodeURIComponent(kv[1] || "");
    });
    return { parts: path.split("/").filter(Boolean), params: params };
  }
  function route() {
    var r = parse(), nav = "home";
    document.title = "중랑평교 도서관";
    if (r.parts[0] === "book" && r.parts[1]) { viewBook(decodeURIComponent(r.parts[1])); nav = "list"; }
    else if (r.parts[0] === "list") { viewList(r.params); nav = "list"; }
    else if (r.parts[0] === "about") { viewAbout(); nav = "about"; }
    else viewHome();
    document.querySelectorAll("[data-nav]").forEach(function (a) {
      if (a.getAttribute("data-nav") === nav) a.setAttribute("aria-current", "page"); else a.removeAttribute("aria-current");
    });
    window.scrollTo(0, 0);
    main.focus({ preventScroll: true });
  }
  window.addEventListener("hashchange", route);
  route();
})();
