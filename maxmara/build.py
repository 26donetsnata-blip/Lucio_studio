"""Собирает страницу Max Mara на Intrend.

Вход:  maxmara/crawl.json  — результат сегодняшнего обхода сайта (список моделей).
       maxmara/items.json  — данные прошлой версии (для сравнения).
Выход: maxmara/items.json, maxmara/index.html, maxmara/telegram.txt

Формат модели в crawl.json:
  {"cat": "Пальто", "name": "GANGE", "line": "Max Mara", "desc": "...",
   "price": 1750, "old": 0, "vars": [{"c": "бежевый", "u": "https://it.intrend.it/p-..."}]}
Запуск: python3 maxmara/build.py
"""
import json
import os
from datetime import datetime, timedelta, timezone

D = os.path.dirname(os.path.abspath(__file__))
URL = "https://26donetsnata-blip.github.io/Lucio_studio/maxmara/"
LINES = {"Max Mara", "Weekend", "Marina Rinaldi", "Другая линия группы"}
CATS = ["Пальто", "Пуховики", "Свитера", "Обувь", "Шарфы", "Платки и палантины", "Перчатки"]


def key(i):
    return (i["cat"], i["name"], i["line"])


def main():
    new = json.load(open(os.path.join(D, "crawl.json"), encoding="utf-8"))
    try:
        prev = json.load(open(os.path.join(D, "items.json"), encoding="utf-8"))
    except FileNotFoundError:
        prev = []
    pmap = {key(i): i for i in prev}
    purls = {v["u"] for i in prev for v in i["vars"]}

    seen, out = set(), []
    for i in new:
        assert i["cat"] in CATS, i
        assert i["line"] in LINES, i
        assert i["vars"], i
        for v in i["vars"]:
            code = v["u"].split("/p-")[1][:13]
            assert code[8:10] == "06", v["u"]
        if key(i) in seen:
            continue
        seen.add(key(i))
        p = pmap.get(key(i))
        if p is None and not any(v["u"] in purls for v in i["vars"]):
            i["st"] = "Новая"
        elif p is not None and i["price"] < p["price"]:
            i["st"] = f"Цена снизилась: было €{p['price']}"
        else:
            i["st"] = "Была раньше"
        out.append(i)

    gone = [p for p in prev if key(p) not in seen]
    today = datetime.now(timezone(timedelta(hours=3))).strftime("%d.%m.%Y")

    json.dump(out, open(os.path.join(D, "items.json"), "w", encoding="utf-8"),
              ensure_ascii=False, indent=0)
    t = open(os.path.join(D, "template.html"), encoding="utf-8").read()
    html = t.replace("__DATA__", json.dumps(out, ensure_ascii=False)).replace("__DATE__", today)
    open(os.path.join(D, "index.html"), "w", encoding="utf-8").write(html)

    n_new = [i for i in out if i["st"] == "Новая"]
    n_drop = [i for i in out if i["st"].startswith("Цена снизилась")]
    lines = [
        f"Max Mara на Intrend — {today}",
        "",
        f"Всего моделей: {len(out)} (Max Mara {sum(i['line']=='Max Mara' for i in out)}, "
        f"Weekend {sum(i['line']=='Weekend' for i in out)}, "
        f"Marina Rinaldi {sum(i['line']=='Marina Rinaldi' for i in out)})",
        f"Новых: {len(n_new)} · подешевели: {len(n_drop)} · пропали: {len(gone)}",
    ]
    if n_new:
        lines += ["", "Новые:"] + [f"• {i['name']} — {i['cat'].lower()}, €{i['price']}" for i in n_new[:10]]
        if len(n_new) > 10:
            lines.append(f"…и ещё {len(n_new) - 10}")
    if n_drop:
        lines += ["", "Подешевели:"] + [f"• {i['name']} — €{i['price']} ({i['st'].split(': ')[1]})" for i in n_drop[:10]]
    lines += ["", f"Таблица: {URL}"]
    open(os.path.join(D, "telegram.txt"), "w", encoding="utf-8").write("\n".join(lines) + "\n")
    print("\n".join(lines))


if __name__ == "__main__":
    main()
