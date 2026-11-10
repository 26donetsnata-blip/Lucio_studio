"""Разовая проверка: отдаёт ли Intrend страницы скрипту из GitHub и как устроены карточки."""
import re, urllib.request
UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0 Safari/537.36"
def get(u):
    r = urllib.request.urlopen(urllib.request.Request(u, headers={"User-Agent": UA, "Accept-Language": "it-IT,it;q=0.9"}), timeout=60)
    return r.status, r.read().decode("utf-8", "replace")
B = "https://it.intrend.it"
for u in [B + "/cappotti-e-giacche/cappotti", B + "/cappotti-e-giacche/cappotti?q=%3AtopRated&page=1",
          B + "/scarpe-e-accessori/guanti-e-cappelli/typefilter/guanti",
          B + "/scarpe-e-accessori/guanti-e-cappelli?q=%3AtopRated%3Atypefilter%3Aguanti&page=1"]:
    try:
        st, h = get(u)
    except Exception as e:
        print("URL", u, "ERROR", repr(e)); continue
    codes = list(dict.fromkeys(re.findall(r"/p-(\d{13})-", h)))
    print("URL", u, "status", st, "len", len(h), "codes", len(codes), codes[:3], codes[-2:])
    m = re.search(r"(\d[\d.]*) prodotti", h); print("COUNT", m.group(0) if m else None)
    if u.endswith("cappotti"):
        i = h.find("/p-" + codes[0]); print("SNIPPET_START"); print(h[max(0, i - 2500): i + 4500]); print("SNIPPET_END")
