# graded readings helper: coverage of each reading against the words a learner has by its stage
#   python3 tools/reading_check.py            every reading
#   python3 tools/reading_check.py r3         one level (or one id: r3-04)
# "known" = fuṣḥā rows unlocked by the reading's stage (FRAMEWORK §13 batch table) + dialect items taught by that stage
# + a short list of function words. matching is crude (clitics and common endings stripped, vowels dropped), so the
# unknown list is for a person to judge: proper names, digits and glossed words are fine; anything else is a new word.
import json, re, sys
from pathlib import Path

root = Path(__file__).resolve().parent.parent
HAR = re.compile(r"[ً-ْٰـ]")
PUNCT = re.compile(r"[؟!.,،:;\"'()«»…\-–—/٪%]")
PRE = ("وبال", "وكال", "وال", "بال", "كال", "فال", "لل", "ال", "وس", "وب", "ول", "وك", "و", "ف", "ب", "ل", "ك", "س")
SUF = ("كما", "هما", "تها", "تهم", "ها", "هم", "هن", "كم", "كن", "نا", "ات", "ون", "ين", "ان", "وا", "ية", "ه", "ك", "ي", "ة", "ت", "ا")
FUNC = set("في من على عن مع الى إلى أن ان إن لا ما لم لن هو هي هم نحن أنا انت و أو او ثم كل بعض كان كانت يكون تكون قد هذا هذه ذلك تلك التي الذي الذين التي عند بين بعد قبل حتى إذا اذا كما لكن غير أي اي يا".split())

def norm(w):
    w = PUNCT.sub("", HAR.sub("", w))
    return w.replace("أ", "ا").replace("إ", "ا").replace("آ", "ا").replace("ى", "ي").replace("ؤ", "و").replace("ئ", "ي")

def forms(w):  # candidate bare forms of one word
    w = norm(w); out = {w}
    for p in PRE:
        if w.startswith(p) and len(w) - len(p) >= 2: out.add(w[len(p):])
    for x in list(out):
        for s in SUF:
            if x.endswith(s) and len(x) - len(s) >= 2: out.add(x[: -len(s)])
    for x in list(out):
        if x.endswith("ه"): out.add(x[:-1])  # ta marbuta written ه after norm? keep both
        out.add(x.replace("ة", "ه")); out.add(x.replace("ة", "ت"))
    return out

def load(p): return json.loads(p.read_text(encoding="utf-8")) if p.exists() else []
msa0 = load(root / "content" / "msa.json")
w1, w2, w3 = (load(root / "content" / "msa" / f"w{i}.json") for i in (1, 2, 3))
UNLOCK = {1: msa0 + w1[:106], 2: w1[106:], 3: w2[:250], 4: w2[250:] + w3[:150], 5: w3[150:]}

def dialect(n):
    out = []
    f = root / "content" / f"stage{n}.json"
    for u in load(f): out += u.get("items", [])
    for g in sorted((root / "content" / f"stage{n}").glob("*.json")):
        for u in load(g): out += u.get("items", [])
    return out

known = {}
acc = set(FUNC)
for n in range(1, 6):
    for r in UNLOCK[n]:
        for w in r[0].split(): acc |= forms(w)
    for it in dialect(n):
        for w in it[0].split(): acc |= forms(w)
        if len(it) > 3 and it[3]:
            for w in it[3].split(): acc |= forms(w)
    known[n] = set(acc)

def readings():
    out = load(root / "content" / "readings.json")
    for g in sorted((root / "content" / "readings").glob("*.json")): out += load(g)
    return out

only = sys.argv[1] if len(sys.argv) > 1 else None
for r in readings():
    if only and not r["id"].startswith(only): continue
    k = known[r["stage"]]
    toks = [w for l in r["lines"] for w in l[0].split() if norm(w) and not re.fullmatch(r"[0-9٠-٩]+", norm(w))]
    unk = [w for w in toks if not (forms(w) & k)]
    cov = 100 * (1 - len(unk) / max(1, len(toks)))
    vowelled = sum(1 for w in toks if HAR.search(w.replace("ّ", "")))
    print(f"{r['id']} stage {r['stage']} words {len(toks)} lines {len(r['lines'])} coverage {cov:.0f}% vowelled-words {vowelled}")
    if unk: print("   not in the learner's words: " + " ".join(dict.fromkeys(unk)))
