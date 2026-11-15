# c1 item test helper: flags stage 5 items whose every word already appears in an earlier item
#   python3 tools/c1_check.py            all of stage 5
#   python3 tools/c1_check.py b04        one batch
# a word "appears" if its bare form (no al-/hal-, w-, b-, l-, f-, common endings) is in an earlier item, in any stage.
# it's a word-level check, not a root check: it can't see shared roots (bāṣir / baṣṣar), so a clean run still needs
# the root grep. a flagged item is either a re-teach (delete it, keep it in the dialogue) or a fixed idiom (say so in the log).
import json, re, sys
from pathlib import Path

root = Path(__file__).resolve().parent.parent
STRIP = re.compile(r"[ً-ْـّ؟!.,،:;\"'()…\-]")
PRE = ("وال", "بال", "فال", "لل", "ال", "هال", "و", "ب", "ل", "ف")
SUF = ("كم", "هم", "كن", "هن", "نا", "ها", "ه", "ك", "ج", "ي", "ين", "ون", "ات", "ة")
STOP = set("في من على عن مع ويا الى إلى لين ما مب مو لا يا هذا هذي هذيك ذاك اللي إن ان انه إنه كل شي بس و او أو ولا".split())

def bare(w):
    w = STRIP.sub("", w).replace("أ", "ا").replace("إ", "ا").replace("آ", "ا").replace("ى", "ي").replace("ة", "ه")
    for p in PRE:
        if w.startswith(p) and len(w) - len(p) >= 3: w = w[len(p):]; break
    for s in SUF:
        s = s.replace("ة", "ه")
        if w.endswith(s) and len(w) - len(s) >= 3: w = w[: -len(s)]; break
    return w

def words(ar): return [bare(w) for w in ar.split() if w and STRIP.sub("", w) not in STOP and len(bare(w)) >= 2]

def units(n):
    out = []
    f = root / "content" / f"stage{n}.json"
    if f.exists(): out += [("stage%d.json" % n, u) for u in json.loads(f.read_text(encoding="utf-8"))]
    for g in sorted((root / "content" / f"stage{n}").glob("*.json")):
        out += [(f"stage{n}/{g.name}", u) for u in json.loads(g.read_text(encoding="utf-8"))]
    return out

only = sys.argv[1] if len(sys.argv) > 1 else None
seen = {}  # bare word -> first unit id that had it in an item
order = [x for n in range(1, 6) for x in units(n)]
flags = 0
for src, u in order:
    for it in u.get("items", []):
        ws = words(it[0])
        if src.startswith("stage5") and (only is None or only in src) and ws and all(w in seen for w in ws):
            flags += 1
            print(f"{u['id']} {it[0]}: every word already taught ({', '.join(f'{w}<{seen[w]}' for w in ws)})")
        for w in ws: seen.setdefault(w, u["id"])
print(f"{flags} item(s) flagged")
