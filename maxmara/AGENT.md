# Ежедневное обновление таблицы «Max Mara на Intrend»

Цель: обойти it.intrend.it, собрать все оригиналы группы Max Mara, пересобрать
страницу `maxmara/index.html` и запушить в `main`. После пуша GitHub сам
опубликует страницу и отправит итог в Telegram (workflow `maxmara-telegram.yml`).
Пиши всё по-русски.

## 1. Обход сайта
Открывай страницы через WebFetch. На каждой странице каталога проси вывести
ВСЕ карточки строкой `URL | название | цена | старая цена`. Листание:
`?q=%3AtopRated&page=N` (первая страница — без параметра, затем page=1, 2, …),
пока карточки не закончатся или не начнут повторяться.

| Категория в данных | Раздел |
|---|---|
| Пальто | https://it.intrend.it/cappotti-e-giacche/cappotti (≈18 стр.) |
| Пуховики | https://it.intrend.it/cappotti-e-giacche/piumini-e-imbottiti (≈8 стр.) |
| Свитера | https://it.intrend.it/abbigliamento/maglie-e-cardigan с фильтром кашемира: `?q=%3AtopRated%3AmaterialFilter%3Acachemire&page=N` (≈7 стр.) и страница `/abbigliamento/maglie-e-cardigan/materialFilter/cammello` |
| Обувь | https://it.intrend.it/scarpe-e-accessori/stivali, /stivaletti, /scarpe-basse, /scarpe-con-tacco, /sneakers — первые 2 страницы каждого |
| Шарфы / Платки и палантины | https://it.intrend.it/scarpe-e-accessori/sciarpe-e-foulard (≈13 стр.) и `/sciarpe-e-foulard/materialFilter/cachemire` |
| Перчатки | https://it.intrend.it/scarpe-e-accessori/guanti-e-cappelli (≈21 стр.) — только перчатки (guanti), шапки пропускай |

Если страница не открылась — повтори один раз, потом пропусти и запомни.
Если не открылось больше половины разделов — НЕ пушь, а отправь в Telegram
сообщение об ошибке (шаг 4, вариант Б).

## 2. Что берём
Код — 13 цифр после `/p-` в ссылке. Берём только если 9-я и 10-я цифры = `06`.
`05` (линия Intrend) и `02` — не берём. Ссылки со slug на `v...` (например
`p-4798…-vbraidy-…`) — дубли, пропускай, если есть такая же модель без `v`.

Линия по 1-й цифре: `1` — "Max Mara", `5` — "Weekend", `7` — "Marina Rinaldi",
остальные — "Другая линия группы".

Шарфы и платки: если в названии foulard, stola, scialle, cappa, carré — категория
"Платки и палантины", иначе "Шарфы".

## 3. Сборка
Запиши `maxmara/crawl.json` — список моделей (одна модель = одна запись, цвета
в `vars`):

```json
{"cat": "Пальто", "name": "GANGE", "line": "Max Mara",
 "desc": "Пальто из двойного кашемира и верблюжьей шерсти",
 "price": 1750, "old": 0,
 "vars": [{"c": "бежевый", "u": "https://it.intrend.it/p-1016025206001-gange-beige"}]}
```

- `name` — модель из slug заглавными буквами, без `1234` и без цвета.
- `desc` — короткое описание по-русски (переведи итальянское название карточки).
  Если модель уже есть в `maxmara/items.json` — возьми описание оттуда.
- `price` / `old` — целые евро; `old` = 0, если скидки нет.
- `c` — цвет по-русски (beige — бежевый, cammello — кэмел, nero — чёрный и т. д.).

Затем: `python3 maxmara/build.py` — скрипт сравнит с прошлой версией, проставит
статусы и создаст `index.html`, `items.json`, `telegram.txt`.
`crawl.json` в git не добавляй.

## 4. Публикация
А. Всё хорошо: `git add maxmara/index.html maxmara/items.json maxmara/telegram.txt`,
коммит «Max Mara на Intrend: обновление <дата>», `git push origin HEAD:main`.

Б. Обход не удался: запиши в `maxmara/telegram.txt` строку
«Max Mara на Intrend — <дата>: сегодня обновить не получилось (сайт не открылся).
Таблица со вчерашними данными: https://26donetsnata-blip.github.io/Lucio_studio/maxmara/»
и запушь только этот файл.

Не трогай другие папки репозитория.
