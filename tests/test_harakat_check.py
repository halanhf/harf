# tests for tools/harakat_check.py (the vowelled forms of stages 1 and 2): python -m unittest discover -s tests -p "test_*.py"
import importlib.util, tempfile, unittest
from pathlib import Path

root = Path(__file__).resolve().parent.parent
spec = importlib.util.spec_from_file_location("harakat_check", root / "tools" / "harakat_check.py")
hc = importlib.util.module_from_spec(spec)
spec.loader.exec_module(hc)

GOOD = [  # (unit, ar, translit, vowelled) - all must give check_row(...) == []
    ("u1",     "شلونك؟", "shlōnak?", "شْلَوْنَكْ؟"),
    ("u1",     "وعليكم السلام، هلا والله", "wa ʿalaykum is-salām, hala wallāh", "وَعَلَيْكُمْ السَّلَامْ، هَلَا وَاللّٰهْ"),
    ("u1",     "الحمد لله", "il-ḥamdu lillāh", "الْحَمْدُ لِلّٰهْ"),
    ("u1",     "السلام عليكم", "as-salāmu ʿalaykum", "السَّلَامُ عَلَيْكُمْ"),
    ("u1",     "زين، الحمد لله. وانت شلونك؟", "zēn, il-ḥamdu lillāh. w inta shlōnak?", "زَيْنْ، الْحَمْدُ لِلّٰهْ. وْاِنْتَ شْلَوْنَكْ؟"),
    ("s1u025", "ريّال", "rayyāl", "رَيَّالْ"),
    ("s1u025", "سيارة أبوي", "sayyārat ubūy", "سَيَّارَةْ أُبُويْ"),
    ("s1u028", "والشقة؟ كبيرة ولّا صغيرة؟", "w ish-shigga? kbīra walla ṣghīra?", "وْالشِّقَّة؟ كْبِيرَة وَلَّا صْغِيرَة؟"),
    ("s1u030", "شو رأيك؟ هذا القميص ولّا هذاك؟", "shu raʼyak? hādha l-gamīṣ walla hādhāk?", "شُو رَأْيَكْ؟ هٰذَا الْقَمِيصْ وَلَّا هٰذَاكْ؟"),
    ("s1u038", "صباح النور. وصلوا الصبح وراحوا الاجتماع", "ṣabāḥ in-nūr. wiṣlaw iṣ-ṣubḥ w rāḥaw il-ijtimāʿ", "صَبَاحْ النُّورْ. وِصْلَوْا الصُّبْحْ وْرَاحَوْا الْاِجْتِمَاعْ"),
    ("s1u061", "لو سمحت، وين محطة المترو؟", "law samaḥt, wēn maḥaṭṭat il-mitrō?", "لَوْ سَمَحْتْ، وَيْنْ مَحَطَّةْ الْمِتْرَوْ؟"),
    ("u10",    "الله يحييك. ما شاء الله، البيت وايد حلو", "allāh yḥayyīk. mā shāʼ allāh, il-bēt wāyid ḥilu", "اللّٰهْ يْحَيِّيكْ. مَا شَاءْ اللّٰهْ، الْبَيْتْ وَايِدْ حِلُو"),
    ("s2u025", "موبايل", "mobāyl", "مُوبَايْلْ"),
    ("s2u040", "تقريبا", "tagrīban", "تَقْرِيبًا"),
    ("s2u057", "قبل الأكل ولّا بعد الأكل؟", "gabil il-akil walla baʿd il-akil?", "قَبِلْ الْأَكِلْ وَلَّا بَعْدْ الْأَكِلْ؟"),
    ("s2u058", "الله يسلمك. الريّال الثاني تعور شوي في إيده", "allāh ysallmak. ir-rayyāl ith-thāni tʿawwar shwayy fi īdah", "اللّٰهْ يْسَلّْمَكْ. الرَّيَّالْ الثَّانِي تْعَوَّرْ شْوَيّْ فِي إِيدَهْ"),
    ("s2u089", "ليش ما قلتي لي؟", "lēsh ma giltī-li?", "لَيْشْ مَا قِلْتِي لِي؟"),
    ("s1u038", "آسف! راحوا من زمان؟", "āsif! rāḥaw min zamān?", "آسِفْ! رَاحَوْا مِنْ زَمَانْ؟"),
    ("-",      "هيه", "hē", "هَيْه"),
]

def has(msgs, prefix, text=""):
    return any(m.startswith(prefix) and text in m for m in msgs)

class Checker(unittest.TestCase):
    def test_good_rows_pass(self):
        for unit, ar, tr, vow in GOOD:
            with self.subTest(unit=unit, ar=ar):
                self.assertEqual(hc.check_row(ar, tr, vow), [])

    def test_strip_keeps_existing_shadda(self):
        self.assertEqual(hc.check_strip("رَيَّالْ", "ريّال"), [])
        self.assertNotEqual(hc.check_strip("رَيَالْ", "ريّال"), [])
        self.assertEqual(hc.check_strip("وَلَّا", "ولّا"), [])
        self.assertEqual(hc.check_strip("رَيَّالْ", "ريال"), [])

    def test_strip_catches_changed_letter(self):
        self.assertNotEqual(hc.check_strip("شْلَوْنَجْ؟", "شلونك؟"), [])
        self.assertNotEqual(hc.check_strip("أَنْتَ", "انت"), [])

    def test_catches_u_for_o(self):
        self.assertTrue(has(hc.check_row("شلونك؟", "shlōnak?", "شْلُونَكْ؟"), "reading:"))

    def test_catches_wrong_vowels(self):
        self.assertTrue(has(hc.check_row("زين", "zēn", "زِينْ"), "reading:"))
        r = hc.check_row("ريّال", "rayyāl", "رَيَالْ")
        self.assertTrue(has(r, "strip:") and has(r, "reading:"))
        self.assertTrue(has(hc.check_row("بيته", "bētah", "بَيْتَه"), "reading:"))
        self.assertTrue(has(hc.check_row("كبيرة", "kbīra", "كْبِرَة"), "strip:"))
        self.assertTrue(has(hc.check_row("كبيرة", "kbira", "كْبِيرَة"), "reading:"))

    def test_reports_missing_marks(self):
        self.assertTrue(has(hc.check_row("شلونك؟", "shlōnak?", "شلَوْنَكْ؟"), "vowels:", "ش"))
        self.assertTrue(has(hc.check_row("ريّال", "rayyāl", "رَيّالْ"), "vowels:"))
        self.assertTrue(has(hc.check_row("الحين", "il-ḥīn", "اَلْحِينْ"), "vowels:", "the article alif takes no mark"))

    def test_silent_letters_and_tolerances(self):
        for ar, tr, vow in [("يمه", "yumma", "يُمَّه"), ("الحينه", "il-ḥīna", "الْحِينَه"), ("ما في", "ma fī", "مَا فِي"),
                            ("الفيديو", "il-fīdyo", "الْفِيدْيُو"), ("هالموبايل", "hal-mobāyl", "هَالْمُوبَايْلْ"),
                            ("شاي", "chāy", "شَايْ"), ("قدام", "jiddām", "قِدَّامْ")]:
            with self.subTest(ar=ar):
                self.assertEqual(hc.check_row(ar, tr, vow), [])

    def test_translit_key(self):
        self.assertEqual(hc.translit_key("w il-Kwēt, ōkē?"), "w_il_kwayt_awkay")  # word breaks stay, as _
        self.assertEqual(hc.translit_key("il-fīdyo"), "il_fīdyū")

    def test_strip_and_shadda_helpers(self):
        self.assertEqual(hc.strip_marks("رَيَّالْ"), "ريال")
        self.assertEqual(hc.strip_marks("هٰذَا"), "هذا")
        self.assertEqual(hc.strip_marks("كـتاب"), "كـتاب")  # tatweel stays
        self.assertEqual(hc.shadda_letters("ريّال"), [1])
        self.assertEqual(hc.shadda_letters("رَيَّالْ"), [1])

    def test_rows_of(self):
        u = {"id": "x", "items": [["a", "b", "c", "d", "e"]], "dialogue": [["A", "ar", "tr", "en"]]}
        self.assertEqual(hc.rows_of([u]), [("x", "items[0]", "a", "b", None), ("x", "dialogue[0]", "ar", "tr", None)])
        u["items"][0].append("v1"); u["dialogue"][0].append("v2")
        self.assertEqual([r[4] for r in hc.rows_of([u])], ["v1", "v2"])

    def test_check_units_modes(self):
        item = lambda v=None: ["زين", "zēn", "fine", "", ""] + ([v] if v else [])
        u = {"id": "u", "items": [item("زَيْنْ"), item()], "dialogue": []}
        self.assertNotEqual(hc.check_units("x", [u], False, {})[0], [])
        u0 = {"id": "u", "items": [item(), item()], "dialogue": []}
        self.assertEqual(hc.check_units("x", [u0], False, {}), ([], 0, 2))
        self.assertNotEqual(hc.check_units("x", [u0], True, {})[0], [])

    def test_allowlist(self):
        with tempfile.TemporaryDirectory() as d:
            p = Path(d) / "allow.txt"
            p.write_text("# c\n\ns1u017 items[0] | short\n", encoding="utf-8")
            allow, problems = hc.load_allow(p)
            self.assertTrue(problems)
            p.write_text("u items[0] | the marks cannot show this sound\nu items[1] | the marks cannot show this sound\n", encoding="utf-8")
            allow, problems = hc.load_allow(p)
            self.assertEqual((problems, set(allow)), ([], {("u", "items[0]"), ("u", "items[1]")}))
            p.write_text("garbage line\n", encoding="utf-8")
            self.assertTrue(hc.load_allow(p)[1])
        passing = ["زين", "zēn", "fine", "", "", "زَيْنْ"]
        bad = ["زين", "zēn", "fine", "", "", "زِينْ"]
        badstrip = ["زين", "zēn", "fine", "", "", "رِينْ"]
        u = {"id": "u", "items": [passing, bad, badstrip], "dialogue": []}
        why = "a reason long enough"
        al = {("u", "items[0]"): why, ("u", "items[1]"): why, ("u", "items[2]"): why}
        fails, voc, tot = hc.check_units("x", [u], True, al)
        self.assertTrue(any("allowlisted but passes" in f and "items[0]" in f for f in fails))
        self.assertFalse(any("items[1]" in f for f in fails))
        self.assertTrue(any("items[2]" in f and "strip:" in f for f in fails))
        self.assertFalse(any("items[2]" in f and "reading:" in f for f in fails))
        self.assertTrue(hc.unknown_allow({("u", "items[9]"): why, ("u", "items[0]"): why}, hc.rows_of([u])) == ["u items[9] allowlist entry for a row that does not exist"])

    def test_compare_base(self):
        def mk(v=True):
            it = lambda: ["زين", "zēn", "fine", "", "n"] + (["زَيْنْ"] if v else [])
            dl = lambda s: [s, "زين", "zēn", "fine"] + (["زَيْنْ"] if v else [])
            return [{"id": "u", "items": [it(), it()], "dialogue": [dl("A"), dl("B")]}]
        old = mk(False)
        self.assertEqual(hc.compare_base("x", old, mk(True)), [])
        new = mk(True); new[0]["items"][0][1] = "zayn"
        self.assertTrue(hc.compare_base("x", old, new))
        new = mk(True); del new[0]["items"][1]
        self.assertTrue(hc.compare_base("x", old, new))
        new = mk(True); new[0]["dialogue"].reverse()
        self.assertTrue(hc.compare_base("x", old, new))
        new = mk(True); new[0]["id"] = "v"
        self.assertTrue(hc.compare_base("x", old, new))

    # rule decisions forced by real rows of content/stage1*.json and stage2/*.json (see the task 1 report)
    def test_decision_silent_tah_after_long_a(self):  # s2u020 items[3] المباراة il-mubārā: the ة follows the carrier alif of ā, not a fatḥa
        self.assertEqual(hc.check_row("المباراة", "il-mubārā", "الْمُبَارَاة"), [])
        self.assertTrue(has(hc.check_row("المباراة", "il-mubārā", "الْمُبَارِاة"), "vowels:"))  # kasra then ا is not a long vowel, so the ة is still unreadable
        self.assertTrue(has(hc.check_row("المباراة", "il-mubārā", "الْمُبَارَاةْ"), "reading:"))  # ة with sukūn is t

    def test_decision_article_alif_wins_over_long_a(self):  # u1 والله, s1u031 هالشي: fatḥa + ا + ل is the article, not ā
        self.assertEqual(hc.check_row("والله", "wallāh", "وَاللّٰهْ"), [])
        self.assertEqual(hc.check_row("هالشي", "hash-shay", "هَالشَّيْ"), [])
        self.assertEqual(hc.check_row("طالب", "ṭālib", "طَالِبْ"), [])  # ط is no proclitic, so this ا is the long vowel

    def test_decision_both_spellings_of_illi(self):  # s2u046 items[0] اللي illi (49 rows), s2u029 اللحين illaḥīn
        self.assertEqual(hc.check_row("اللي", "illi", "اللِّي"), [])  # article alif, silent lām before the geminate lām: reads (i)ll(i)
        self.assertEqual(hc.check_row("اللحين", "illaḥīn", "اللَّحِينْ"), [])
        self.assertTrue(has(hc.check_row("اللي", "illi", "اِلْلِي"), "vowels:", "article alif"))  # a marked alif before ل with sukūn is read as the article

    def test_decision_real_rows_with_silent_and_carrier_letters(self):
        for ar, tr, vow in [("تفضلوا", "tfaẓẓalu", "تْفَضَّلُوا"), ("راحوا", "rāḥaw", "رَاحَوْا"), ("هو", "huwa", "هُوَ"), ("ألو", "alō", "أَلَوْ"),
                            ("سؤال", "suʼāl", "سُؤَالْ"), ("مفاجأة", "mufājaʼa", "مُفَاجَأَة"), ("دوا", "dawa", "دَوَا"), ("ثانية", "thānya", "ثَانْيَة"),
                            ("اللي عندنا", "illi ʿindana", "اللِّي عِنْدَنَا"), ("اتفقنا", "ittafagna", "اِتَّفَقْنَا"), ("على", "ʿala", "عَلَى"),
                            ("في الطريق", "fi ṭ-ṭarīg", "فِي الطَّرِيقْ"), ("مع السلامة", "maʿa s-salāma", "مَعَ السَّلَامَة"), ("بالعافية", "bil-ʿāfya", "بِالْعَافْيَة")]:
            with self.subTest(ar=ar):
                self.assertEqual(hc.check_row(ar, tr, vow), [])

    def test_vowel_problems_do_not_hide_the_reading(self):  # both messages are reported: the reading is compared even when a letter is unmarked
        r = hc.check_row("شلونك؟", "shlōnak?", "شلَوْنَكْ؟")
        self.assertTrue(has(r, "vowels:") and has(r, "reading:"))

    # hardening round (review of task 1)
    def test_article_alif_after_two_proclitics(self):  # s1u031 dialogue[3] وهالمرة w hal-marra
        self.assertEqual(hc.check_row("وهالمرة", "w hal-marra", "وْهَالْمَرَّة"), [])
        self.assertEqual(hc.check_row("والله؟ وهالمرة شو تبي؟", "wallāh? w hal-marra shu tabi?", "وَاللّٰهْ؟ وْهَالْمَرَّة شُو تَبِي؟"), [])
        # real words where و or ف is followed by a proclitic and ا but no article stay ā: s1u056 ولازم, s2u037 وكان, s1u058 فواكه
        self.assertEqual(hc.check_row("ولازم", "w lāzim", "وْلَازِمْ"), [])
        self.assertEqual(hc.check_row("وكان", "w kān", "وْكَانْ"), [])
        self.assertEqual(hc.check_row("فواكه", "fawākih", "فَوَاكِهْ"), [])
        # the ل must still be bare or carry sukūn: وَالِد is wālid, not an article
        self.assertEqual(hc.check_row("والد", "wālid", "وَالِدْ"), [])
        self.assertEqual(hc.check_row("وبالله", "w billāh", "وْبِاللّٰهْ"), [])

    def test_alif_takes_no_sukun_or_shadda(self):
        for ar, tr, bad, good in [("ما", "ma", "مَاْ", "مَا"), ("أنا", "ana", "أَنَاْ", "أَنَا")]:
            self.assertTrue(has(hc.check_row(ar, tr, bad), "vowels:"), bad)
            self.assertEqual(hc.check_row(ar, tr, good), [])
        self.assertTrue(has(hc.check_row("ما", "ma", "مَاّْ"), "vowels:"))

    def test_tanwin_goes_on_the_letter_before_the_alif(self):  # V15
        r = hc.check_row("تقريبا", "tagrīban", "تَقْرِيبَاً")
        self.assertTrue(has(r, "vowels:", "tanwīn"))
        self.assertTrue(has(r, "vowels:", "V15"))
        self.assertEqual(hc.check_row("تقريبا", "tagrīban", "تَقْرِيبًا"), [])

    # content fix wave A: the vowel before an article must agree with the transliteration
    def test_vowel_before_article_must_agree(self):
        rows = [("لا والله", "la wallāh", "لَا وْاللّٰهْ", "لَا وَاللّٰهْ"),   # s2u014: sukūn where wa belongs
                ("هالتلفون", "hat-tilifōn", "هْالتِّلِفَوْنْ", "هَالتِّلِفَوْنْ"),  # s2u025
                ("هالموبايل", "hal-mobāyl", "هْالْمُوبَايْلْ", "هَالْمُوبَايْلْ"),
                ("مشكورة. مع السلامة", "mashkūra. maʿa s-salāma", "مَشْكُورَة. مَعْ السَّلَامَة", "مَشْكُورَة. مَعَ السَّلَامَة")]  # s2u022
        for ar, tr, bad, good in rows:
            with self.subTest(ar=ar):
                self.assertTrue(has(hc.check_row(ar, tr, bad), "reading:"), bad)
                self.assertEqual(hc.check_row(ar, tr, good), [])
        # no vowel before the article needs sukūn: w il-bēt, w ish-shigga, min il-bēt
        self.assertEqual(hc.check_row("والبيت", "w il-bēt", "وْالْبَيْتْ"), [])
        self.assertTrue(has(hc.check_row("والبيت", "w il-bēt", "وَالْبَيْتْ"), "reading:"))
        self.assertEqual(hc.check_row("من البيت", "min il-bēt", "مِنْ الْبَيْتْ"), [])
        self.assertEqual(hc.check_row("في البيت", "fi l-bēt", "فِي الْبَيْتْ"), [])

    # content fix wave B: a written but silent final hamza
    def test_silent_final_hamza_after_alif(self):  # the day names thalātha / arbaʿa (s1u045, s1u047, s1u054)
        for ar, tr, vow in [("يوم الثلاثاء", "yōm ith-thalātha", "يَوْمْ الثَّلَاثَاء"),
                            ("يوم الأربعاء", "yōm il-arbaʿa", "يَوْمْ الْأَرْبَعَاء"),
                            ("ثلاثاء", "thalātha", "ثَلَاثَاء"), ("أربعاء", "arbaʿa", "أَرْبَعَاء")]:
            with self.subTest(vow=vow):
                self.assertEqual(hc.check_row(ar, tr, vow), [])
        # the sukūn form says the hamza is sounded, which the transliteration does not
        self.assertTrue(has(hc.check_row("ثلاثاء", "thalātha", "ثَلَاثَاءْ"), "reading:"))

    def test_sounded_final_hamza_still_needs_its_mark_and_is_read(self):  # masāʼ (s2u034), shāʼ (u10), ʼ after a non-alif letter
        self.assertEqual(hc.check_row("مساء الخير", "masāʼ il-khēr", "مَسَاءْ الْخَيْرْ"), [])
        self.assertEqual(hc.check_row("ما شاء الله", "mā shāʼ allāh", "مَا شَاءْ اللّٰهْ"), [])
        r = hc.check_row("مساء الخير", "masāʼ il-khēr", "مَسَاء الْخَيْرْ")  # bare ء would be silent: the marks read masā, not masāʼ
        self.assertTrue(has(r, "reading:"))
        self.assertTrue(has(hc.check_row("ما شاء الله", "mā shāʼ allāh", "مَا شَاء اللّٰهْ"), "reading:"))
        self.assertTrue(has(hc.check_row("جزء", "juzʼ", "جُزْء"), "vowels:", "ء has no vowel mark"))  # not after an alif: still unmarked

    # content fix wave D: one mark order (Unicode canonical, what NFC gives)
    def test_marks_must_be_in_canonical_order(self):  # رَيَّالْ rayyāl: the vowel comes before the shadda
        old, canon = "رَيَّالْ", "رَيَّالْ"
        self.assertNotEqual(old, canon)
        r = hc.check_row("ريّال", "rayyāl", old)
        self.assertEqual(len(r), 1)
        self.assertTrue(r[0].startswith("nfc:"), r)
        self.assertEqual(hc.check_row("ريّال", "rayyāl", canon), [])
        self.assertTrue(has(hc.check_row("ريّال", "rayyāl", old, allowed=True), "nfc:"))  # an allowlist entry exempts the reading only

    # final fix wave, item 2: the vowel of an article cannot move onto the word before it; V8 for the proclitics
    def test_vowel_cannot_move_across_a_word_boundary(self):
        pairs = [("إِنْ شَاءَ اللّٰهْ", "in shāʼ allāh", "إِنْ شَاءْ اللّٰهْ"), ("حَيَّاكَ اللّٰهْ", "ḥayyāk allāh", "حَيَّاكْ اللّٰهْ"),
                 ("صَبَاحِ الْخَيْرْ", "ṣabāḥ il-khēr", "صَبَاحْ الْخَيْرْ"), ("يَوْمِ الْخَمِيسْ", "yōm il-khamīs", "يَوْمْ الْخَمِيسْ"),
                 ("وَعَلَيْكُمِ السَّلَامْ", "wa ʿalaykum is-salām", "وَعَلَيْكُمْ السَّلَامْ"), ("مِنِ الشَّبَكَة", "min ish-shabaka", "مِنْ الشَّبَكَة"),
                 ("زَيْنِ، الْحِينْ", "zēn, il-ḥīn", "زَيْنْ، الْحِينْ"), ("هَيِه النَّاسْ", "hē in-nās", "هَيْه النَّاسْ"),
                 ("وِصْلَوِا الصُّبْحْ", "wiṣlaw iṣ-ṣubḥ", "وِصْلَوْا الصُّبْحْ"), ("أَنَاِ اللِّي", "ana illi", "أَنَا اللِّي"),
                 ("يَلَّاِ، الْحِينْ", "yalla, il-ḥīn", "يَلَّا، الْحِينْ")]
        for bad, tr, good in pairs:
            with self.subTest(bad=bad):
                self.assertTrue(has(hc.check_row(hc.strip_marks(bad), tr, bad), "reading:"), bad)
                self.assertEqual(hc.check_row(hc.strip_marks(good), tr, good), [], good)
        # the right vowels on the letter before still pass: the five real maʿa s-salāma rows, fi l-bēt, wa il-
        for vow, tr in [("مَعَ السَّلَامَة", "maʿa s-salāma"), ("فِي الْبَيْتْ", "fi l-bēt"), ("هَالتِّلِفَوْنْ", "hat-tilifōn"), ("وَاللّٰهْ", "wallāh")]:
            self.assertEqual(hc.check_row(hc.strip_marks(vow), tr, vow), [], vow)

    def test_proclitic_marks_follow_v8(self):  # w il-: و takes sukūn; bil-: ب takes kasra
        self.assertTrue(has(hc.check_row("والبيت", "w il-bēt", "وِالْبَيْتْ"), "reading:"))
        self.assertEqual(hc.check_row("والبيت", "w il-bēt", "وْالْبَيْتْ"), [])
        self.assertTrue(has(hc.check_row("بالعربي", "bil-ʿarabi", "بْالْعَرَبِي"), "reading:"))
        self.assertEqual(hc.check_row("بالعربي", "bil-ʿarabi", "بِالْعَرَبِي"), [])


class Cli(unittest.TestCase):  # main() on a throwaway repo layout, so these do not depend on how much of the real course is vowelled
    def setUp(self):
        import json
        self.tmp = tempfile.TemporaryDirectory()
        r = Path(self.tmp.name)
        (r / "content" / "stage1").mkdir(parents=True); (r / "content" / "stage2").mkdir(); (r / "content" / "stage3").mkdir(); (r / "tools").mkdir()
        row = lambda v=None: ["زين", "zēn", "fine", "", ""] + ([v] if v else [])
        unit = lambda uid, *rows: {"id": uid, "items": list(rows), "dialogue": []}
        dump = lambda path, units: (r / path).write_text(json.dumps(units, ensure_ascii=False), encoding="utf-8")
        dump("content/stage1.json", [unit("a1", row(), row())])  # not started
        dump("content/stage1/b01.json", [unit("b1", row("زَيْنْ"), row("زَيْنْ"))])  # started and complete
        dump("content/stage2/b01.json", [unit("c1", row("زَيْنْ"), row("زِينْ"))])  # started, one row reads wrong
        dump("content/stage3/b01.json", [unit("d1", row())])
        self.old = (hc.root, hc.ALLOW)
        hc.root, hc.ALLOW = r, r / "tools" / "harakat_allow.txt"

    def tearDown(self):
        hc.root, hc.ALLOW = self.old
        self.tmp.cleanup()

    def run_main(self, *argv):
        import contextlib, io
        buf = io.StringIO()
        with contextlib.redirect_stdout(buf): code = hc.main(list(argv))
        return code, buf.getvalue()

    def test_default_run_reports_unstarted_files_and_fails_started_ones(self):
        code, out = self.run_main()
        self.assertEqual(code, 1)
        self.assertIn("info content/stage1.json: not started (0 of 2 rows)", out)
        self.assertIn("FAIL content/stage2/b01.json c1 items[1] reading: translit zayn / marks read zīn", out)
        self.assertNotIn("FAIL content/stage1/b01.json", out)
        self.assertTrue(out.rstrip().endswith("6 rows checked, 4 vowelled, 1 failures, 0 allowlisted"))

    def test_file_arguments_need_every_row_vowelled(self):
        self.assertEqual(self.run_main("content/stage1/b01.json")[0], 0)
        code, out = self.run_main("content/stage1.json")
        self.assertEqual(code, 1)
        self.assertIn("FAIL content/stage1.json a1 items[0] not vowelled", out)
        self.assertEqual(self.run_main(str(hc.root / "content" / "stage1" / "b01.json"))[0], 0)  # absolute paths work

    def test_file_argument_outside_the_scope_exits_2(self):
        code, out = self.run_main("content/stage3/b01.json")
        self.assertEqual((code, out.strip()), (2, "content/stage3/b01.json is not a stage 1 or 2 content file"))

    def test_all_fails_files_not_started(self):
        code, out = self.run_main("--all")
        self.assertEqual(code, 1)
        self.assertNotIn("not started", out)
        self.assertIn("FAIL content/stage1.json a1 items[0] not vowelled", out)

    def test_allowlist_exempts_one_reading_and_is_counted(self):
        hc.ALLOW.write_text("c1 items[1] | the marks give zīn, the translit is zayn\nzz items[0] | a unit that does not exist\n", encoding="utf-8")
        code, out = self.run_main()
        self.assertIn("FAIL tools/harakat_allow.txt zz items[0] allowlist entry for a row that does not exist", out)
        self.assertNotIn("FAIL content/stage2/b01.json", out)
        self.assertTrue(out.rstrip().endswith("6 rows checked, 4 vowelled, 1 failures, 1 allowlisted"))

    def test_base_that_cannot_be_read_fails(self):  # the throwaway layout is not a git repo
        code, out = self.run_main("--base", "HEAD", "content/stage1/b01.json")
        self.assertEqual(code, 1)
        self.assertIn("FAIL content/stage1/b01.json - cannot read the file at HEAD", out)

if __name__ == "__main__":
    unittest.main()
