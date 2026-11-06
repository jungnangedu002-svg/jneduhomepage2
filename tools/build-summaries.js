#!/usr/bin/env node
/*
 * 요약본 PDF 만들기
 *   node tools/build-summaries.js            → 모든 자료
 *   node tools/build-summaries.js <id> ...   → 지정한 자료만
 *
 * data/catalog.js(서지정보·한눈에 보기·쉬운 말 요약·핵심 숫자) +
 * data/reports.js(상세 요약 본문) → files/summaries/<id>.pdf
 */
const fs = require("fs");
const path = require("path");
const vm = require("vm");
const { chromium } = require("playwright");

const ROOT = path.resolve(__dirname, "..");
const OUT = path.join(ROOT, "files", "summaries");

function load(file) {
  const ctx = { window: {} };
  vm.runInNewContext(fs.readFileSync(path.join(ROOT, file), "utf8"), ctx, { filename: file });
  return ctx.window;
}
const CATALOG = load("data/catalog.js").CATALOG;
const REPORTS = load("data/reports.js").REPORTS;
const { cover, esc } = require(path.join(ROOT, "assets/cover.js"));

function blockHtml(b) {
  if (b.h3) return `<h3>${esc(b.h3)}</h3>`;
  if (b.p) return `<p>${esc(b.p)}</p>`;
  if (b.ul) return `<ul>${b.ul.map((i) => `<li>${esc(i)}</li>`).join("")}</ul>`;
  if (b.ol) return `<ol>${b.ol.map((i) => `<li>${esc(i)}</li>`).join("")}</ol>`;
  if (b.quote) return `<blockquote>${esc(b.quote)}${b.by ? `<cite>— ${esc(b.by)}</cite>` : ""}</blockquote>`;
  if (b.box) return `<div class="box">${b.title ? `<b>${esc(b.title)}</b>` : ""}${esc(b.box)}</div>`;
  if (b.table) {
    const t = b.table;
    return (
      `<div class="tbl${t.rows.length <= 9 ? " keep" : ""}"><table class="data">${t.caption ? `<caption>${esc(t.caption)}</caption>` : ""}` +
      `<thead><tr>${t.head.map((h) => `<th>${esc(h)}</th>`).join("")}</tr></thead>` +
      `<tbody>${t.rows.map((r) => `<tr>${r.map((c) => `<td>${esc(c)}</td>`).join("")}</tr>`).join("")}</tbody></table>` +
      (t.note ? `<p class="tnote">※ ${esc(t.note)}</p>` : "") + `</div>`
    );
  }
  throw new Error("알 수 없는 블록: " + JSON.stringify(b).slice(0, 80));
}

function pageHtml(b, report) {
  const s = b.summary || {};
  const rows = [
    ["저자", (b.authors || []).join(", ")],
    ["발행", b.publisher],
    ["발행연도", b.year],
    ["자료유형", b.type],
    ["분량", b.pages ? `원문 ${b.pages}쪽` : ""],
    ["청구기호", b.callNo],
    ["키워드", (b.keywords || []).map((k) => "#" + k).join("  ")],
  ].filter((r) => r[1]);
  const chapters = report.chapters || [];
  const today = new Date();
  const made = `${today.getFullYear()}년 ${today.getMonth() + 1}월`;

  return `<!doctype html><html lang="ko"><head><meta charset="utf-8">
<title>${esc(b.title)} — 요약본</title>
<link rel="stylesheet" href="${path.join(ROOT, "assets/print.css")}">
</head><body>

<section class="titlepage">
  <div class="titlepage__bar"><b>중랑평교 도서관</b><span>중랑구발달장애인평생교육센터 온라인 자료실</span></div>
  <div class="titlepage__main">
    <div class="titlepage__cover">${cover(b, true)}</div>
    <div>
      <span class="titlepage__label">자료 요약본</span>
      <h1>${esc(b.title)}</h1>
      ${b.subtitle ? `<p class="sub">${esc(b.subtitle)}</p>` : ""}
      <table class="biblio"><tbody>${rows.map((r) => `<tr><th>${esc(r[0])}</th><td>${esc(r[1])}</td></tr>`).join("")}</tbody></table>
    </div>
  </div>
  ${s.oneLine ? `<div class="titlepage__lead"><b>한눈에 보기</b>${esc(s.oneLine)}</div>` : ""}
  <div class="titlepage__foot"><span>이 요약본은 원문의 내용을 쉽게 이해하도록 정리한 자료입니다.</span><span>${made} 작성</span></div>
</section>

<section class="overview">
  <h2 class="sec-title"><small>OVERVIEW</small>요약 한눈에 보기</h2>
  ${s.easy && s.easy.length ? `<div class="panel easy"><h2>쉬운 말 요약</h2><ol>${s.easy.map((t) => `<li>${esc(t)}</li>`).join("")}</ol></div>` : ""}
  ${s.stats && s.stats.length ? `<div class="panel"><h2>핵심 숫자</h2><div class="kpis">${s.stats.map((k) => `<div class="kpi"><b>${esc(k.value)}</b><span>${esc(k.label)}</span></div>`).join("")}</div></div>` : ""}
  <div class="panel toc"><h2>요약본 차례</h2><ol>${chapters.map((c) => `<li>${esc(c.h)}</li>`).join("")}</ol></div>
</section>

${chapters.map((c, i) => `<section class="chapter"><h2><span class="no">${String(i + 1).padStart(2, "0")}</span>${esc(c.h)}</h2>${c.blocks.map(blockHtml).join("")}</section>`).join("")}

<section class="colophon">
  <h2>출처와 이용 안내</h2>
  <p>원문: ${esc((b.authors || []).join(", "))}, 「${esc(b.title)}」${b.subtitle ? ` — ${esc(b.subtitle)}` : ""}, ${esc(b.publisher || "")}, ${esc(b.year)}.</p>
  <p>이 요약본은 원문을 바탕으로 중랑평교 도서관이 정리한 것으로, 수치와 인용은 원문을 따랐습니다. 원문의 저작권은 저자와 발행처에 있습니다.</p>
  <p>문의: 중랑구발달장애인평생교육센터 · T. 02-6953-0704</p>
</section>
</body></html>`;
}

(async () => {
  const only = process.argv.slice(2);
  const list = CATALOG.filter((b) => !only.length || only.includes(b.id));
  if (!list.length) throw new Error("대상 자료가 없습니다: " + only.join(", "));
  fs.mkdirSync(OUT, { recursive: true });
  const tmp = fs.mkdtempSync(path.join(require("os").tmpdir(), "jn-summary-"));
  const browser = await chromium.launch();
  for (const b of list) {
    const report = REPORTS[b.id];
    if (!report) throw new Error(`data/reports.js 에 '${b.id}' 요약 본문이 없습니다.`);
    const htmlFile = path.join(tmp, b.id + ".html");
    fs.writeFileSync(htmlFile, pageHtml(b, report));
    const page = await browser.newPage();
    await page.goto("file://" + htmlFile);
    await page.evaluate(() => document.fonts.ready);
    const ok = await page.evaluate(() => document.fonts.check('12px "Pretendard Variable"'));
    if (!ok) throw new Error("Pretendard 글꼴을 불러오지 못했습니다.");
    const outFile = path.join(OUT, b.id + ".pdf");
    await page.pdf({ path: outFile, format: "A4", printBackground: true, preferCSSPageSize: true });
    await page.close();
    console.log("✔", path.relative(ROOT, outFile));
  }
  await browser.close();
})().catch((e) => { console.error(e); process.exit(1); });
