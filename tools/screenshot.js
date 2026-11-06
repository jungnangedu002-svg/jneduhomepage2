const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch();
  const base = 'file://' + process.cwd() + '/index.html';
  const out = process.argv[2];
  const shots = [
    ['01-home', '#/', {width:1280,height:900}, true],
    ['02-list', '#/list', {width:1280,height:900}, false],
    ['03-detail-red-puppy', '#/book/red-puppy-interview-2023', {width:1280,height:900}, true],
    ['04-detail-jayutu', '#/book/jayutu-basketball-2023', {width:1280,height:900}, true],
    ['05-detail-activity-book', '#/book/happy-growth-activity-book-2022', {width:1280,height:900}, true],
    ['06-detail-curriculum', '#/book/center-curriculum-study-2020', {width:1280,height:900}, true],
    ['07-mobile-home', '#/', {width:390,height:844}, true],
  ];
  const errs=[];
  for (const [name, hash, vp, full] of shots) {
    const p = await b.newPage({ viewport: vp, deviceScaleFactor: 2 });
    p.on('pageerror', e => errs.push(name+': '+e.message));
    await p.goto(base + hash); await p.waitForTimeout(1200);
    const sw = await p.evaluate(()=>document.documentElement.scrollWidth);
    if (sw > vp.width) errs.push(name+' overflow '+sw);
    await p.screenshot({ path: `${out}/${name}.png`, fullPage: full });
    await p.close();
  }
  console.log(errs.join('\n')||'no errors');
  await b.close();
})();
