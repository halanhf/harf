# checks the vowelled forms (fading vowel marks) of the stage 1 and 2 lessons in content/. a vowelled form is the last element of an item or dialogue row.
#   python tools/harakat_check.py                    every stage 1-2 file; a file with no vowelled rows is "not started" (info, not a failure), a started file must be complete
#   python tools/harakat_check.py FILE...            those files only, every row vowelled and passing (the gate for a content batch)
#   python tools/harakat_check.py --all              every file, a file not started fails too
#   python tools/harakat_check.py --base REF [...]   also fails if a checked file changed anything but the added vowelled elements since git REF
#
# four checks per row (check_row):
#   strip    the form with its marks removed is the arabic field, and keeps every shadda the arabic field has. the arabic field is never edited
#   reading  the marks, read letter by letter, spell the transliteration: the form is split into words (whitespace and ، ؟ ! . … :) and each word into
#            clusters (a letter + the marks after it); the sounds are joined and must fullmatch translit_key(translit). a space or hyphen of the transliteration is a word break (_) that may fall between any two clusters
#            or words, but must fall between a word whose last letter carries fatha, kasra or damma and a following word that starts with an article alif: the article's vowel cannot sit on the word before it
#            (إِنْ شَاءْ اللّٰهْ, not شَاءَ اللّٰهْ). a w il-/min il- article i needs a real break before it, so وِالْ and بْالْ (bil-) are rejected
#   nfc      the form is in Unicode canonical order (unicodedata.normalize("NFC", s) leaves it unchanged): on one letter the vowel comes before the shadda (يَّ), then sukūn or dagger alif
#   vowels   every letter is fully vowelled (see "reading rules") and carries no mark it may not carry
#
# reading rules. marks: fatha a, kasra i, damma u, sukun nothing, tanwin an/in/un, dagger alif ā (replaces a fatha); exactly one of these per letter, and a
# shadda (doubled sound) needs one of them with it (shadda + sukun is the geminate before a consonant: يْسَلّْمَكْ ysallmak)
#   long vowels  a short-vowel mark followed by its bare carrier is one long vowel: fatha + bare ا or ى = ā, kasra + bare ي = ī, damma + bare و = ū.
#                with no sounded letter after it in the word, it may be read short (T4: ma, ana, hādha, ʿindi, fi)
#   bare letters that are read (anything else bare is a "missing mark" problem):
#     article alif (first letter, second after one proclitic و ب ف ك ل ه, or third after و/ف and a proclitic (وهالمرة), next letter ل bare or with sukun): reads (a|i|ā)? and takes no mark;
#       it wins over the long-vowel reading (وَاللّٰهْ wallāh, هَالْمُوبَايْلْ hal-mobāyl)
#       the vowel before it is not hidden: after a fatḥa, kasra or ḍamma on the proclitic or on the last letter of the word before, the alif adds no sound (وَاللّٰهْ wallāh, هَالتِّلِفَوْنْ, مَعَ السَّلَامَة);
#       after a sukūn it may add i, not a (وْالْبَيْتْ w il-bēt; وْاللّٰهْ is rejected). Unchanged: no letter before, a bare letter before, and the alif of الله after a sukūn in another word (شَاءْ اللّٰهْ)
#     article lām right after it, when the next letter has a shadda (sun letter): silent
#     ا after a letter with tanwin fatha, ا last in the word after و (رَاحَوْا), ة after a fatha, ه last in the word: silent
#     ء last in the word after a bare ا: silent, and that ا may then be read short (the day names ثَلَاثَاء thalātha, أَرْبَعَاء arbaʿa); a sounded final ء keeps its sukūn (مَسَاءْ masāʼ, شَاءْ shāʼ)
#     آ needs no mark: reads (ʼ)ā
#   an ا with a mark only carries its vowel (اِنْتَ inta); a ة with a mark is t (construct -at)
# tolerances, the complete list (anything else that does not match needs an entry in tools/harakat_allow.txt):
#   T1 ق g/j/q, ك k/ch, ج j/ch, ش sh/ch, ض ظ ẓ/ḍ    T2 hamza letters may be silent, آ is ā with an optional ʼ    T3 the article's vowel comes from the transliteration
#   T4 a word-final long-vowel letter may be read short    T5 ē = ay, ō = aw    T6 the loanword short o reads as ū    T7 spaces, hyphens, punctuation, capitals ignored
# a doubled consonant is read as the consonant twice (the two copies are not forced to be the same variant, ج + ch + j would pass). see content/STYLE.md section 14
import json, re, subprocess, sys, unicodedata
from pathlib import Path

root = Path(__file__).resolve().parent.parent
SCOPE = ["content/stage1.json", "content/stage1/*.json", "content/stage2/*.json"]
ALLOW = root / "tools" / "harakat_allow.txt"
ALLOW_SRC = "tools/harakat_allow.txt"

MARKS = re.compile("[ً-ْٰ]")
SHADDA, SUKUN, DAGGER = "ّ", "ْ", "ٰ"
VOW = {"َ": "a", "ِ": "i", "ُ": "u", SUKUN: "0", "ً": "an", "ٍ": "in", "ٌ": "un"}
SEP = re.compile(r"[\s،؟!.…:]+")
PROCLITICS = "وبفكله"
CARRIER = {"a": "اى", "i": "ي", "u": "و"}  # the bare letters that lengthen each short vowel
LONG = {"a": "ā", "i": "ī", "u": "ū"}
LONG_SHORT = {"a": "(?:a|ā)", "i": "(?:i|ī)", "u": "(?:u|ū)"}
SHORT = {"a": "a", "i": "i", "u": "u", "0": "", "an": "an", "in": "in", "un": "un", "d": "ā"}
HAMZA = "ءأإؤئ"
CONS = {"ب": "b", "ت": "t", "ث": "th", "ج": "(?:j|ch)", "ح": "ḥ", "خ": "kh", "د": "d", "ذ": "dh", "ر": "r", "ز": "z", "س": "s", "ش": "(?:sh|ch)",
        "ص": "ṣ", "ض": "(?:ẓ|ḍ)", "ط": "ṭ", "ظ": "(?:ẓ|ḍ)", "ع": "ʿ", "غ": "gh", "ف": "f", "ق": "(?:g|j|q)", "ك": "(?:k|ch)", "ل": "l", "م": "m",
        "ن": "n", "ه": "h", "و": "w", "ي": "y", "ة": "t"}
CONS.update({h: "ʼ?" for h in HAMZA})
CONS = {k: unicodedata.normalize("NFC", v) for k, v in CONS.items()}
ARTICLE = "(?:a|i|ā)?"
ARTICLE_AFTER_SUKUN = "(?:_(?:i|ā))?"  # the i sits after a real break: w il-bēt, min il-bēt, never bil-  # a sukūn says there is no a before the article (w il-, not wa)

def article_vowel(prev, own_word, allah):  # the reading of an article alif, given the cluster before it (the proclitic, or the last letter of the word before)
    # a fatḥa, kasra or ḍamma there is the vowel, so the alif adds none (wa-llāh, ha-ltilifōn, maʿa s-salāma); a sukūn lets it add i (w il-, min il-), not a.
    # kept as before: no letter before, a bare letter before (minu illi), and the alif of allāh after a sukūn in another word (shāʼ allāh, ḥayyāk allāh)
    if prev is None or prev[1] not in ("a", "i", "u", "0"): return ARTICLE
    if prev[1] != "0": return ""
    return ARTICLE if allah and not own_word else ARTICLE_AFTER_SUKUN

def strip_marks(s):
    return MARKS.sub("", s)

def shadda_letters(s):  # indexes, in strip_marks(s), of the letters a shadda follows
    out, n = [], 0
    for ch in s:
        if ch == SHADDA: out.append(n - 1)
        elif not MARKS.match(ch): n += 1
    return out

def check_strip(vow, ar):
    out = []
    if strip_marks(vow) != strip_marks(ar):
        out.append(f"strip: marks removed give {strip_marks(vow)}, the Arabic field is {strip_marks(ar)}")
    have, plain = set(shadda_letters(vow)), strip_marks(ar)
    for i in sorted(set(shadda_letters(ar)) - have):
        out.append(f"strip: the shadda on letter {i + 1} ({plain[i] if 0 <= i < len(plain) else '?'}) of the Arabic field is missing")
    return out

def translit_key(tr):
    t = unicodedata.normalize("NFC", tr.lower()).replace("'", "ʼ").replace("’", "ʼ")
    t = t.replace("ē", "ay").replace("ō", "aw").replace("o", "ū")
    t = re.sub(r"[,.?!;:…\"“”()]", "", t)
    return re.sub(r"[\s\-]+", "_", t).strip("_")  # a space or hyphen is a word break, kept as _

def clusters(word, probs):  # [(letter, vowel kind or None, shadda)]; vowel kind: a i u 0 an in un d(agger)
    out = []
    for ch in word:
        if MARKS.match(ch):
            if not out: probs.append(f"a mark with no letter before it in {word}"); continue
            out[-1][1].append(ch)
        elif "ء" <= ch <= "ي" and (ch in CONS or ch in "آاى"): out.append((ch, []))
        else: probs.append(f"{ch} is not a letter the table covers in {word}")
    res = []
    for ch, ms in out:
        vs = [VOW[m] for m in ms if m in VOW]
        sh = SHADDA in ms
        if DAGGER in ms:
            if vs not in ([], ["a"]): probs.append(f"{ch} has two vowel marks in {word}")
            v = "d"
        elif len(vs) > 1:
            probs.append(f"{ch} has two vowel marks in {word}"); v = vs[0]
        else: v = vs[0] if vs else None
        if sh and v is None: probs.append(f"the shadda on {ch} has no vowel or sukūn with it in {word}")
        res.append((ch, v, sh))
    return res

def read_word(word, probs, before=None):  # -> regex of one word; problems are appended to probs; before: the last cluster of the word before it (None after punctuation or at the start)
    cl = clusters(word, probs)
    n = len(cl)
    def art(j):  # is cl[j] an article alif (marked or not)?
        return (cl[j][0] == "ا" and (j == 0 or (j == 1 and cl[0][0] in PROCLITICS)
                                     or (j == 2 and cl[0][0] in "وف" and cl[1][0] in PROCLITICS)) and j + 1 < n
                and cl[j + 1][0] == "ل" and cl[j + 1][1] in (None, "0") and not cl[j + 1][2])
    out, i, after_long_a = [], 0, False  # out: (regex, sounded, long vowel kind)
    while i < n:
        ch, v, sh = cl[i]
        long_a, after_long_a = after_long_a, False
        if v is None and not sh:  # a bare letter
            prev = cl[i - 1] if i else None
            if ch == "آ": out.append(("ʼ?ā", True, None))
            elif ch == "ا" and art(i): out.append((article_vowel(cl[i - 1] if i else before, i > 0, i + 2 < n and cl[i + 2][1] == "d"), False, None))
            elif ch == "ل" and i and art(i - 1) and i + 1 < n and cl[i + 1][2]: pass  # article lām before a sun letter
            elif ch == "ا" and prev and prev[1] == "an": pass
            elif ch == "ا" and i == n - 1 and prev and prev[0] == "و": pass
            elif ch == "ة" and prev and (prev[1] == "a" or long_a): pass
            elif ch == "ه" and i == n - 1: pass
            elif ch == "ء" and i == n - 1 and prev and prev[0] == "ا" and prev[1] is None: pass  # a final ء after a bare ا is written, not said (ثَلَاثَاء thalātha)
            else: probs.append(f"{ch} has no vowel mark in {word}")
            i += 1; continue
        if ch == "آ" or ch == "ى":
            probs.append(f"{ch} takes no mark in {word}"); i += 1; continue
        if ch == "ا" and art(i): probs.append(f"the article alif takes no mark in {word}")
        if ch == "ا" and (v == "0" or sh): probs.append(f"the alif takes no sukūn or shadda in {word}")
        if ch == "ا" and v in ("an", "in", "un"): probs.append(f"tanwīn goes on the letter before the alif, the alif stays bare (V15) in {word}")
        c = "" if ch == "ا" else CONS[ch]
        if sh: c = c + "_?" + c  # a break may fall inside a sun-letter doubling (is-salām)
        nxt = cl[i + 1] if i + 1 < n else None
        if (v in LONG and nxt and nxt[1] is None and not nxt[2] and nxt[0] in CARRIER[v] and not art(i + 1)):
            out.append((c, True, None)); out.append(("", False, v))
            after_long_a = v == "a" and nxt[0] == "ا"; i += 2; continue
        out.append((c + SHORT.get(v, ""), True, None)); i += 1
    parts = []
    for k, (r, sounded, lv) in enumerate(out):
        if lv: parts[-1] += LONG[lv] if any(o[1] for o in out[k + 1:]) else LONG_SHORT[lv]
        else: parts.append(r)
    return "_?".join(x for x in parts if x)  # a word break in the transliteration may fall between any two clusters

def reading(vow):  # (regex, problems)
    probs, rx, before, last = [], "", None, None
    for k, w in enumerate(re.split(r"([\s،؟!.…:]+)", vow)):
        if k % 2: before = before if w.isspace() else None  # a separator with punctuation in it ends the connection to the next word
        elif w:
            cl = clusters(w, [])
            if rx:  # words are joined by a break that may be absent, but must be there when a vowelled letter meets an article alif
                starts_article = len(cl) > 1 and cl[0][0] == "ا" and cl[0][1] is None and cl[1][0] == "ل"
                rx += "_" if (starts_article and last and last[1] in ("a", "i", "u")) else "_?"
            rx += read_word(w, probs, before)
            before = last = cl[-1] if cl else None
    return unicodedata.normalize("NFC", rx), probs

def check_row(ar, tr, vow, allowed=False):
    out = check_strip(vow, ar)
    if unicodedata.normalize("NFC", vow) != vow: out.append("nfc: the marks are not in canonical order (the vowel before the shadda, then sukūn); NFC order is the one order used everywhere")
    rx, probs = reading(vow)
    out += [f"vowels: {p}" for p in probs]
    ok = re.fullmatch(rx, translit_key(tr)) is not None
    if not allowed and not ok:
        out.append(f'reading: translit {translit_key(tr)} / marks read {rx.replace("(?:", "(").replace("_?", "")}')
    if allowed and ok:
        out.append("reading: allowlisted but passes")
    return out

def rows_of(units):  # (unit id, where, ar, tr, vowelled or None): items first, then dialogue, in file order
    out = []
    for u in units:
        for i, it in enumerate(u["items"]):
            out.append((u["id"], f"items[{i}]", it[0], it[1], it[5] if len(it) > 5 else None))
        for i, d in enumerate(u["dialogue"]):
            out.append((u["id"], f"dialogue[{i}]", d[1], d[2], d[4] if len(d) > 4 else None))
    return out

def check_units(src, units, require_all, allow):  # (failures, vowelled rows, total rows); a failure is "<unit> <where> <message>"
    rows = rows_of(units)
    done = sum(r[4] is not None for r in rows)
    if not done and not require_all: return [], 0, len(rows)
    fails = []
    for uid, where, ar, tr, vow in rows:
        if vow is None: fails.append(f"{uid} {where} not vowelled"); continue
        if not isinstance(vow, str): fails.append(f"{uid} {where} the vowelled form is not a string"); continue
        fails += [f"{uid} {where} {m}" for m in check_row(ar, tr, vow, (uid, where) in allow)]
    return fails, done, len(rows)

def unknown_allow(allow, rows):  # allowlist entries that name a row no checked file has
    have = {(r[0], r[1]) for r in rows}
    return [f"{u} {w} allowlist entry for a row that does not exist" for (u, w) in allow if (u, w) not in have]

def compare_base(src, old_units, new_units):  # what a content batch may change: nothing but an added last element
    oid, nid = [u["id"] for u in old_units], [u["id"] for u in new_units]
    if oid != nid: return [f"- units: the unit id list differs from the base ({len(oid)} units there, {len(nid)} now)"]
    out = []
    for o, n in zip(old_units, new_units):
        for key, width, label in (("items", 5, "item"), ("dialogue", 4, "dialogue line")):
            if len(o[key]) != len(n[key]):
                out.append(f"{o['id']} {key} base: {len(o[key])} {label}s before, {len(n[key])} now"); continue
            for i, (a, b) in enumerate(zip(o[key], n[key])):
                if a[:width] != b[:width]: out.append(f"{o['id']} {key}[{i}] base: fields 0-{width - 1} of the {label} changed")
    return out

def load_allow(path):  # ({(unit id, where): reason}, problems)
    allow, probs = {}, []
    if not path.exists(): return allow, probs
    for n, line in enumerate(path.read_text(encoding="utf-8").splitlines(), 1):
        if not line.strip() or line.lstrip().startswith("#"): continue
        m = re.fullmatch(r"(\S+) ((?:items|dialogue)\[\d+\]) \| (.*)", line.strip())
        if not m: probs.append(f"line {n}: not '<unit id> <items[i]|dialogue[i]> | <reason>'"); continue
        uid, where, why = m.group(1), m.group(2), m.group(3).strip()
        if len(why) < 15: probs.append(f"line {n}: the reason for {uid} {where} is under 15 characters")
        if (uid, where) in allow: probs.append(f"line {n}: {uid} {where} is listed twice")
        allow[(uid, where)] = why
    return allow, probs

def scope_files():
    out = []
    for pat in SCOPE:
        out += sorted(root.glob(pat), key=lambda p: p.name)
    return out

def src_of(p):
    return p.resolve().relative_to(root).as_posix()

def load_base(ref, src):  # the file's units at git REF, or None
    r = subprocess.run(["git", "show", f"{ref}:{src}"], cwd=root, capture_output=True)
    return json.loads(r.stdout.decode("utf-8")) if r.returncode == 0 else None

def main(argv):
    if hasattr(sys.stdout, "reconfigure"): sys.stdout.reconfigure(encoding="utf-8")
    every, base, files, i = False, None, [], 0
    while i < len(argv):
        a = argv[i]
        if a == "--all": every = True
        elif a == "--base" and i + 1 < len(argv): base = argv[i + 1]; i += 1
        elif a.startswith("--"): print(f"unknown option {a}"); return 2
        else: files.append(a)
        i += 1
    scope = scope_files()
    chosen = scope
    if files and not every:
        chosen, known = [], {p.resolve() for p in scope}
        for a in files:
            p = Path(a)
            if not p.is_absolute() and (root / p).exists(): p = root / p
            if p.resolve() not in known: print(f"{a} is not a stage 1 or 2 content file"); return 2
            chosen.append(p.resolve())
    require_all = every or bool(files)
    allow, allow_probs = load_allow(ALLOW)
    fails = [f"FAIL {ALLOW_SRC} - {p}" for p in allow_probs]
    infos, rows_n, vow_n, used = [], 0, 0, 0
    every_rows = []
    for p in scope:
        every_rows += rows_of(json.loads(p.read_text(encoding="utf-8")))
    fails += [f"FAIL {ALLOW_SRC} {m}" for m in unknown_allow(allow, every_rows)]
    for p in chosen:
        src = src_of(Path(p))
        units = json.loads(Path(p).read_text(encoding="utf-8"))
        f, v, t = check_units(src, units, require_all, allow)
        fails += [f"FAIL {src} {m}" for m in f]
        rows_n += t; vow_n += v
        if v == 0 and not require_all: infos.append(f"info {src}: not started (0 of {t} rows)")
        if v: used += sum((r[0], r[1]) in allow for r in rows_of(units))
        if base:
            old = load_base(base, src)
            if old is None: fails.append(f"FAIL {src} - cannot read the file at {base}")
            else: fails += [f"FAIL {src} {m}" for m in compare_base(src, old, units)]
    print("\n".join(fails + infos + [f"{rows_n} rows checked, {vow_n} vowelled, {len(fails)} failures, {used} allowlisted"]))
    return 1 if fails else 0

if __name__ == "__main__":
    sys.exit(main(sys.argv[1:]))
