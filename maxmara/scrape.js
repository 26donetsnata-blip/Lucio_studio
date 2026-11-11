// Обход каталога Intrend. Запускать во встроенном браузере на странице https://it.intrend.it/...
// 1) выполнить этот файл целиком — обход начнётся в фоне (2–3 минуты);
// 2) проверять готовность: `window.__mmStatus`
// 3) когда status === "done": `__mmExport(<массив известных кодов>)` — вернёт текст для raw.txt
(() => {
  const B = 'https://it.intrend.it/';
  const JOBS = [
    ['C', B + 'cappotti-e-giacche/cappotti'],
    ['D', B + 'cappotti-e-giacche/piumini-e-imbottiti'],
    ['K', B + 'abbigliamento/maglie-e-cardigan?q=%3AtopRated%3AmaterialFilter%3Acachemire', '%3AtopRated%3AmaterialFilter%3Acachemire'],
    ['K', B + 'abbigliamento/maglie-e-cardigan?q=%3AtopRated%3AmaterialFilter%3Acammello', '%3AtopRated%3AmaterialFilter%3Acammello'],
    ['S', B + 'scarpe-e-accessori/stivali'],
    ['S', B + 'scarpe-e-accessori/stivaletti'],
    ['S', B + 'scarpe-e-accessori/scarpe-basse'],
    ['S', B + 'scarpe-e-accessori/scarpe-con-tacco'],
    ['S', B + 'scarpe-e-accessori/sneakers'],
    ['A', B + 'scarpe-e-accessori/sciarpe-e-foulard'],
    ['G', B + 'scarpe-e-accessori/guanti-e-cappelli'],
  ];
  async function scrape(cat, base, q) {
    const out = [], seen = new Set();
    for (let p = 0; p < 60; p++) {
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
        out.push({ cat, code: m[1], slug: m[2], it: a.textContent.trim(), prices: [...new Set(pr)] });
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
  // Оригиналы группы Max Mara: 9-я и 10-я цифры кода = 06. Перчатки: только guanti.
  window.__mmExport = (known) => {
    const K = new Set(known), seen = new Set();
    const o = window.__mm.filter(x => x.code.slice(8, 10) === '06' && (x.cat !== 'G' || /guant/i.test(x.it))
      && !seen.has(x.code) && seen.add(x.code));
    const neu = o.filter(x => !K.has(x.code) && ('157'.includes(x.code[0]) || 'SAG'.includes(x.cat)));
    const kn = o.filter(x => K.has(x.code));
    return neu.map(x => [x.cat, x.code, x.slug, x.it, x.prices.join('/')].join('|')).join('\n')
      + '\n#KNOWN\n' + kn.map(x => x.code + ':' + x.prices.join('/')).join(' ')
      + '\n#STATS ' + JSON.stringify({ all: window.__mm.length, originals: o.length, errors: window.__mmErrors });
  };
})();
