"""Собирает maxmara/crawl.json из результата обхода (maxmara/raw.txt).

raw.txt — вывод __mmExport() из scrape.js:
  строки новых вещей  "cat|code|slug|итальянское название|цены"
  строка "#KNOWN", затем "code:цены code:цены ..." для уже известных вещей
  строка "#STATS {...}"
descs.json (необязательно) — переводы для новых моделей:
  {"slug-основа": ["Категория", "НАЗВАНИЕ", "Описание по-русски"], ...}
  категории: Пальто, Пуховики, Свитера, Обувь, Шарфы, Платки и палантины, Перчатки

Печатает модели, для которых нет перевода (тогда описание берётся итальянское).
Запуск: python3 maxmara/merge.py   (потом python3 maxmara/build.py)
"""
import json
import os
import re

D = os.path.dirname(os.path.abspath(__file__))
B = "https://it.intrend.it/p-"
CAT = {"C": "Пальто", "D": "Пуховики", "K": "Свитера", "S": "Обувь", "G": "Перчатки"}
COL = {"beige": "бежевый", "cammello": "кэмел", "marrone": "коричневый", "nero": "чёрный", "bianco": "белый",
       "blu": "синий", "blu-notte": "тёмно-синий", "grigio": "серый", "verde": "зелёный", "verde-kaki": "хаки",
       "bordeaux": "бордо", "rosso": "красный", "rosa": "розовый", "azzurro": "голубой", "cuoio": "коньячный",
       "argento": "серебристый", "beige-chiaro": "светло-бежевый", "panna": "сливочный", "avorio": "слоновая кость",
       "sabbia": "песочный", "antracite": "антрацит", "viola": "фиолетовый", "lilla": "сиреневый", "ocra": "охра",
       "giallo": "жёлтый", "fuxia": "фуксия", "bluette": "ярко-синий", "tabacco": "табачный", "perla": "жемчужный"}


def line(code):
    d, x = code[0], code[8:10]
    if x == "02":
        return {"3": "Marella", "6": "Max&Co"}.get(d, "Другая линия группы")
    return {"1": "Max Mara", "5": "Weekend", "7": "Marina Rinaldi", "2": "Sportmax",
            "9": "'S Max Mara / The Cube"}.get(d, "Другая линия группы")


def prices(p):
    n = [int(float(x)) for x in p.split("/") if x]
    return min(n), (max(n) if len(n) > 1 else 0)


def main():
    raw = open(os.path.join(D, "raw.txt"), encoding="utf-8").read()
    new_part, _, rest = raw.partition("#KNOWN")
    known_part = rest.split("#STATS")[0]
    K = {}
    for t in known_part.split():
        c, p = t.split(":")
        K[c] = prices(p)
    try:
        descs = json.load(open(os.path.join(D, "descs.json"), encoding="utf-8"))
    except FileNotFoundError:
        descs = {}

    items = json.load(open(os.path.join(D, "items.json"), encoding="utf-8"))
    out, idx = [], {}
    for i in items:
        vs = [v for v in i["vars"] if v["u"].split("/p-")[1][:13] in K]
        if not vs:
            continue
        pr = K[vs[0]["u"].split("/p-")[1][:13]]
        it = {k: i[k] for k in ("cat", "name", "line", "desc")} | {"price": pr[0], "old": pr[1], "vars": vs}
        out.append(it)
        idx[(it["cat"], it["name"], it["line"])] = it
    base_names = {i["name"] for i in out}

    missing = set()
    for ln in new_part.strip().splitlines():
        if not ln.strip():
            continue
        cat, code, slug, it_name, p = ln.split("|")
        base, _, col = slug.partition("-")
        clean = re.sub(r"\d{3,4}$", "", base)
        if clean.startswith("v") and clean[1:].upper() in base_names:
            clean = clean[1:]
        if base in descs:
            c, name, d = descs[base]
        else:
            missing.add(base)
            if cat == "A":
                c = "Платки и палантины" if re.search(r"stola|scialle|cappa|carr|foulard|pochette", it_name, re.I) else "Шарфы"
            else:
                c = CAT[cat]
            name, d = clean.upper(), it_name
        pr = prices(p)
        k = (c, name, line(code))
        if k not in idx:
            idx[k] = {"cat": c, "name": name, "line": line(code), "desc": d, "price": pr[0], "old": pr[1], "vars": []}
            out.append(idx[k])
        u = B + code + "-" + slug
        if all(v["u"] != u for v in idx[k]["vars"]):
            idx[k]["vars"].append({"c": COL.get(col, col), "u": u})

    json.dump(out, open(os.path.join(D, "crawl.json"), "w", encoding="utf-8"), ensure_ascii=False)
    print(f"crawl.json: {len(out)} моделей")
    if missing:
        print("Нет перевода (добавь в descs.json):", ", ".join(sorted(missing)))


if __name__ == "__main__":
    main()
