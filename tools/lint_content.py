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
# source names the course must never show live in an untracked local file (one per line)
_pf = root / "tools" / "private_markers.txt"
PRIVATE = "".join("|" + re.escape(w.strip()) for w in (_pf.read_text(encoding="utf-8").splitlines() if _pf.exists() else []) if w.strip())
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
    seen_ids, seen_items, seen_bags, seen_stems = {}, {}, {}, {}
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
            shown = json.dumps(u, ensure_ascii=False)  # everything here reaches the learner
            mk = re.search(r"(?:native[ -]check|native queue|\[weak\]|\(U\)|\bU\b[,;)\x22]|TODO|course lead|\bS: |\bC: |attest|Gumar" + PRIVATE + r")", shown)
            if mk: E(f"writer-only marker shown to the learner: {mk.group(0)!r} (move it to the writer log)")
            if "receptive" in u and not (isinstance(u["receptive"], list) and all(isinstance(i, int) and 0 <= i < len(it or []) for i in u["receptive"]) and len(set(u["receptive"])) == len(u["receptive"])): E("receptive must list item indexes")
            if not (isinstance(dl, list) and 3 <= len(dl) <= 10): E("dialogue must have 3-10 lines"); dl = []
            if not (isinstance(it, list) and 5 <= len(it) <= 9): E("items must be 5-9"); it = []
            elif n >= 2 and len(it) < (5 if n == 5 else 8) and not re.search(r"checkpoint|exit", str(u.get("title", "")) + str(u.get("goal", "")), re.I): W(f"only {len(it)} items: normal lessons need {'5-9 at C1 (STAGE5_BRIEF)' if n == 5 else '8-9 (FRAMEWORK item arithmetic)'}")
            for i, l in enumerate(dl):
                if isinstance(l, list) and len(l) == 5 and n > 2: E(f"dialogue[{i}] has a vowelled form outside stages 1-2"); continue
                if not (isinstance(l, list) and len(l) in (4, 5) and l[0] in ("A", "B") and all(isinstance(x, str) and x.strip() for x in l[1:])): E(f"dialogue[{i}] shape"); continue
                check_line(l[1], l[2], l[3], f"dialogue[{i}]", E, W, 200)
            for m in formula_gaps(dl): W(m)
            if n >= 4 and isinstance(it, list):
                rec = set(u.get("receptive", [])) if isinstance(u.get("receptive"), list) else set()
                for i, r in enumerate(it):
                    if isinstance(r, list) and len(r) == 5:
                        tagged = "(recognise)" in r[4]
                        if tagged and i not in rec: W(f"items[{i}] note says (recognise) but the item isn't in receptive")
                        if i in rec and not tagged: W(f"items[{i}] is receptive but its note doesn't say (recognise)")
            for i, r in enumerate(it):
                if isinstance(r, list) and len(r) == 6 and n > 2: E(f"items[{i}] has a vowelled form outside stages 1-2"); continue
                if not (isinstance(r, list) and len(r) in (5, 6) and all(isinstance(x, str) for x in r) and all(x.strip() for x in r[:3]) and (len(r) == 5 or r[5].strip())): E(f"items[{i}] shape"); continue
                check_line(r[0], r[1], r[2], f"items[{i}]", E, W, 80)
                if r[3] and not AR.search(r[3]): E(f"items[{i}] fuṣḥā column isn't Arabic")
                k = norm(r[0])
                if k in seen_items: E(f"items[{i}] {r[0]} already taught in {seen_items[k]}")
                elif " " not in k and (na := re.sub(r"^ال", "", k)) != k and na in seen_items or " " not in k and ("ال" + k) in seen_items: W(f"items[{i}] {r[0]} is an earlier single-word item with or without il- ({seen_items.get(re.sub(r'^ال', '', k)) or seen_items.get('ال' + k)}): a re-teach")
                elif " " in k and (bag := " ".join(sorted(k.split()))) in seen_bags: W(f"items[{i}] {r[0]} has the same words as {seen_bags[bag][1]} in {seen_bags[bag][0]}, in another order: a re-teach unless the meaning differs")
                if norm(r[0]) in HOMOGRAPHS and uid not in HOMOGRAPHS[norm(r[0])]: W(f"items[{i}] {r[0]} is a bare homograph (STYLE §2): teach it inside a chunk")
                sk = stem_key(k)
                if k not in seen_items and sk in seen_stems and seen_stems[sk][1] != k: W(f"items[{i}] {r[0]} looks like {seen_stems[sk][1]} ({seen_stems[sk][0]}) with only the person or ending changed: if so, put it in a note and teach something new")
                seen_stems.setdefault(sk, (uid, k))
                seen_items[k] = uid
                if " " in k: seen_bags.setdefault(" ".join(sorted(k.split())), (uid, r[0]))
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
            rows = [(l[1], l[2]) for l in u.get("dialogue", []) if isinstance(l, list) and len(l) in (4, 5)] + [(r[0], r[1]) for r in u.get("items", []) if isinstance(r, list) and len(r) in (5, 6)]
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

HOMOGRAPHS = {norm(w): ok for w, ok in [('يدي', ()), ('ويه', ()), ('يا', ()), ('مرة', ('s1u044',)), ('يصلح', ('s3u029',)), ('غير', ()), ('دور', ()), ('تعرف', ()), ('ودي', ()), ('ربع', ()), ('يمه', ('s2u030',)), ('تسلم', ('s1u060',)), ('طب', ('s2u003',)), ('ودنا', ()), ('ارتاح', ()), ('لفت', ()), ('تعور', ()), ('برايك', ()), ('صدقت', ()), ('الخطبة', ()), ('بتسبح', ()), ('مثل', ('s2u034',))]}

# FRAMEWORK §7: a social formula is taught with its reply in the same dialogue, said back by the other speaker
FORMULAS = [(r"السلام عليكم", ["وعليكم السلام"]), (r"ما قصرت", ["ما سوينا شي"]), (r"يعطي\w* العافيه", ["الله يعافي"]),
    (r"الله يقوي", ["الله يعافي", "الله يقوي"]), (r"بالعافيه", ["الله يعافي"]), (r"نعيما", ["الله ينعم"]),
    (r"حيا\w* الله", ["الله يحيي"]), (r"تشرفنا", ["الشرف"]), (r"مبروك", ["الله يبارك", "يبارك في"]),
    (r"سلامات|سلامت(?:ك|ج|ه|ها|كم)\b", ["الله يسلم"]), (r"ما تشوف\w* شر", ["الله يسلم", "الشر ما"]), (r"رمضان كريم", ["الله اكرم"]),
    (r"تقبل الله", ["منا ومنكم", "منا و منكم"]), (r"عظم الله اجركم", ["اجرنا واجركم"]), (r"الله يرحم(?:ه|ها)\b", ["امين"]),
    (r"الله يوفق", ["امين", "الله يوفق"]), (r"عقبال", ["الله يسمع"]), (r"صباح الخير", ["صباح النور"]), (r"مساء الخير", ["مساء النور"]),
    (r"تصبح\w* على خير", ["من اهله"]), (r"السموحه", ["مسموح", "ما عليه"])]
def formula_gaps(dl):
    rows = [(l[0], norm(l[1])) for l in dl if isinstance(l, list) and len(l) in (4, 5)]
    out = []
    for i, (who, ar) in enumerate(rows):
        for pat, replies in FORMULAS:
            m = re.search(pat, ar)
            if not m or any(r in ar for r in replies if r not in m.group(0)): continue  # the line is itself the reply
            if not any(w != who and any(r in a for r in replies) for w, a in rows[i + 1:]):
                out.append(f"dialogue[{i}] has the formula {m.group(0)} but no later line from the other speaker gives its reply ({' / '.join(replies)}; FRAMEWORK §7)")
    return out

def stem_key(k):  # crude: drop article/b-/w- prefixes and pronoun/person endings, to spot an earlier item with only the person or ending changed
    out = []
    for w in k.split():
        w = re.sub(r"^(وال|بال|ال|و|ب)(?=..)", "", w)
        if len(w) > 3: w = re.sub(r"(هم|ها|كم|نا|ين|ون|وا|ته|تها|تهم|تك|تي|ت|ه|ك|ج|ي)$", "", w)
        out.append(w)
    return " ".join(sorted(out))

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
    if re.search(r"\bḥadd\b", tr) and "حد" in ar: W(f"{where} 'someone' is ḥad (one d); ḥadd is 'edge, limit'")
    if re.search(r"(?:^|[\s,.!?;:])lā(?=$|[\s,.!?;:])", tr) and "لا" in ar: W(f"{where} 'no' / 'don't' is la, not lā (STYLE §3)")
    C = r"(?:sh|kh|gh|th|dh|ch|[bdfghjklmnqrstvwyzḥṣṭẓʿʼ])"
    m4 = re.search(rf"\bbi[ytn]{C}{C}\w*", tr)
    if m4 and not re.match(r"bi[ytn](?:sh|kh|gh|th|dh|ch)[aeiouāīūēō]", m4.group(0)): W(f"{where} {m4.group(0)}: a helping vowel is needed after b- before two consonants (biyikhtār, bitikhsar; STYLE §2)")
    m5 = re.search(r"\b\w*([tskdgz])\1h(?:a|um)\b", tr)
    if m5: W(f"{where} {m5.group(0)}: hyphenate after a double consonant before -ha/-hum (radd-hum, gadd-ha; STYLE §3)")
    for bad, good in (("جدام", "قدام"), ("ترى", "ترا")):
        if re.search(rf"(?:^|\s){bad}(?:\s|$|[؟!.،])", ar): W(f"{where} write {good}, the course spelling, not {bad}")
    m3 = re.search(r"\b\w*[^tskdgcz\s-]-h(?:a|um)\b", tr)
    if m3: W(f"{where} {m3.group(0)}: no hyphen before -ha/-hum here; it's only for t, s, k, d, g, c, z (STYLE §3)")
    m = re.search(r"\bwi(?:l|ṣ|s|ṭ|t|sh|d|dh|th|r|n|z|ẓ)-\S+", tr)
    if m: E(f"{where} {m.group(0)}: 'and' is its own word (w il-…, STYLE §3)")
    m2 = re.search(r"\b\w*[aeiouāīūēō] i(?:l|ṣ|s|ṭ|t|sh|d|dh|th|r|n|z|ẓ)-\S+", tr)
    if m2: W(f"{where} article after a vowel is l- not il- (STYLE §3): {m2.group(0)}")
    if re.search(r"(?:^|\s)ولا(?:\s|$|[؟!.،])", ar) and re.search(r"\bwalla\b", tr): W(f"{where} \"or\" is written ولّا with shadda (ولا reads as wala)")
    if re.search(r"[تسكد](?:ها|هم)(?:\s|$|[؟!.،])", ar) and re.search(r"(?:[āaēīiūō][tsk]h(?:a|um)|ndh(?:a|um))\b", tr):
        W(f"{where} a suffix -ha/-hum/-ah after t/s/k/d/g needs a hyphen so it isn't read as a digraph (e.g. shrāt-ha)")
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
