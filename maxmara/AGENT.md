# Обновление таблиц «Max Mara на Intrend» (раз в неделю и по запросу)

Две подборки — две ссылки:
- **outer** — верхняя одежда: пальто, пуховики, сапоги, перчатки, шарфы, платки → https://26donetsnata-blip.github.io/Lucio_studio/maxmara/
- **rest** — одежда и аксессуары: свитера, платья, пиджаки, юбки, брюки, обувь, сумки, аксессуары → https://26donetsnata-blip.github.io/Lucio_studio/maxmara/odezhda/

Сайт it.intrend.it не открывается из облака и с серверов GitHub — обход делается во
**встроенном браузере Claude на Mac пользователя** (инструменты `mcp__remote-devices__Claude_Browser__*`;
перед первым шагом загрузи навык built-in-browser). Всё остальное — в облачной копии репозитория.
Пользователь ничего не делает руками: никаких папок, загрузок и подтверждений. Пиши по-русски.

## Правило определения марки (13-значный код CODICE PRODOTTO)
- **Марку задаёт 1-я цифра**: 1 — Max Mara, 2 — Sportmax, 3 — Marella, 5 — Weekend Max Mara,
  6 — Max&Co, 7 — Marina Rinaldi, 9 — 'S Max Mara / The Cube; 4 и 8 — другая линия группы.
- **9–10 цифры** — из группы ли вещь: `06` — да; `02` — да у Marella и Max&Co (1-я цифра 3 или 6);
  `05` — собственная линия Intrend, **не берём**; 02 у других первых цифр — не берём.
- Marella «3…06» на marella.com не встречается — вещи, сделанные для аутлета.
- 2–4 цифры — тип вещи (796/798 — сапоги и ботильоны, 526 — туфли, 366 — свитер, 016 — пальто),
  7–8 — сезон (5x — 2026, 4x — 2025), 11–13 — цвет.
Всё это уже реализовано в `maxmara/build_all.py` — менять ничего не нужно.

## Шаги (для подборки <SET> = outer или rest)
1. Склонируй репозиторий (см. задание).
2. `preview_start` с url `https://it.intrend.it/cappotti-e-giacche/cappotti`.
3. `javascript_tool`: `window.__MM_SET = '<SET>'` и затем ВЕСЬ текст файла `maxmara/scrape.js` (одним вызовом).
4. Раз в ~40 секунд: `javascript_tool` → `await new Promise(r=>setTimeout(r,40000)); window.__mmStatus`
   — пока не станет `"done"` (outer ≈ 3 мин, rest ≈ 6 мин).
5. `javascript_tool` → `__mmDump()`. Результат большой: инструмент вернёт ошибку
   «exceeds maximum allowed tokens. Output has been saved to <путь>» — это нормально, возьми <путь>.
6. `python3 maxmara/build_all.py <путь> <SET>` — соберёт страницу, items.json и telegram.txt
   (описания новых моделей переводятся автоматически).
7. `git add maxmara` → коммит «Max Mara на Intrend: обновление <дата> (<SET>)» → `git push origin HEAD:main`.
   После пуша GitHub опубликует страницу и отправит итог в Telegram.

Если браузер недоступен (Mac выключен / приложение закрыто) или build_all.py пишет, что строк слишком мало, —
не меняй страницы: запиши в `maxmara/telegram.txt` строку «Max Mara на Intrend — <дата>: обновить
<подборку> не получилось (Mac был недоступен). Ссылки ведут на прошлую версию.» и запушь только этот файл.

Не трогай другие папки репозитория. Ничего не покупай и не входи в аккаунты на сайте.
