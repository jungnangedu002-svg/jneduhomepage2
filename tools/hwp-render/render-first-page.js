#!/usr/bin/env node
/*
 * HWP 원문의 첫 페이지를 이미지로 저장 (요약본 PDF 첫 장에 사용)
 *   node tools/hwp-render/render-first-page.js <원문.hwp> assets/firstpages/<id>.jpg
 * hwpjs.bundle.js 는 npm 패키지 hwp.js@0.0.3(Apache-2.0)을 esbuild로 묶은 것입니다.
 * 웹 뷰어로 그린 것이라 한글 프로그램 화면과 글꼴·줄바꿈이 조금 다를 수 있습니다.
 */
const fs = require("fs");
const path = require("path");
const { chromium } = require("playwright");
const [src, out] = process.argv.slice(2);
if (!src || !out) { console.error("사용법: render-first-page.js <원문.hwp> <출력.jpg>"); process.exit(1); }
(async () => {
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 1000, height: 1400 }, deviceScaleFactor: 1.6 });
  await p.setContent('<!doctype html><meta charset="utf-8"><body style="margin:0;background:#fff"><div id="c"></div>');
  await p.addScriptTag({ path: path.join(__dirname, "hwpjs.bundle.js") });
  await p.evaluate((d) => { new window.HWPMod.Viewer(document.getElementById("c"), new Uint8Array(d), { type: "array" }); }, [...fs.readFileSync(src)]);
  await p.waitForTimeout(1500);
  const box = await p.evaluate(() => {
    for (const e of document.querySelectorAll("#c div")) {
      const r = e.getBoundingClientRect();
      if (r.width > 800 && r.height > 1000 && getComputedStyle(e).backgroundColor === "rgb(255, 255, 255)")
        return { x: r.x, y: r.y, width: r.width, height: r.height };
    }
  });
  if (!box) throw new Error("첫 페이지를 찾지 못했습니다.");
  await p.screenshot({ path: out, type: "jpeg", quality: 88, clip: box });
  await b.close();
  console.log("✔", out);
})().catch((e) => { console.error(e); process.exit(1); });
