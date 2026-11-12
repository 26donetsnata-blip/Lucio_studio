# Обновление таблицы «Max Mara на Intrend» (раз в неделю и по запросу)

Сайт it.intrend.it не открывается из облака и с серверов GitHub — обход делается
во **встроенном браузере Claude на Mac пользователя** (инструменты
`mcp__remote-devices__Claude_Browser__*`; перед первым шагом загрузи навык
built-in-browser). Всё остальное — в облачной копии репозитория. Пиши по-русски.

## Правило определения марки (по 13-значному коду CODICE PRODOTTO)
- **Марку задаёт 1-я цифра**: 1 — Max Mara, 2 — Sportmax, 3 — Marella, 5 — Weekend Max Mara,
  6 — Max&Co, 7 — Marina Rinaldi, 9 — 'S Max Mara / The Cube; 4 и 8 — другая линия группы
  (обувь, аксессуары, линия не определена).
- **9–10 цифры** говорят, из группы ли вещь: `06` — да (вещи компании Max Mara), `02` — да у
  Marella и Max&Co (1-я цифра 3 или 6), `05` — собственная линия Intrend, **не берём**.
  02 у других первых цифр — не берём (не подтверждено).
- Marella с кодом «3…06» не встречается на marella.com — это вещи, сделанные для аутлета.
- 2–4 цифры — тип вещи (366 свитер, 346 кардиган, 016 пальто, 486/496 утеплённое, 526 туфли,
  796 сапоги), 7–8 — сезон (5x — 2026, 4x — 2025), 11–13 — цвет.
- Подтверждение: тот же код на maxmara.com / sportmax.com / marella.com / maxandco.com.

## 1. Подготовка
Склонируй репозиторий (см. задание) и получи список известных кодов:

```
python3 -c "import json;it=json.load(open('maxmara/items.json'));print(json.dumps(sorted({v['u'].split('/p-')[1][:13] for i in it for v in i['vars']})))"
```

## 2. Обход в браузере на Mac
1. `preview_start` с url `https://it.intrend.it/cappotti-e-giacche/cappotti`.
2. `javascript_tool`: выполни ВЕСЬ текст файла `maxmara/scrape.js` (обход стартует в фоне).
3. Раз в ~30 секунд проверяй `javascript_tool`: `await new Promise(r=>setTimeout(r,30000)); window.__mmStatus`
   — пока не станет `"done"` (обычно 5–8 минут; всего ~6000 карточек).
4. `javascript_tool`: `__mmExport(<массив кодов из шага 1>)` — вернёт текст.
   Сохрани его ДОСЛОВНО в `maxmara/raw.txt`.

Если браузер недоступен (Mac выключен / приложение закрыто) или в `#STATS` всего
меньше 2500 карточек — не обновляй таблицу: запиши в `maxmara/telegram.txt`
«Max Mara на Intrend — <дата>: сегодня обновить не получилось (Mac был недоступен).
Таблица со вчерашними данными: https://26donetsnata-blip.github.io/Lucio_studio/maxmara/»
и запушь только этот файл.

## 3. Переводы новых моделей
Строки до `#KNOWN` — новые вещи: `cat|code|slug|итальянское название|цены`.
Для каждой новой основы slug (часть до первого «-», например `bernini`) добавь в
`maxmara/descs.json` запись `"bernini": ["Обувь", "BERNINI", "Кожаные сапоги со штрипкой"]`.
Категории: Пальто, Пуховики, Свитера, Платья, Пиджаки, Юбки, Брюки, Обувь, Сумки, Шарфы,
Платки и палантины, Перчатки, Аксессуары. Если новых моделей очень много (больше ~150),
переведи сначала Max Mara, Weekend, Marina Rinaldi, Sportmax и 'S; для остальных можно
оставить итальянское описание (merge.py подставит его сам).
Название — заглавными, без цифр в конце; если slug начинается с лишней `v`
(дубль, например `vcircus`), убери её. Описание — коротко по-русски.

## 4. Сборка и публикация
```
python3 maxmara/merge.py      # создаёт crawl.json, подскажет, чего не хватает в descs.json
python3 maxmara/build.py      # index.html, items.json, telegram.txt
git add maxmara/index.html maxmara/items.json maxmara/telegram.txt
git commit -m "Max Mara на Intrend: обновление <дата>"
git push origin HEAD:main
```
После пуша GitHub сам опубликует страницу и отправит итог в Telegram.
Не трогай другие папки репозитория. Ничего не покупай и не входи в аккаунты на сайте.
