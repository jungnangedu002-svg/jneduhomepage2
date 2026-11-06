/* 중랑평교 도서관 — 표지 그리기 (사이트와 요약본 PDF가 함께 사용) */
(function (root) {
  "use strict";
  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
  function authorsShort(a) {
    if (!a || !a.length) return "";
    return a.length > 2 ? a[0] + " 외 " + (a.length - 1) + "인" : a.join(", ");
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


  var api = { cover: cover, MOTIFS: MOTIFS, esc: esc, authorsShort: authorsShort };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  else root.JNCover = api;
})(this);
