# checks the course in content/ before it's compiled into the app. errors fail ci; warnings are for reviewers.
#   python tools/lint_content.py            all stages
#   python tools/lint_content.py 2          one stage (still checks duplicates against the whole course)
#   python tools/lint_content.py --gumar    also counts each word in real gulf text (needs a local gumar.sqlite, see gulfcheck)
import json, re, sys
from pathlib import Path

root = Path(__file__).resolve().parent.parent
HAR = re.compile(r"[ً-ٰٟـ]")
def norm(s):  # same idea as normalizeArabic in the app
    s = HAR.sub("", s); s = re.sub("[أإآٱ]", "ا", s)
    s = s.replace("ى", "ي").replace("ة", "ه").replace("ؤ", "و").replace("ئ", "ي").replace("چ", "ك").replace("گ", "ق")
    return re.sub(r"\s+", " ", re.sub(r"[^ء-ي\s]", " ", s)).strip()
AR = re.compile(r"[ء-ي]")
LATIN = re.compile(r"[A-Za-z]")
TR_OK = re.compile(r"^[a-zA-Zāīūēōḥṣṭẓḍʿʼ'’ĀĪŪĒŌḤṢṬẒ\- ,.?!;:()/…\"“”0-9]+$")  # capitals for names (ʿĀysha)
# words that give away fuṣḥā or another dialect inside a gulf line (warnings: some have rare legitimate gulf uses)
MSA = {"سوف", "لن", "لم", "ليس", "ليست", "هل", "الذي", "التي", "الذين", "ماذا", "لماذا", "اريد", "الان", "انني", "لكي", "حسنا", "ايضا", "جدا"}
OTHER = {"عايز", "عاوز", "دلوقتي", "ازيك", "بدي", "بدك", "بدها", "هلق", "هيك", "كتير", "منيح", "كويس", "فين", "بتاع", "اوي", "حاجه", "عشان ايه", "دي", "ده", "كده", "هيدا", "هاد", "شنو هاد", "تبغى", "ابغى", "ايش"}
FIELDS = {"id", "stage", "title", "goal", "tip", "dialogue", "items", "grammar", "culture", "task", "receptive"}

def units_of(n):
    out = []
    f = root / "content" / f"stage{n}.json"
    if f.exists(): out += [(f.name, u) for u in json.loads(f.read_text(encoding="utf-8"))]
    for g in sorted((root / "content" / f"stage{n}").glob("*.json"), key=lambda p: p.name):
        out += [(f"stage{n}/{g.name}", u) for u in json.loads(g.read_text(encoding="utf-8"))]
    return out

def main():
    args = [a for a in sys.argv[1:] if not a.startswith("--")]
    only = int(args[0]) if args else None
    gumar = "--gumar" in sys.argv
    errs, warns = [], []
    seen_ids, seen_items = {}, {}
    known = set()  # every word form taught or heard so far, in course order
    for n in range(1, 6):
        for src, u in units_of(n):
            uid = u.get("id", "?"); where = f"{src} {uid}"
            E = lambda m: errs.append(f"{where}: {m}") if only in (None, n) else None
            W = lambda m: warns.append(f"{where}: {m}") if only in (None, n) else None
            if not isinstance(u, dict): E("not an object"); continue
            if not re.fullmatch(r"u\d+|s[1-5]u\d{3}", str(uid)): E("bad id")
            if uid in seen_ids: E(f"duplicate unit id (also {seen_ids[uid]})")
            seen_ids[uid] = src
            if u.get("stage") != n: E(f"stage {u.get('stage')} in the stage {n} file")
            extra = set(u) - FIELDS
            if extra: E(f"unknown fields {sorted(extra)}")
            for k, mx in (("title", 80), ("goal", 160), ("tip", 300)):
                if not (isinstance(u.get(k), str) and u[k].strip() and len(u[k]) <= mx): E(f"{k} missing or over {mx} chars")
            for k, mx in (("grammar", 120), ("culture", 400), ("task", 400)):
                if k in u and not (isinstance(u[k], str) and 0 < len(u[k]) <= mx): E(f"{k} empty or over {mx} chars")
            dl = u.get("dialogue"); it = u.get("items")
            if "receptive" in u and not (isinstance(u["receptive"], list) and all(isinstance(i, int) and 0 <= i < len(it or []) for i in u["receptive"]) and len(set(u["receptive"])) == len(u["receptive"])): E("receptive must list item indexes")
            if not (isinstance(dl, list) and 3 <= len(dl) <= 10): E("dialogue must have 3-10 lines"); dl = []
            if not (isinstance(it, list) and 5 <= len(it) <= 9): E("items must be 5-9"); it = []
            elif n >= 2 and len(it) < 8 and not re.search(r"checkpoint|exit", str(u.get("title", "")) + str(u.get("goal", "")), re.I): W(f"only {len(it)} items: normal lessons need 8-9 (FRAMEWORK item arithmetic)")
            for i, l in enumerate(dl):
                if not (isinstance(l, list) and len(l) == 4 and l[0] in ("A", "B") and all(isinstance(x, str) and x.strip() for x in l[1:])): E(f"dialogue[{i}] shape"); continue
                check_line(l[1], l[2], l[3], f"dialogue[{i}]", E, W, 200)
            for i, r in enumerate(it):
                if not (isinstance(r, list) and len(r) == 5 and all(isinstance(x, str) for x in r) and all(x.strip() for x in r[:3])): E(f"items[{i}] shape"); continue
                check_line(r[0], r[1], r[2], f"items[{i}]", E, W, 80)
                if r[3] and not AR.search(r[3]): E(f"items[{i}] fuṣḥā column isn't Arabic")
                k = norm(r[0])
                if k in seen_items: E(f"items[{i}] {r[0]} already taught in {seen_items[k]}")
                seen_items[k] = uid
                en, note = r[2].lower(), r[4].lower()
                if "(to a man)" in en and "woman" not in note: W(f"items[{i}] says (to a man) but the note has no woman's form")
                if "(to a woman)" in en and "man" not in note.replace("woman", ""): W(f"items[{i}] says (to a woman) but the note has no man's form")
            # how much of the dialogue is new: a lesson should be mostly words already met
            if only in (None, n) and dl:
                words = [w for l in dl for w in norm(l[1]).split()]
                taught = {w for r in it for w in norm(r[0]).split()}
                new = [w for w in words if w not in known and strip(w) not in known and w not in taught and strip(w) not in taught]
                if words and len(new) / len(words) > 0.35: W(f"{len(new)}/{len(words)} dialogue words are new and not in this lesson's items: {' '.join(sorted(set(new))[:12])}")
            for l in dl: known.update(norm(l[1]).split())
            for r in it: known.update(norm(r[0]).split())
            known.update(strip(w) for w in list(known))
    check_translit_consistency(only, warns)
    if only is None: check_fusha(errs, warns)
    if gumar: gumar_check(only, warns)
    for m in errs: print("ERROR", m)
    for m in warns: print("warn ", m)
    total = sum(len(units_of(n)) for n in range(1, 6))
    print(f"{total} units, {len(seen_items)} phrases: {len(errs)} errors, {len(warns)} warnings")
    sys.exit(1 if errs else 0)

# the same arabic word should be transliterated the same way everywhere (wiḥda in one lesson and waḥda in another
# teaches two pronunciations). lines whose arabic and transliteration have the same number of words are aligned word by word
def check_translit_consistency(only, warns):
    seen = {}
    for n in range(1, 6):
        for src, u in units_of(n):
            rows = [(l[1], l[2]) for l in u.get("dialogue", []) if isinstance(l, list) and len(l) == 4] + [(r[0], r[1]) for r in u.get("items", []) if isinstance(r, list) and len(r) == 5]
            for ar, tr in rows:
                aw = ar.replace("،", " ").replace("؟", " ").split(); tw = re.sub(r"[,.?!;:…]", " ", tr).split()
                if len(aw) != len(tw): continue
                for a_, t_ in zip(aw, tw):
                    k = norm(a_); t_ = t_.lower().strip("'\"“”()")
                    if k and t_: seen.setdefault(k, {}).setdefault(t_, set()).add(u.get("id"))
    for k, forms in seen.items():
        if len(forms) > 1:
            ids = sorted({i for v in forms.values() for i in v})
            stages = {int(i[1]) if i.startswith("s") else 1 for i in ids}
            if only is None or only in stages:
                warns.append(f"translit: {k} is written " + " / ".join(f"{t} ({', '.join(sorted(v)[:3])})" for t, v in forms.items()))

def batches(name):  # content/<name>.json then content/<name>/*.json
    out = []; f = root / "content" / f"{name}.json"
    if f.exists(): out += [(f.name, x) for x in json.loads(f.read_text(encoding="utf-8"))]
    for g in sorted((root / "content" / name).glob("*.json"), key=lambda p: p.name):
        out += [(f"{name}/{g.name}", x) for x in json.loads(g.read_text(encoding="utf-8"))]
    return out

DOMAINS = {"function", "signs", "forms", "services", "news", "religion", "general"}
def dialect_items():  # bare form -> unit id of every taught dialect item
    out = {}
    for n in range(1, 6):
        for _, u in units_of(n):
            for it in u.get("items", []):
                if isinstance(it, list) and it and isinstance(it[0], str): out.setdefault(re.sub(r"^ال", "", norm(it[0])), u.get("id"))
    return out

def check_fusha(errs, warns):
    seen = {}
    taught = dialect_items()
    for i, (src, r) in enumerate(batches("msa")):
        where = f"{src} m.{i}"
        if i >= 44 and len(r) > 3 and r[3] == "G=" and not re.match(r"[٠-٩0-9]", r[0]) and re.sub(r"^ال", "", norm(r[0])) in taught:
            warns.append(f"{where}: {r[0]} is G= and the same as dialect item in {taught[re.sub(r'^ال', '', norm(r[0]))]}: a wasted card unless the meaning differs")
        if not (isinstance(r, list) and 3 <= len(r) <= 5 and all(isinstance(x, str) for x in r) and all(x.strip() for x in r[:3])): errs.append(f"{where}: row shape"); continue
        if not AR.search(r[0]) or LATIN.search(r[0]): errs.append(f"{where}: Arabic field")
        if AR.search(r[1]) or AR.search(r[2]): errs.append(f"{where}: Arabic letters in translit/english")
        if not TR_OK.match(r[1]): errs.append(f"{where}: transliteration has characters outside the scheme: {r[1]}")
        if len(r) > 3 and r[3] and not re.fullmatch(r"G=|G~ .+|M \S.+", r[3]): errs.append(f"{where}: gulf column format: {r[3]}")
        if len(r) > 4 and r[4] and r[4] not in DOMAINS: errs.append(f"{where}: domain {r[4]}")
        if i >= 44 and not HAR.search(r[0]): warns.append(f"{where}: fuṣḥā word without vowel marks: {r[0]}")
        k = re.sub(r"\s+", " ", r[0].replace("\u0640", "")).strip()  # vowelled form: أَمَام and إِمَام, ذَكَر and ذَكَرَ are different words
        if k in seen: errs.append(f"{where}: {r[0]} duplicates {seen[k]}")
        elif norm(r[0]) in {norm(x) for x in seen}: warns.append(f"{where}: {r[0]} looks like another row once vowels are dropped: make sure the english tells them apart")
        else:
            bare = lambda w: re.sub(r"^ال", "", norm(w))
            if bare(r[0]) in {bare(x) for x in seen}: warns.append(f"{where}: {r[0]} is another row with or without the article al-: probably the same word taught twice")
        seen[k] = where
    ids = set()
    for src, r in batches("readings"):
        rid = r.get("id") if isinstance(r, dict) else None; where = f"{src} {rid}"
        if not (isinstance(rid, str) and re.fullmatch(r"r[1-5]-\d{2}", rid)) or rid in ids: errs.append(f"{where}: bad or duplicate id"); continue
        ids.add(rid)
        if not (r.get("level") in range(1, 6) and r.get("stage") in range(1, 6) and isinstance(r.get("title"), str) and r["title"]): errs.append(f"{where}: level/stage/title")
        ls = r.get("lines"); qs = r.get("questions")
        if not (isinstance(ls, list) and len(ls) >= 2 and all(isinstance(l, list) and len(l) == 2 and AR.search(l[0]) and isinstance(l[1], str) and l[1] for l in ls)): errs.append(f"{where}: lines must be [arabic, english] pairs"); ls = []
        for j, l in enumerate(ls):
            if len(l[0].split()) > 20: warns.append(f"{where}: line {j} over 20 words")
        if not (isinstance(qs, list) and qs and all(isinstance(q, list) and len(q) == 3 and isinstance(q[1], list) and len(q[1]) >= 2 and q[2] in q[1] for q in qs)): errs.append(f"{where}: questions must be [question, [options], answer-in-options]")

PRE = ("وال", "بال", "فال", "لل", "ال", "و", "ب", "ل", "ف")
def strip(w):
    for p in PRE:
        if w.startswith(p) and len(w) - len(p) >= 2: return w[len(p):]
    return w

def check_line(ar, tr, en, where, E, W, mx):
    if len(ar) > mx or len(tr) > mx or len(en) > mx: E(f"{where} over {mx} chars")
    if not AR.search(ar) or LATIN.search(ar): E(f"{where} Arabic field has no Arabic or has Latin letters")
    if HAR.search(ar.replace("ّ", "")): W(f"{where} has vowel marks (the style is everyday spelling without them)")
    if AR.search(tr) or AR.search(en): E(f"{where} transliteration or English has Arabic letters")
    if not TR_OK.match(tr): E(f"{where} transliteration has characters outside the scheme: {tr}")
    if "ḍ" in tr: W(f"{where} uses ḍ: the gulf scheme writes ẓ for both ض and ظ")
    ws = set(norm(ar).split())
    m = ws & MSA
    if m: W(f"{where} fuṣḥā-looking word(s) in a gulf line: {' '.join(sorted(m))}")
    o = ws & OTHER
    if o: W(f"{where} non-gulf dialect word(s): {' '.join(sorted(o))}")

def gumar_check(only, warns):
    try:
        sys.path.insert(0, "/home/claude/gulfcheck"); import attest
    except Exception as e:
        warns.append(f"gumar check skipped: {e}"); return
    for n in range(1, 6):
        if only not in (None, n): continue
        for src, u in units_of(n):
            for kind, rows, idx in (("dialogue", u.get("dialogue", []), 1), ("items", u.get("items", []), 0)):
                for i, r in enumerate(rows):
                    _, weak, unseen, _ = attest.line_report(r[idx])
                    if weak: warns.append(f"{src} {u.get('id')}: {kind}[{i}] words rare or absent in gulf text: {' '.join(weak)}")

if __name__ == "__main__":
    main()
