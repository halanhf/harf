# tests for the row format in tools/lint_content.py (stage 1-2 rows may end with a vowelled form): python -m unittest discover -s tests -p "test_*.py"
import contextlib, importlib.util, io, sys, unittest
from pathlib import Path

root = Path(__file__).resolve().parent.parent
spec = importlib.util.spec_from_file_location("lint_content", root / "tools" / "lint_content.py")
lc = importlib.util.module_from_spec(spec)
spec.loader.exec_module(lc)

DIALOGUE = [["A", "السلام عليكم", "as-salāmu ʿalaykum", "Peace be upon you", "السَّلَامُ عَلَيْكُمْ"],
            ["B", "وعليكم السلام", "wa ʿalaykum is-salām", "And upon you peace", "وَعَلَيْكُمْ السَّلَامْ"],
            ["A", "شلونك؟", "shlōnak?", "How are you?", "شْلَوْنَكْ؟"]]
ITEMS = [[w, t, e, "", "", v] for w, t, e, v in [
    ("زين", "zēn", "good", "زَيْنْ"), ("شلونك", "shlōnak", "how are you", "شْلَوْنَكْ"), ("هلا", "hala", "hello", "هَلَا"),
    ("بيت", "bēt", "house", "بَيْتْ"), ("كتاب", "kitāb", "book", "كِتَابْ")]]

def unit(uid, stage, items=None, dialogue=None):
    return {"id": uid, "stage": stage, "title": "Greetings", "goal": "Greet people.", "tip": "Say it warmly.",
            "dialogue": DIALOGUE if dialogue is None else dialogue, "items": ITEMS if items is None else items}

def run(units_by_stage, stage):
    saved = lc.units_of, sys.argv
    lc.units_of = lambda n: [("fixture.json", u) for u in units_by_stage.get(n, [])]
    sys.argv = ["lint", str(stage)]
    out = io.StringIO()
    try:
        with contextlib.redirect_stdout(out):
            try: lc.main()
            except SystemExit: pass
    finally:
        lc.units_of, sys.argv = saved
    return out.getvalue()

class LintRows(unittest.TestCase):
    def test_vowelled_field_accepted_in_stage_1(self):
        self.assertNotIn("shape", run({1: [unit("u1", 1)]}, 1))

    def test_vowelled_field_refused_in_stage_3(self):
        out = run({3: [unit("s3u001", 3)]}, 3)
        self.assertIn("items[0] has a vowelled form outside stages 1-2", out)
        self.assertIn("dialogue[0] has a vowelled form outside stages 1-2", out)

    def test_consistency_sees_longer_rows(self):
        def u(uid, tr): return unit(uid, 1, items=[["زين", tr, "good", "", "", "زَيْنْ"]])
        warns = []
        saved = lc.units_of
        lc.units_of = lambda n: [("f.json", u("u1", "zēn")), ("f.json", u("u2", "zīn"))] if n == 1 else []
        try: lc.check_translit_consistency(None, warns)
        finally: lc.units_of = saved
        self.assertTrue(any("translit: زين" in w for w in warns), warns)

    def test_formula_check_sees_longer_lines(self):
        self.assertEqual(len(lc.formula_gaps([["A", "السلام عليكم", "as-salāmu ʿalaykum", "Hi", "السَّلَامُ عَلَيْكُمْ"]])), 1)

if __name__ == "__main__": unittest.main()
