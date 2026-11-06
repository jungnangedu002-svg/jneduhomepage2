#!/usr/bin/env node
// 공유 미리보기 이미지 만들기: tools/og-image.html → assets/og-image.png (1200×630)
const path = require("path");
const { chromium } = require("playwright");
(async () => {
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1 });
  await p.goto("file://" + path.join(__dirname, "og-image.html"));
  await p.evaluate(() => document.fonts.ready);
  if (!(await p.evaluate(() => document.fonts.check('40px "Pretendard Variable"')))) throw new Error("글꼴 로드 실패");
  const out = path.join(__dirname, "..", "assets", "og-image.png");
  await p.screenshot({ path: out });
  await b.close();
  console.log("✔", out);
})().catch((e) => { console.error(e); process.exit(1); });
