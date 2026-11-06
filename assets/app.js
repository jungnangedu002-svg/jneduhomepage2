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

  var cover = window.JNCover.cover;

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

  /* 상세 요약 본문 블록 (data/reports.js) */
  function blockHtml(b) {
    if (b.h3) return "<h3>" + esc(b.h3) + "</h3>";
    if (b.p) return "<p>" + esc(b.p) + "</p>";
    if (b.ul) return "<ul>" + b.ul.map(function (i) { return "<li>" + esc(i) + "</li>"; }).join("") + "</ul>";
    if (b.ol) return "<ol>" + b.ol.map(function (i) { return "<li>" + esc(i) + "</li>"; }).join("") + "</ol>";
    if (b.quote) return "<blockquote>" + esc(b.quote) + (b.by ? "<cite>— " + esc(b.by) + "</cite>" : "") + "</blockquote>";
    if (b.box) return '<div class="rbox">' + (b.title ? "<b>" + esc(b.title) + "</b>" : "") + esc(b.box) + "</div>";
    if (b.table) {
      var t = b.table;
      return '<div class="rtable"><table>' + (t.caption ? "<caption>" + esc(t.caption) + "</caption>" : "") +
        "<thead><tr>" + t.head.map(function (h) { return '<th scope="col">' + esc(h) + "</th>"; }).join("") + "</tr></thead><tbody>" +
        t.rows.map(function (r) { return "<tr>" + r.map(function (c) { return "<td>" + esc(c) + "</td>"; }).join("") + "</tr>"; }).join("") +
        "</tbody></table></div>" + (t.note ? '<p class="rnote">※ ' + esc(t.note) + "</p>" : "");
    }
    return "";
  }

  function viewBook(id) {
    var b = byId(id);
    if (!b) {
      main.innerHTML = '<div class="wrap section"><div class="empty">자료를 찾을 수 없습니다. <a href="#/list">전체 자료로 가기</a></div></div>';
      return;
    }
    var s = b.summary || {};
    var chapters = ((window.REPORTS || {})[b.id] || {}).chapters || [];
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
    var ext = (b.original || "").split(".").pop();
    var dlName = b.title + (ext ? "." + ext : "");
    var dlBtn = b.original
      ? '<a class="btn btn--primary" href="' + esc(b.original) + '" download="' + esc(dlName) + '">' + dlIcon + "원문 내려받기 (" + esc(b.format || ext.toUpperCase()) + ")</a>"
      : '<p class="no-download">이 자료는 원문을 내려받을 수 없어요.</p>';

    main.innerHTML =
      '<div class="wrap">' +
      '<nav class="crumbs" aria-label="현재 위치"><a href="#/">홈</a> › <a href="#/list?type=' + encodeURIComponent(b.type) + '">' +
      esc(b.type) + "</a> › " + esc(b.title) + "</nav>" +
      '<article class="detail">' +
      '<aside class="detail__aside">' + cover(b, true) +
      '<div class="callno">청구기호 <b>' + esc(b.callNo) + "</b></div>" +
      '<div class="btns">' + dlBtn + '<a class="btn btn--ghost" href="#/list">← 목록으로</a></div>' +
      (chapters.length ? '<nav class="side-toc" aria-label="요약 차례"><b>차례</b><ol>' +
        '<li><a href="#" data-jump="sum-overview">한눈에 보기</a></li>' +
        chapters.map(function (c, i) { return '<li><a href="#" data-jump="sum-ch' + (i + 1) + '">' + esc(c.h) + "</a></li>"; }).join("") +
        "</ol></nav>" : "") +
      "</aside>" +

      '<div class="detail__body">' +
      '<span class="detail__type">' + esc(b.type) + "</span>" +
      "<h1>" + esc(b.title) + "</h1>" +
      (b.subtitle ? '<p class="subtitle">' + esc(b.subtitle) + "</p>" : "") +
      '<table class="biblio"><tbody>' +
      rows.map(function (r) { return '<tr><th scope="row">' + esc(r[0]) + "</th><td>" + esc(r[1]) + "</td></tr>"; }).join("") +
      (b.keywords && b.keywords.length ? '<tr><th scope="row">키워드</th><td><div class="kw">' +
        b.keywords.map(function (k) { return '<a href="#/list?q=' + encodeURIComponent(k) + '">#' + esc(k) + "</a>"; }).join("") +
        "</div></td></tr>" : "") +
      "</tbody></table>" +

      '<div id="sum-overview">' +
      (s.oneLine ? '<section class="panel"><h2><span class="ico" aria-hidden="true">✦</span>한눈에 보기</h2><p class="oneline">' + esc(s.oneLine) + "</p></section>" : "") +
      (s.easy && s.easy.length ? '<section class="panel easy"><h2><span class="ico" aria-hidden="true">☺</span>쉬운 말 요약</h2><ol>' +
        s.easy.map(function (t) { return "<li>" + esc(t) + "</li>"; }).join("") + "</ol></section>" : "") +
      (s.stats && s.stats.length ? '<section class="panel"><h2><span class="ico" aria-hidden="true">#</span>핵심 숫자</h2><div class="kpis">' +
        s.stats.map(function (k) { return '<div class="kpi"><b>' + esc(k.value) + "</b><span>" + esc(k.label) + "</span></div>"; }).join("") +
        "</div></section>" : "") +
      "</div>" +

      chapters.map(function (c, i) {
        return '<section class="panel report" id="sum-ch' + (i + 1) + '"><h2 class="report__h"><span class="report__no">' +
          (i + 1 < 10 ? "0" : "") + (i + 1) + "</span>" + esc(c.h) + "</h2>" + c.blocks.map(blockHtml).join("") + "</section>";
      }).join("") +

      (b.original ? '<section class="panel source"><h2><span class="ico" aria-hidden="true">↓</span>원문 보기</h2>' +
        "<p>이 요약은 원문을 바탕으로 정리한 것입니다. 전체 내용은 원문 파일에서 확인하세요. 원문의 저작권은 저자와 발행처에 있습니다.</p>" +
        '<div class="source__btn">' + dlBtn + "</div></section>" : "") +
      "</div></article>" +

      '<section class="related"><div class="section__head"><h2>함께 보면 좋은 자료</h2></div>' +
      '<div class="grid">' + related.slice(0, 5).map(bookCard).join("") + "</div></section>" +
      "</div>";
    document.title = b.title + " · 중랑평교 도서관";

    // 차례: 주소(hash) 라우팅을 건드리지 않고 해당 부분으로 이동
    main.querySelectorAll("[data-jump]").forEach(function (a) {
      a.addEventListener("click", function (e) {
        e.preventDefault();
        var el = document.getElementById(a.getAttribute("data-jump"));
        if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    });
  }

  function viewAbout() {
    main.innerHTML =
      '<section class="section"><div class="wrap prose">' +
      '<div class="section__head"><h2>이용안내</h2></div>' +
      "<p><b>중랑평교 도서관</b>은 중랑구발달장애인평생교육센터가 만들고 참여한 연구논문, 활동북, 교육자료를 누구나 쉽게 찾아 읽을 수 있도록 모아 둔 온라인 자료실입니다.</p>" +
      '<ol class="steps">' +
      "<li><b>찾기</b><br>홈의 검색창이나 키워드, 자료 유형 탭으로 원하는 자료를 찾아요.</li>" +
      "<li><b>표지 누르기</b><br>책 표지를 누르면 서지정보와 요약이 한 화면에 열려요.</li>" +
      "<li><b>요약 읽기</b><br>‘한눈에 보기’와 ‘쉬운 말 요약’을 먼저 읽고, 아래로 내려 자세한 요약을 읽어요.</li>" +
      "<li><b>원문 보기</b><br>‘원문 내려받기’ 버튼으로 원래 파일을 받을 수 있어요.</li>" +
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
