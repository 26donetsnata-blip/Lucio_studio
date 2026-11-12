// Обход каталога Intrend. Запускать во встроенном браузере Claude на странице https://it.intrend.it/...
// Перед запуском задай подборку:  window.__MM_SET = 'outer'  (пальто, пуховики, сапоги, перчатки, шарфы)
//                             или window.__MM_SET = 'rest'   (свитера, платья, пиджаки, юбки, брюки, обувь, сумки, аксессуары)
// 1) выполнить этот файл целиком — обход начнётся в фоне (outer ≈ 3 мин, rest ≈ 6 мин);
// 2) проверять готовность: `window.__mmStatus` (ждать "done");
// 3) `__mmDump()` — вернёт текст BEGIN…END со всеми карточками. Он большой, поэтому инструмент
//    сохранит его в файл и покажет путь — этот путь передай в  python3 maxmara/build_all.py <путь> <подборка>.
(() => {
  const B = 'https://it.intrend.it/';
  const CASH = '%3AtopRated%3AmaterialFilter%3Acachemire', CAM = '%3AtopRated%3AmaterialFilter%3Acammello';
  const OUTER = [
    ['C', B + 'cappotti-e-giacche/cappotti'],
    ['D', B + 'cappotti-e-giacche/piumini-e-imbottiti'],
    ['S', B + 'scarpe-e-accessori/stivali'],
    ['S', B + 'scarpe-e-accessori/stivaletti'],
    ['A', B + 'scarpe-e-accessori/sciarpe-e-foulard'],
    ['G', B + 'scarpe-e-accessori/guanti-e-cappelli'],
  ];
  const REST = [
    ['K', B + 'abbigliamento/maglie-e-cardigan?q=' + CASH, CASH],
    ['K', B + 'abbigliamento/maglie-e-cardigan?q=' + CAM, CAM],
    ['V', B + 'abbigliamento/abiti'],
    ['J', B + 'cappotti-e-giacche/giacche-e-blazer'],
    ['J', B + 'abbigliamento/tailleur'],
    ['R', B + 'abbigliamento/gonne'],
    ['T', B + 'abbigliamento/pantaloni'],
    ['S', B + 'scarpe-e-accessori/scarpe-basse'],
    ['S', B + 'scarpe-e-accessori/scarpe-con-tacco'],
    ['S', B + 'scarpe-e-accessori/sneakers'],
    ['B', B + 'scarpe-e-accessori/borse'],
    ['X', B + 'scarpe-e-accessori/accessori'],
    ['X', B + 'scarpe-e-accessori/cinture'],
    ['X', B + 'scarpe-e-accessori/occhiali-da-sole'],
    ['X', B + 'scarpe-e-accessori/bigiotteria'],
    ['G', B + 'scarpe-e-accessori/guanti-e-cappelli'],
  ];
  const SET = window.__MM_SET || 'all';
  const JOBS = SET === 'outer' ? OUTER : SET === 'rest' ? REST : OUTER.concat(REST);
  async function scrape(cat, base, q) {
    const out = [], seen = new Set();
    for (let p = 0; p < 80; p++) {
      const url = p === 0 ? base : base.split('?')[0] + '?q=' + (q || '%3AtopRated') + '&page=' + p;
      let html;
      try { html = await (await fetch(url, { credentials: 'include' })).text(); }
      catch (e) { window.__mmErrors.push(url); break; }
      const doc = new DOMParser().parseFromString(html, 'text/html');
      let added = 0;
      for (const a of doc.querySelectorAll('a.product-card__name')) {
        const m = (a.getAttribute('href') || '').match(/\/p-(\d{13})-(.+)$/);
        if (!m || seen.has(m[1])) continue;
        seen.add(m[1]); added++;
        const box = a.closest('div').parentElement;
        const pr = [...(box.querySelector('.prices') || box).querySelectorAll('span')]
          .map(s => s.textContent.trim()).filter(t => /€/.test(t))
          .map(t => parseFloat(t.replace(/[^\d,]/g, '').replace(',', '.'))).filter(n => !isNaN(n));
        out.push({ cat, code: m[1], slug: m[2], it: a.textContent.trim().replace(/\|/g, '/'), prices: [...new Set(pr)] });
      }
      if (added === 0) break;
    }
    return out;
  }
  window.__mm = []; window.__mmErrors = []; window.__mmStatus = 'running';
  (async () => {
    for (const [c, u, q] of JOBS) {
      window.__mm = window.__mm.concat(await scrape(c, u, q));
      window.__mmStatus = 'running: ' + window.__mm.length;
    }
    window.__mmStatus = 'done';
  })();
  // Выгрузка всех карточек; отбор оригиналов (9–10 цифры 06, или 02 у Marella/Max&Co) делает build_all.py.
  window.__mmDump = () => 'BEGIN\n' + window.__mm.map(x => [x.cat, x.code, x.slug, x.it, x.prices.join('/')].join('|')).join('\n')
    + '\nEND\n#STATS ' + JSON.stringify({ set: SET, cards: window.__mm.length, errors: window.__mmErrors });
})();
