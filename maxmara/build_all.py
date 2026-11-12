"""Сборка страниц «Max Mara на Intrend» из выгрузки обхода (scrape.js → __mmDump()).

Две подборки — две ссылки:
  outer — верхняя одежда: пальто, пуховики, сапоги, перчатки, шарфы, платки   → maxmara/
  rest  — одежда и аксессуары: свитера, платья, пиджаки, юбки, брюки,
          обувь, сумки, аксессуары                                           → maxmara/odezhda/

Запуск:  python3 maxmara/build_all.py <файл выгрузки> outer|rest|all
Файл выгрузки — текст между строками BEGIN и END (строки cat|code|slug|итальянское название|цены)
или JSON-файл результата инструмента, в котором этот текст лежит.
"""
import json
import os
import re
import sys
from datetime import datetime, timedelta, timezone

D = os.path.dirname(os.path.abspath(__file__))
BASE = "https://it.intrend.it/p-"
SITE = "https://26donetsnata-blip.github.io/Lucio_studio/maxmara/"

SETS = {
    "outer": {"dir": D, "url": SITE, "items": "items.json",
              "cats": ["Пальто", "Пуховики", "Сапоги", "Перчатки", "Шарфы", "Платки и палантины"],
              "h1": "Max Mara на Intrend", "sub": "Верхняя одежда: пальто, пуховики, сапоги, перчатки, шарфы и платки.",
              "other": ("odezhda/", "Одежда и аксессуары →")},
    "rest": {"dir": os.path.join(D, "odezhda"), "url": SITE + "odezhda/", "items": "items.json",
             "cats": ["Свитера", "Платья", "Пиджаки", "Юбки", "Брюки", "Обувь", "Сумки", "Аксессуары"],
             "h1": "Max Mara на Intrend: одежда", "sub": "Свитера, платья, пиджаки, юбки, брюки, обувь, сумки и аксессуары.",
             "other": ("../", "← Верхняя одежда")},
}
ALL_CATS = SETS["outer"]["cats"] + SETS["rest"]["cats"]

LINE = {"1": "Max Mara", "2": "Sportmax", "3": "Marella", "5": "Weekend", "6": "Max&Co",
        "7": "Marina Rinaldi", "9": "'S Max Mara / The Cube"}


def line_of(code):
    return LINE.get(code[0], "Другая линия группы")


def is_original(code):
    d = code[8:10]
    return d == "06" or (d == "02" and code[0] in "36")


def category(letter, code, it):
    if letter == "C":
        return "Пальто"
    if letter == "D":
        return "Пуховики"
    if letter == "K":
        return "Свитера"
    if letter == "S":
        return "Сапоги" if code[1:4] in ("796", "798") else "Обувь"
    if letter == "G":
        return "Перчатки" if re.search(r"guant", it, re.I) else "Аксессуары"
    if letter == "A":
        return "Платки и палантины" if re.search(r"stola|scialle|cappa|carr|foulard|pochette|poncho", it, re.I) else "Шарфы"
    return {"V": "Платья", "J": "Пиджаки", "R": "Юбки", "T": "Брюки", "B": "Сумки", "X": "Аксессуары"}[letter]


# ---------- перевод названий (короткая форма: «Платье: шерсть, с поясом») ----------
NOUNS = [
    ("occhiali da sole", "Солнцезащитные очки"), ("abito chemisier", "Платье-рубашка"), ("gonna a portafoglio", "Юбка на запах"),
    ("cappa", "Накидка"), ("mantella", "Накидка"), ("spolverino", "Пыльник"), ("montgomery", "Дафлкот"),
    ("giaccone", "Куртка-пальто"), ("cappotto", "Пальто"), ("caban", "Бушлат"), ("parka", "Парка"), ("piumino", "Пуховик"),
    ("imbottito", "Утеплённая куртка"), ("imbottita", "Утеплённая куртка"), ("bomber", "Бомбер"), ("blouson", "Куртка"),
    ("minidress", "Мини-платье"), ("tubino", "Платье-футляр"), ("chemisier", "Платье-рубашка"), ("caftano", "Кафтан"),
    ("tunica", "Туника"), ("abito", "Платье"), ("dress", "Платье"), ("tuta", "Комбинезон"), ("salopette", "Комбинезон"),
    ("minigonna", "Мини-юбка"), ("gonna", "Юбка"), ("pantaloni", "Брюки"), ("pantalone", "Брюки"), ("jeans", "Джинсы"),
    ("leggings", "Леггинсы"), ("bermuda", "Бермуды"), ("shorts", "Шорты"), ("short", "Шорты"), ("joggers", "Джоггеры"), ("jogger", "Джоггеры"),
    ("blazer", "Блейзер"), ("smoking", "Жакет-смокинг"), ("giacca", "Жакет"), ("gilet", "Жилет"), ("kimono", "Кимоно"),
    ("dolcevita", "Водолазка"), ("cardigan", "Кардиган"), ("maglia", "Свитер"), ("felpa", "Свитшот"), ("polo", "Поло"),
    ("camicia", "Рубашка"), ("bustier", "Бюстье"), ("top", "Топ"),
    ("stivaletti", "Ботильоны"), ("stivaletto", "Ботильоны"), ("ankle boot", "Ботильоны"), ("anfibi", "Ботинки"), ("anfibio", "Ботинки"),
    ("cuissard", "Ботфорты"), ("stivali", "Сапоги"), ("stivale", "Сапоги"), ("ballerine", "Балетки"), ("ballerina", "Балетки"),
    ("mocassini", "Мокасины"), ("mocassino", "Мокасины"), ("stringate", "Туфли на шнуровке"), ("stringata", "Туфли на шнуровке"),
    ("slingback", "Слингбэки"), ("décolleté", "Лодочки"), ("mules", "Мюли"), ("mule", "Мюли"), ("sandalo", "Босоножки"),
    ("sneakers", "Кроссовки"), ("sneaker", "Кроссовки"), ("scarpa", "Туфли"),
    ("clutch", "Клатч"), ("pochette", "Клатч"), ("portamonete", "Кошелёк"), ("porta", "Чехол"), ("borsa", "Сумка"),
    ("guanti", "Перчатки"), ("berretto", "Шапка"), ("cappello", "Шляпа"), ("sciarpa", "Шарф"), ("stola", "Палантин"),
    ("scialle", "Шаль"), ("foulard", "Платок"), ("poncho", "Пончо"), ("collo", "Воротник"), ("cintura", "Ремень"),
    ("orecchini", "Серьги"), ("collana", "Колье"), ("bracciale", "Браслет"), ("anello", "Кольцо"), ("spilla", "Брошь"),
]
MAT = [("misto lana", "смесовая шерсть"), ("cashmere", "кашемир"), ("cammello", "верблюжья шерсть"), ("alpaca", "альпака"),
       ("mohair", "мохер"), ("seta", "шёлк"), ("lana", "шерсть"), ("cotone", "хлопок"), ("lino", "лён"), ("viscosa", "вискоза"),
       ("jersey", "джерси"), ("raso", "атлас"), ("satin", "атлас"), ("cady", "кади"), ("twill", "твил"), ("gabardina", "габардин"),
       ("flanella", "фланель"), ("drap", "драп"), ("velluto", "бархат"), ("jacquard", "жаккард"), ("crépe", "креп"), ("crêpe", "креп"),
       ("crepe", "креп"), ("georgette", "жоржет"), ("popeline", "поплин"), ("taffetà", "тафта"), ("taffettà", "тафта"),
       ("tulle", "тюль"), ("pizzo", "кружево"), ("denim", "деним"), ("tweed", "твид"), ("chiffon", "шифон"), ("organza", "органза"),
       ("voile", "вуаль"), ("nappa", "наппа"), ("vernice", "лаковая кожа"), ("scamosciata", "замша"), ("suede", "замша"),
       ("pelle", "кожа"), ("bouclé", "букле"), ("beaver", "бобрик"), ("feltro", "фетр"), ("ciniglia", "синель"),
       ("duchesse", "дюшес"), ("shantung", "шантунг"), ("faille", "фай"), ("lamé", "ламе"), ("lamè", "ламе"), ("montone", "овчина"),
       ("peluche", "плюш"), ("flanella", "фланель"), ("garza", "марлевка")]
FEAT = [("doppiopetto", "двубортный"), ("monopetto", "однобортный"), ("oversize", "оверсайз"), ("over", "оверсайз"),
        ("reversibile", "двусторонний"), ("smanicato", "без рукавов"), ("smanicata", "без рукавов"), ("antigoccia", "водоотталкивающий"),
        ("trapuntat", "стёганый"), ("spalmat", "с покрытием"), ("stretch", "стрейч"), ("plissé", "плиссе"), ("plissè", "плиссе"),
        ("palazzo", "палаццо"), ("sigaretta", "сигареты"), ("cargo", "карго"), ("flare", "клёш"), ("svasat", "расклешённый"),
        ("aderente", "облегающий"), ("dritt", "прямой"), ("ampi", "широкий"), ("lung", "длинный"), ("cort", "короткий"),
        ("cropped", "укороченный"), ("crop", "укороченный"), ("midi", "миди"), ("longuette", "миди"), ("maxi", "макси"),
        ("mini", "мини"), ("boxy", "boxy"), ("slim", "slim"), ("cocoon", "кокон"), ("monospalla", "на одно плечо"),
        ("pieghe", "со складками"), ("pinces", "с защипами"), ("spacc", "с разрезом"), ("paillettes", "с пайетками"),
        ("strass", "со стразами"), ("cristalli", "с кристаллами"), ("perline", "с бусинами"), ("cintura", "с поясом"),
        ("fusciacca", "с поясом"), ("cappuccio", "с капюшоном"), ("tasche", "с карманами"), ("coulisse", "на кулиске"),
        ("zip", "на молнии"), ("coste", "в рубчик"), ("trecce", "с косами"), ("ricam", "с вышивкой"), ("frange", "с бахромой"),
        ("fiocc", "с бантом"), ("balze", "с воланами"), ("volant", "с воланами"), ("stampat", "с принтом"), ("gessat", "в полоску"),
        ("pied de poule", "«гусиная лапка»"), ("principe di galles", "«принц Уэльский»"), ("tacco", "на каблуке"),
        ("borchie", "с заклёпками"), ("scollo a v", "V-вырез"), ("collo alto", "высокий ворот"), ("tracolla", "через плечо"),
        ("imbottit", "утеплённый"), ("tecnic", "технический"), ("jogging", "джоггеры")]


def translate(it):
    s = it.lower()
    noun = None
    for k, v in NOUNS:
        if re.search(r"(?<![a-zà-ÿ])" + re.escape(k) + r"(?![a-zà-ÿ])", s):
            noun = v
            break
    kws = []
    for k, v in MAT + FEAT:
        if re.search(r"(?<![a-zà-ÿ])" + re.escape(k), s) and v not in kws and v != (noun or "").lower():
            if noun and k in ("cintura",) and noun == "Ремень":
                continue
            kws.append(v)
    if not noun:
        return it
    return noun + (": " + ", ".join(kws[:5]) if kws else "")


COL = {"beige": "бежевый", "beige-chiaro": "светло-бежевый", "cammello": "кэмел", "marrone": "коричневый", "nero": "чёрный",
       "bianco": "белый", "blu": "синий", "blu-notte": "тёмно-синий", "bluette": "ярко-синий", "azzurro": "голубой",
       "grigio": "серый", "grigio-chiaro": "светло-серый", "grigio-scuro": "тёмно-серый", "grigio-medio": "серый",
       "antracite": "антрацит", "verde": "зелёный", "verde-kaki": "хаки", "verde-militare": "хаки", "bordeaux": "бордо",
       "rosso": "красный", "rosa": "розовый", "rosa-antico": "пыльно-розовый", "rosa-chiaro": "светло-розовый", "fuxia": "фуксия",
       "panna": "сливочный", "avorio": "слоновая кость", "sabbia": "песочный", "tortora": "серо-бежевый", "tabacco": "табачный",
       "cuoio": "коньячный", "oro": "золотой", "argento": "серебристый", "viola": "фиолетовый", "lilla": "сиреневый",
       "ocra": "охра", "giallo": "жёлтый", "arancione": "оранжевый", "corallo": "коралловый", "perla": "жемчужный",
       "animalier": "анималистичный", "fantasia": "с узором", "multicolore": "разноцветный", "ecru": "экрю", "mattone": "кирпичный",
       "cioccolato": "шоколадный", "petrolio": "петроль", "turchese": "бирюзовый", "celeste": "голубой", "avio": "серо-голубой",
       "senape": "горчичный", "salvia": "шалфей", "nocciola": "ореховый", "piombo": "свинцовый", "rosa-cipria": "пудровый"}


def color_ru(c):
    return COL.get(c, c.replace("-", " "))


def model_name(base):
    return re.sub(r"\d+$", "", base).upper() or base.upper()


def parse(path):
    raw = open(path, encoding="utf-8").read()
    if raw.lstrip().startswith("["):
        part = json.loads(raw)[0]["text"]
        raw = json.JSONDecoder().raw_decode(part)[0] if part.startswith('"') else part
    body = raw.split("BEGIN\n", 1)[-1].split("\nEND", 1)[0]
    rows = []
    for ln in body.strip().splitlines():
        p = ln.split("|")
        if len(p) != 5 or not re.fullmatch(r"\d{13}", p[1]):
            continue
        rows.append(p)
    return rows


def build(rows, which):
    S = SETS[which]
    os.makedirs(S["dir"], exist_ok=True)
    ipath = os.path.join(S["dir"], S["items"])
    try:
        prev = json.load(open(ipath, encoding="utf-8"))
    except FileNotFoundError:
        prev = None
    old_desc = {}
    for src in (os.path.join(D, "items.json"), os.path.join(D, "odezhda", "items.json")):
        try:
            for i in json.load(open(src, encoding="utf-8")):
                old_desc.setdefault(i["name"], i["desc"])
        except FileNotFoundError:
            pass
    prev_price = {}
    if prev:
        for i in prev:
            for v in i["vars"]:
                prev_price[v["u"]] = i["price"]

    models, idx, seen = [], {}, set()
    names = {model_name(r[2].split("-", 1)[0]) for r in rows}
    for letter, code, slug, it, pr in rows:
        if code in seen or not is_original(code):
            continue
        seen.add(code)
        cat = category(letter, code, it)
        if cat not in S["cats"]:
            continue
        base, _, col = slug.partition("-")
        name = model_name(base)
        if name.startswith("V") and name[1:] in names:
            name = name[1:]
        n = [int(float(x)) for x in pr.split("/") if x]
        if not n:
            continue
        price, old = min(n), (max(n) if len(n) > 1 else 0)
        key = (cat, name, line_of(code))
        if key not in idx:
            idx[key] = {"cat": cat, "name": name, "line": line_of(code), "desc": old_desc.get(name) or translate(it),
                        "price": price, "old": old, "vars": []}
            models.append(idx[key])
        m = idx[key]
        m["price"], m["old"] = min(m["price"], price), max(m["old"], old)
        u = BASE + code + "-" + slug
        if all(v["u"] != u for v in m["vars"]):
            m["vars"].append({"c": color_ru(col), "u": u})

    new = drop = 0
    for m in models:
        urls = [v["u"] for v in m["vars"]]
        if prev is None:
            m["st"] = "Была раньше"
        elif not any(u in prev_price for u in urls):
            m["st"] = "Новая"; new += 1
        else:
            was = min(prev_price[u] for u in urls if u in prev_price)
            if m["price"] < was:
                m["st"] = f"Цена снизилась: было €{was}"; drop += 1
            else:
                m["st"] = "Была раньше"
    gone = 0
    if prev:
        cur = {v["u"] for m in models for v in m["vars"]}
        gone = sum(1 for i in prev if i["cat"] in S["cats"] and not any(v["u"] in cur for v in i["vars"]))

    today = datetime.now(timezone(timedelta(hours=3))).strftime("%d.%m.%Y")
    json.dump(models, open(ipath, "w", encoding="utf-8"), ensure_ascii=False, indent=0)
    t = open(os.path.join(D, "template.html"), encoding="utf-8").read()
    t = t.replace("__CATLIST__", json.dumps(S["cats"], ensure_ascii=False))
    t = t.replace("<title>Max Mara на Intrend — находки</title>", f"<title>{S['h1']}</title>")
    t = t.replace("<h1>Max Mara на Intrend</h1>",
                  f"<h1>{S['h1']}</h1>\n<p class=\"lead\"><b>{S['sub']}</b> <a href=\"{S['other'][0]}\">{S['other'][1]}</a></p>")
    html = t.replace("__DATA__", json.dumps(models, ensure_ascii=False)).replace("__DATE__", today)
    open(os.path.join(S["dir"], "index.html"), "w", encoding="utf-8").write(html)
    cnt = lambda l: sum(m["line"] == l for m in models)
    return {"which": which, "models": len(models), "new": new, "drop": drop, "gone": gone, "url": S["url"],
            "lines": {l: cnt(l) for l in ["Max Mara", "Weekend", "Marina Rinaldi", "Sportmax", "'S Max Mara / The Cube", "Marella", "Max&Co"]},
            "newlist": [m for m in models if m["st"] == "Новая"][:8],
            "droplist": [m for m in models if m["st"].startswith("Цена")][:8]}


def telegram(results):
    today = datetime.now(timezone(timedelta(hours=3))).strftime("%d.%m.%Y")
    out = [f"Max Mara на Intrend — {today}"]
    title = {"outer": "Верхняя одежда (пальто, пуховики, сапоги, перчатки, шарфы)", "rest": "Одежда и аксессуары"}
    for r in results:
        L = r["lines"]
        out += ["", title[r["which"]] + f": {r['models']} моделей",
                f"Max Mara {L['Max Mara']} · Weekend {L['Weekend']} · Marina Rinaldi {L['Marina Rinaldi']} · "
                f"Sportmax {L['Sportmax']} · 'S {L[chr(39) + 'S Max Mara / The Cube']} · Marella {L['Marella']} · Max&Co {L['Max&Co']}",
                f"Новых: {r['new']} · подешевели: {r['drop']} · пропали: {r['gone']}"]
        for m in r["newlist"]:
            out.append(f"• {m['name']} ({m['line']}) — {m['cat'].lower()}, €{m['price']}")
        for m in r["droplist"]:
            out.append(f"↓ {m['name']} — €{m['price']} ({m['st'].split(': ')[1]})")
        out.append(r["url"])
    return "\n".join(out) + "\n"


if __name__ == "__main__":
    path, which = sys.argv[1], (sys.argv[2] if len(sys.argv) > 2 else "all")
    rows = parse(path)
    assert len(rows) > 500, f"Слишком мало строк в выгрузке: {len(rows)}"
    res = [build(rows, w) for w in (["outer", "rest"] if which == "all" else [which])]
    txt = telegram(res)
    open(os.path.join(D, "telegram.txt"), "w", encoding="utf-8").write(txt)
    print(txt)
