# Harf course style sheet

Every lesson in `content/` is written and reviewed against this sheet. It sits beside `FRAMEWORK.md` (what goes where) and `tools/lint_content.py` (the automatic checks). When this sheet and the linter disagree, the linter's errors win until the sheet or the linter is changed on purpose.

Evidence keys used below:
- **S**: a source the research actually read (see `/home/claude/reports/Gulf Arabic course to C1.md`).
- **C**: attested in the Gumar Emirati (AE, 9.05M words, 115 novels) and Kuwaiti (KW, 5.21M words, 87 novels) n-grams, checked with `python3 /home/claude/gulfcheck/attest.py`. Counts are given as **AE raw / KW raw (AE pm : KW pm)**, where pm = per million words. Gumar is online romance novels, not speech: a hit proves a spelling exists, not what it means or who says it.
- **U**: the researchers' own knowledge. Needs a native check before it ships as a production item.
- **[weak]**: the rule rests on thin or conflicting evidence. Follow it, but log any native objection.

## 1. The default variety

**Target speech:** urban Emirati as spoken in Dubai and the northern emirates, by people aged about 20 to 40, in everyday colloquial register. The learner aims to sound like a local, not like a news reader.

**The rule for choosing a default (S, report):** where one form is common in both corpora (rates within about 3 to 1), it is the default, even if one country also has its own form. Otherwise the Dubai/northern-Emirates form is the default and the other forms go in notes. Kuwaiti forms are recognised from A2 on (a Kuwaiti friend joins the cast at s2u027), never banned.

**Stage 1 is fixed.** Its 16 lessons were written with some Kuwaiti or pan-Gulf forms (شلونك, إي, شلون, هذول in the app's grammar table). They stay. Those forms are correct Gulf Arabic and the learner may keep using them. From s1u017 on, the Emirati form is taught alongside and becomes the default for Emirati speakers and for the learner's own lines (see the "Stage 1 form" column).

| Feature | Default (script, translit) | Labelled variants (go in notes) | Gumar evidence | Stage 1 form |
|---|---|---|---|---|
| "what?" | شو shu | Kuwait: شنو shinu; Saudi: وش wish, ايش ēsh | شو 45390/723 (5015:139); شنو 4213/8938 (466:1716); وش 5088/7485 (562:1437) | شو (u7) ✓ |
| "not" (before non-verbs) | مب mub | Kuwait: مو mū; UAE also: هب hub; Abu Dhabi: مش mash [weak] | مب 20788/666 (2297:128); مو 10103/22518 (1116:4322); هب 4639/183 (513:35); مش 2208/192 (244:37) | مب (u13) ✓ |
| "how are you?" | شحالك shḥālak / شحالج shḥālich | Kuwait: شلونك shlōnak / شلونج shlōnich | شحالك 1296/22 (143:4); شحالج 1831/34 (202:7); شلونك 192/622 (21:119); شلونج 169/802 (19:154) | شلونك (u1); teach شحالك as a new item |
| "I want / you want" | أبي abi, تبي tabi, تبين tabīn | UAE also: أبا abā, تبا tabā; Saudi: أبغى abgha | ابي 6075/7534 (671:1446); ابا 4882/26 (539:5); تبا 3270/8 (361:2); ابغى 841/785 | أبي (u6) ✓ |
| "I don't want" | ما أبي ma abi | UAE also: ما أبا ma abā | ما ابي 1032/1681; ما ابا 560/0 | — |
| "we" | نحن niḥin | Kuwait: إحنا iḥna | نحن 3232/119 (357:23); احنا 1169/2062 (129:396) | app grammar table lists إحنا first (change, §9) |
| "yes" | هيه hē | Kuwait: إي ī, إيه ēh | هيه 12636/184 (1396:35); هيه والله 705/5; اي والله 509/1183 | إي (u2); teach هيه as a new item |
| "like this, so" | جذي chidhi | UAE also: جي chī; Saudi: كذا kidha | جذي 2679/6242 (296:1198); جي 6406/475 (708:91); كذا 1869/3097 | — |
| "how?" (manner) | شلون shlōn or كيف chēf, both fine | UAE speakers lean كيف chēf; Saudi: kēf | شلون 1808/4310 (200:827); كيف 10142/3033 (1121:582) [weak: كيف counts include fuṣḥā narration] | شلون (u15) ✓ |
| "who?" | منو minu | Hijaz, Egypt, Levant: مين (soft flag) | منو 7082/3187 (783:612) | منو (u7) ✓ |
| "why?" | ليش lēsh | ليه (Egypt, parts of Saudi; soft flag) | ليش 21343/13150; ليه 2966/2969 | ليش (u7) ✓ |
| "now" | الحين il-ḥīn | UAE also: الحينه il-ḥīna | الحين 16032/9612 (1771:1845); الحينه 5379/3 | الحين (u8) ✓ |
| "very, a lot" | وايد wāyid | حيل ḥēl (Kuwait-leaning); واجد wājid | وايد 9853/3156 (1089:606); حيل 844/1914 (93:367) | وايد (u4) ✓ |
| "there isn't" | ما في ma fī | Kuwait: ماكو māku (there is: أكو aku) | مافي 1537/1496 (170:287); ماكو 255/1232 (28:236) | ما في (u13) ✓ |
| future "I'll go" | بروح barūḥ | UAE also: بسير basīr; ما راح + verb for "won't" (Kuwait-leaning) | بروح 3724/2809; بسير 3707/27; ماراح 1261/2289 | بروح (u8) ✓ |
| progressive | قاعد gāʿid + verb (agrees: gāʿda, gāʿdīn) | UAE also: يالس yālis | قاعد 2123/2102 (235:403); يالس 2951/48 (326:9) | app grammar table ✓ |
| "after" | بعد baʿad | UAE also: عقب ʿugub | بعد 34005/18353; عقب 8104/1060 (895:203) | بعد (u15) ✓ |
| "because, so that" | عشان ʿashān | علشان ʿalashān; UAE: عسب ʿasab (recognise only, called a modern error by Emarat Alyoum, S) | عشان 14269/8209 (1577:1576); عسب 5212/4 | — |
| "he / she" | هو huwa / هي hiya | Kuwait: اهو ihu / اهي ihi | اهو 1003/2756 (111:529); اهي 896/3197 (99:614) | app grammar table ✓ |
| "these" | هذيلا hādhēla | Kuwait: هذول hadhōl | هذيلا 353/41 (39:8); هذول 125/205 (14:39) | app grammar table lists هذول first (change, §9) |
| "my mum / my dad" | أمي ummi / أبوي ubūy | UAE also: أمايه, أبويه [weak translit]; Kuwait vocative: يمه yumma, يبه yuba | امي 7176/4407; امايه 6680/3; يمه 3616/7758; ابويه 4238/10 | — |
| "kids" | عيال ʿyāl | UAE also: يهال yahhāl, ياهل yāhil "child" | عيال 1531/720; ياهل 1068/399 | — |
| "room" | غرفة ghurfa | UAE also: حجرة ḥijra | غرفه 3503/2239; حجره 1251/31 | — |
| "talk, speak" | يتكلم yitkallam; يسولف ysōlif "chat" | UAE also: يرمس yirmis | يتكلم 1015/882; يرمس 1205/6; يسولف 488/188 | تتكلم (u9) ✓ |
| "sit" | قعد gaʿad | UAE also: يلس yalas | قعد 923/1404 (102:269); يلس 1566/15 | — |
| "sleep" | نام nām | UAE also: رقد rgad | انام 784/1146; ارقد 1528/67 | — |
| "money" | فلوس flūs | UAE also: بيزات bēzāt | فلوس 342/391; بيزات 129/5 | — |
| "car / phone" | سيارة sayyāra, تلفون tilifōn | موتر mōtar, موبايل mobāyl (recognise; mōtar is old-fashioned in Kuwait, S) | سياره 2170/860 vs موتر 52/1; تلفون 955/492 vs موبايل 338/114 | — |
| "wait!" | تريا trayya (UAE) [weak] | Kuwait: انطر; never استنى (Levant/Egypt) | تريا 121/3, اتريا 529/2; انطر 117/231 | لحظة in app grammar ✓ |
| "what's wrong?" | شفيك shfīk / شفيج shfīch | UAE also: شو فيك shu fīk | شفيك 719/1193; شو فيك 430/9 | — |

**How to use the table:** a default form may appear in any speaker's line. A variant appears only (a) in the note column, or (b) in a line spoken by a character of that origin (Fahad and Nūra are Kuwaiti, see `FRAMEWORK.md` §2), or (c) as an item in a lesson whose point is that variety, with "(Kuwait)" or "(UAE)" in the English. Never mix two countries' variants in one speaker's line.

## 2. Spelling (Arabic script)

The course follows **CODA-Gulf** (S: Khalifa et al. 2016; Habash et al. 2018): spell by the fuṣḥā cognate, let the transliteration carry the Gulf sound. That keeps spelling stable, matches the fuṣḥā track, and matches the research resources. Native writers are less consistent, so common native spellings go in the note as "you'll see written …".

| Feature | Rule | Example | Evidence |
|---|---|---|---|
| g (and j) from ق | write ق | قهوة gahwa, قال gāl, قريب garīb, قدام jiddām [weak translit] | S (CODA*) |
| ch from ك in roots | write ك | باكر bāchir, سمك simach, كم cham | S (GUMAR) |
| 2nd person feminine -ich | always ـج | عندج ʿindich, شحالج shḥālich, عليج ʿalēch | S; C (عليج 7565/3072, لج 6707/3650) |
| y from ج | write ج, translit y where the default speaker says y | جيت yīt, جديد yidīd, دجاج diyāy, جالس yālis | S (CODA* writes جلس for yalas) [weak: Emirati writers mostly write ي: ياي 2266 vs جاي 568, ويهي 2446 vs وجهي 290] |
| ch in شاي | write ش | شاي chāy | S (GUMAR) |
| counterfactual chān | جان, kept apart from كان "was" | جان قلت لي chān gilt-li | S (GUMAR) |
| fixed forms | وايد, مب | — | S |
| future b- | joined to the verb | بروح, بتروح, بنروح | S (CODA*) |
| negation ما | a separate word | ما أدري, ما في, ما راح | S (CODA*) |
| negated pronouns | joined | ماني "I'm not", ماهو | S (CODA*) |
| final tāʾ marbūṭa | always ة; becomes ت before a suffix | سيارة → سيارتي | S (GUMAR) |
| 3rd person masculine suffix | ـه | بيته bētah, عنده ʿindah | S |
| alif maqṣūra | as in fuṣḥā | متى, على, سوى | S |
| initial hamza | write أ / إ / آ where fuṣḥā has it (stage 1 practice: أبي, أقدر, أنا, إي, إن شاء الله, آسف). Exception kept from stage 1: انت, انتي, انتو without hamza | أروح, أعرف; انت | stage 1; CODA* allows either. The linter and attest.py ignore hamza, so this never causes a missed duplicate |
| vowel marks | none. Shadda only where it prevents a misreading (ريّال) | — | lint warns on marks |
| Persian letters چ گ ڤ پ | never in an Arabic field. Allowed in a note: "you'll see written چاي" | — | S (CODA* uses none) |
| numbers | words, not digits, in dialogue and items | بعشرين درهم | stage 1 |
| punctuation | Arabic comma ، and question mark ؟ | — | stage 1 |

**Deliberate exceptions (whole list; nothing else may deviate):**
1. **جذي chidhi**, not كذي. Natives write جذي 2679/6242 against كذي 17/4, and كذي would read as Saudi كذا. [weak: CODA lexicon not checked]
2. **ريّال rayyāl** "man", with ي and a shadda. رجال would read as rjāl "men", and plain ريال is also the riyal coin. C: ريال 2293/683 (mixes both meanings). [weak]
3. **باكر bāchir** stays as in u8 and the app's DIALECT rule, although natives mostly write باجر (4173/1772 against باكر 137/42). Put "you'll see written باجر" in the note the first time it recurs in a new lesson.
4. **ثنين thnēn** stays as in u4 and the NUMBERS table, although اثنين is more common in writing (349/301 against 46/43).
5. **محد maḥḥad** "nobody" is written as one word (it is fused, not ما + word). C: 676/399 pm. [weak]
6. **في أمان الله** stays as in u11; natives often write فمان الله (539/110). Note it as "you'll see written".

## 3. Transliteration

One scheme, always. It is the app's `DIALECT` scheme (index.html), with one addition for ج (marked ★). The linter accepts only these characters: a–z, A–Z, ā ī ū ē ō, ḥ ṣ ṭ ẓ, ʿ (U+02BF), ʼ (U+02BC), hyphen, space and ordinary punctuation. Capital Ā, Ḥ, Ṣ, ʿA and similar are rejected, so cast names avoid them (FRAMEWORK §2).

| Sound | Write | Examples | Notes |
|---|---|---|---|
| long vowels | ā ī ū | bāchir, ʿīd, rūḥ | |
| Gulf ay / aw | ē ō | bēt, zēn, yōm, mōl | never ay/aw in Gulf lines, except in fixed religious formulas already in stage 1 (as-salāmu ʿalaykum) |
| short vowels | a i u | shismak, ʿarabi | don't write e/o for short vowels |
| feminine ending ة | -a | gahwa, sayyāra | |
| "his" ـه | -ah (after a vowel: -h) | bētah, ʿindah, ʿaṭāh | keeps it apart from -a |
| ح ص ط | ḥ ṣ ṭ | ḥilu, ṣabāḥ, ṭālib | |
| ض and ظ | ẓ for both | tfaẓẓal, abyaẓ | ḍ triggers a lint warning |
| ع / hamza | ʿ / ʼ | ʿindi; masāʼ, shāʼ allāh | no ʼ at the start of a word (ana, abi, idhnak) |
| خ غ ش ث ذ | kh gh sh th dh | khalāṣ, ghāli, thalātha, hādha | |
| ق | g; j where Gulf says j; q only in religious or formal words | gahwa, garīb, jiddām; qurʼān | |
| ك | k; ch only where Gulf really says ch | kitāb; bāchir, simach, cham, -ich | ch is learned word by word (S: lexical, not a rule) |
| ج | j ★or y where the default speaker says y | jāmʿa, jawāz; yidīd, yīt, rayyāl, diyāy, masyid | ★ addition to DIALECT. Fuṣḥā loans and formal words keep j (jāmʿa, jinsiyya). Each y-word is listed in the seed lexicon. [weak: y-set per word needs native check] |
| geminates | doubled letters | sawwa, rayyāl, ḥammām | |
| article | il-; l- after a vowel; doubled before sun letters (t th d dh r z s sh ṣ ẓ ṭ l n) | il-bēt, is-sūg, ish-shams, fi l-jāmʿa, maʿa s-salāma | ق (g), ك (ch) and ج (j or y) count as moon letters: il-gahwa, il-yidīd [weak for ج] |
| future b- | joined, no hyphen | barūḥ, bitrūḥ, binrūḥ, biyrūḥ | stage 1, DIALECT |
| preposition b- | hyphen | b-cham, b-khēr, b-ʿishrīn | stage 1 |
| "and" | w as its own word | w inta, w il-ḥsāb | stage 1 |
| dative l- + suffix on a verb | hyphen | gūl-li, gilt-lah, ṭarrish-li | S (agul-lich) |
| suffixes | joined; hyphen only where letters would read as a digraph | bētak, ʿindich; bēt-ha, ʿind-hum | DIALECT |
| negator ما | ma | ma adri, ma fī, ma barūḥ | DIALECT, GRAMMAR table. Long mā only in mā shāʼ allāh and the two stage 1 formulas mā gaṣṣart and mā sawwēna shay (kept as taught) |
| "no", prohibitive | la | la, la trūḥ | stage 1 |
| God | allāh, lower case | in shāʼ allāh, allāh ykhallīk | |
| capitals | lower case, also at sentence start; capitalise names and places only | Sēf, Dbayy, il-Kwēt | stage 1 |
| English loans | Gulf pronunciation, not English spelling | ōkē, tāksi, mōl, tilifōn | |

**Reused phrases keep their first transliteration.** A phrase already taught as an item is copied verbatim (script and transliteration) when it reappears in a later dialogue.

## 4. Gender, number and the learner

- **The learner is speaker B**, a young British man studying and interning in Dubai (as in u3 and u16; his Arabic name in u3 is Sālim). B's own forms are masculine (ṭālib, rāyiḥ, āsif). A addresses B as a man.
- **Items are given in the masculine singular by default.** The English says **(to a man)**, **(said by a man)** or **(a man)**, and the note gives the woman's form first: `to a woman: shḥālich (شحالج)`, `a woman says: āsfa (آسفة)`, `a woman: rāyḥa`. The linter warns if "(to a man)" has no "woman" in the note.
- **The reverse:** when the lesson's point is the feminine form, the English says **(to a woman)** and the note gives `to a man: …`. Teach the woman's form as its own item only for very frequent phrases (how are you, thanks, do you want, you know).
- **Plurals:** English **(to a group)**, note `to one man: …; to one woman: …`. Default plural forms are the merged ones: intu, -kum, hum, -ūn (S). Feminine plurals (intin, -kin, -in) are recognition only, in notes, from B1.
- **The learner must produce feminine and plural forms.** From s1u018 on, at least one dialogue in three has B speaking to a woman (Maryam, Umm Sēf, Nūra) or to a group, so B's own lines carry -ich, -īn and -ūn.
- **Every second-person form must match its addressee in that line:** -ak / t-verb for a man; -ich / t-…-īn for a woman; -kum / t-…-ūn for a group. The English gloss must match too ("you (f.)" where it isn't obvious).

## 5. Variants and labels in notes

- **Note column order:** gender counterpart; then regional variants; then a usage hint. Separate with "; ". Example: `to a woman: tabīn; UAE also: tabā (تبا); Saudi: tabgha`.
- **Region names, in this order:** UAE also:, Kuwait:, Saudi:, Qatar:, Bahrain:, Oman:, Abu Dhabi:. Use the full name, as stage 1 does ("Kuwait: mū (مو)").
- **Script in brackets** after the transliteration the first time a variant is shown, optional after that.
- **"you'll see written X"** for native spellings that differ from the course's (باجر, الي, فمان الله, چاي, مافي).
- **In the English column** use these register labels in brackets: (friends only), (respectful), (formal), (old-fashioned), (UAE), (Kuwait). Rude, taboo or insulting words are **never items** (every item becomes a production card). They go in a note or the culture field marked "don't use": چب, باية, زقوم, مالت عليك, the oaths عليّ الحرام / عليّ الطلاق, animal insults.

## 6. Register

- **Colloquial by default.** Every Gulf line is what a Dubai friend, colleague or shopkeeper would actually say.
- **Religious formulas are not "formal".** السلام عليكم, الحمد لله, إن شاء الله, ما شاء الله, عظم الله أجركم and the Ramadan and Eid formulas are normal everyday speech.
- **Formal or fuṣḥā-flavoured forms are taught only on purpose and always labelled (formal)**: لأن liʾann (S, formal context), "educated spoken" vocabulary from B2, and the register-shift units in C1. A formal form never replaces a colloquial default in an ordinary dialogue.
- **Politeness level follows the person addressed.** Elders and strangers get allāh ykhallīk, ṭawīl il-ʿumr, yā ʿammi; friends get yā rayyāl, khēba, English loans. يا ريّال to an elder or in a meeting is "a major social faux pas" (S, The National).
- **Code-switching** (English words, ōkē, bro, sorry) belongs in peer dialogues among young people only. Elder and formal scenes stay unmixed (S, Gulf News).

## 7. Writing natural dialogues

1. **Short turns.** A1 lines 2 to 7 words; A2 up to 10; B1 up to 12; B2 and C1 up to about 16, but keep at least half of B's lines at 2 to 8 words, because those become sentence-building cards. 200 characters maximum (lint).
2. **Line counts:** A1 4 to 6 lines, A2 5 to 7, B1 6 to 8, B2 and C1 7 to 10.
3. **Real settings.** Dubai first: a karak stand, the metro, a mall, the office, a university corridor, a majlis in Sharjah, a desert camp, a pharmacy, a WhatsApp voice note. Kuwait from B1 (a trip with Fahad). Use real public places (Dubai Metro, Deira, the Avenues) but never invent facts about real organisations or people.
4. **Fixed cast** (FRAMEWORK §2). Name tells origin, so reviewers can check each line against its speaker. When A is not a cast member, A is a default-variety Emirati speaker; name the role in the goal ("Order from a café worker").
5. **Every item appears in the dialogue,** exactly or with an ending changed. At most two items may be absent, and only if each is the counterpart (other gender, plural, opposite) of an item that does appear.
6. **Mostly known words.** The linter warns when more than 35% of dialogue words are neither known nor in this lesson's items; aim for under 20%. Allowed extras: names, numbers, place names, words the English context makes obvious.
7. **No translationese.** Write the scene in Gulf first, then gloss it in English. Never translate an English script line by line. Gulf people answer "how are you" with formulas, not with information. They say "yalla", not "OK, let us go now".
8. **Social formulas come with their reply** in the same dialogue (FRAMEWORK §7). A formula without its reply teaches only half the pair.
9. **One point per lesson, recycled in the dialogue at least twice.**
10. **English gloss:** natural English, same gender and number as the Arabic, no word-for-word glossing. Use brackets for what English needs but Arabic leaves out: "(It's) twenty dirhams."
11. **No fabricated facts.** No invented holidays, laws, prices given as current fact, office procedures or quotes from real people. When a fact is needed (weekend days, visa steps), mark it U in the review sheet and send it to the native queue.

## 8. The fuṣḥā column (item field 4)

- **What it holds:** the ordinary fuṣḥā equivalent a reader would meet in news or on a sign, in Arabic script. Identical words are repeated (السلام عليكم → السلام عليكم; شركة → شركة).
- **No vowel marks,** except the minimum that shows gender or a needed case ending (أنتِ, عندكَ, كيف حالكِ؟), as in stage 1. Tanwīn is fine here (شكرًا, جدًا), because this column is fuṣḥā.
- **Two equivalents** at most, separated by " / " (جدًا / كثيرًا).
- **Leave it ""** for Gulf formulas, interjections, slang, loans and names with no fuṣḥā counterpart (هلا والله, الله يحييك, خيبة, اوكي).
- **Never** put a Gulf form, a definition or Latin letters in it. The linter errors if the field isn't Arabic.

## 9. Changes this sheet makes to the app (not yet applied)

1. `DIALECT` constant, transliteration paragraph: replace "ج as j" with "ج as j, or y where Gulf speakers say y (yā, rayyāl, yidīd; fuṣḥā words keep j: jāmʿa)". Add to the dialect rules: "Emirati forms are the default: hē (yes), niḥin (we), shḥālak (how are you), hādhēla (these); Kuwaiti shinu, mū, iḥna, ī only from a Kuwaiti character."
2. `GRAMMAR` table "I, you, he…": put نحن niḥin first ("we; Kuwait: iḥna"). "This, that…": put هذيلا hādhēla first ("these; Kuwait: hadhōl").
3. `tools/lint_content.py`: the OTHER list contains ايه, which is also Kuwaiti ēh "yes", and ابغى/تبغى (Saudi, legitimate in a Saudi note). Warnings on these in a Kuwaiti or Saudi character's line can be dismissed. Optional fix: allow Ā Ē Ī Ō Ū Ḥ Ṣ Ṭ Ẓ in TR_OK so names like ʿĀysha pass.

## 10. Reviewer checklist, ranked by how often each error is expected

Apply every check to every Arabic line and item. Ranks 1 to 3 come from documented LLM failure modes (S: AL-QASIDA, AraDiCE, Barmandah 2025); the rest are inferred from Gulf morphology.

| # | Check | Look for | Action |
|---|---|---|---|
| 1 | **MSA leakage** | Hard list: سوف, لن, ليس/ليست, لم + verb, الآن, جدا, فقط, يجب, منذ, عندما, هذه, ذلك, تلك, هؤلاء, الذين, الذي, التي, حيث, خلال, لقد, يوجد, لدى, كذلك, لذلك, بينما, أيضا, كثيرا, أريد, ماذا, لماذا, حسنا, لكي, إنني; case endings or tanwīn; أنا لا أفهم-type sentences. Soft list (fine in fixed phrases or formal-labelled lines only): هل, كيف حالك, لأن, نعم | Hard: rewrite. Soft: justify or rewrite. Gumar hits on these words come from narration and do not count as evidence (e.g. اريد 2170/347, هذه 934/585) |
| 2 | **Over-formal politeness** | هل يمكنك…, من فضلك chains, شكرًا جزيلًا in speech, textbook greetings | Use لو سمحت, ممكن…؟, عطني, الله يخليك, مشكور, ما قصرت |
| 3 | **Egyptian or Levantine leakage** | Hard: عايز, عاوز, بدّي, بدك, دلوقتي, هلق, كده, هيك, ازيك, كيفك, منيح, كويس, فين, ما…ش, ح- future, عم + verb, بـ as present tense. Soft (they occur in Gulf novels): مش (Abu Dhabi only, tagged), ليه, مين, شو in a Kuwaiti's line | Hard: rewrite. Soft: change to default unless the speaker's origin justifies it |
| 4 | **Wrong person, gender or number** | -īn missing for a woman (تقولي for تقولين), -ūn missing for a group, ـك where ـج is meant, masculine adjective for a woman speaker, English gloss with the wrong gender | Fix to agree with the addressee in that line |
| 5 | **Regions mixed inside one speaker** | مب with شنو, هيه with إحنا, Kuwaiti اهو in an Emirati's line | Make the line match the speaker's origin |
| 6 | **Invented or unattested form** | attest.py gives under 3 hits for a word, or 0 for a two-word phrase | Exact-string web search for Gulf hits; still nothing → native queue, and it can't ship as an item |
| 7 | **Calque from English** | "have a nice day" translated literally, English word order, "I am feeling…" | Ask "would a Dubai local say this here?" Rewrite from the situation |
| 8 | **Transliteration off-scheme** | wayid/waayed, č, q for a Gulf g, ay/aw in Gulf words, ḍ, missing hyphen on il- | Fix to §3 |
| 9 | **Script, transliteration and English disagree** | قال with qāla, gloss "you (m.)" over a ـج form, different words in the two layers | Fix so all three say the same thing |
| 10 | **Cultural or factual fabrication** | wrong formula reply (السلام عليكم → الله يسلمك is wrong), invented customs, wrong weekend days, invented quotes | Check against FRAMEWORK §7 and sources; U → native queue |
| 11 | **Course structure** | a phrase taught twice (lint error), an item missing from the dialogue beyond the allowed two, over-length fields, more than one new grammar point, a rude word as an item | Fix before merge |

**Order of work for every batch:** (1) `python3 tools/lint_content.py N` with zero errors; (2) `python3 tools/lint_content.py N --gumar` and `python3 /home/claude/gulfcheck/attest.py unit <file>`, with every "check" flag either fixed or justified in the review sheet; (3) two blind reviewers, one hunting leakage (checks 1, 3, 5), one judging naturalness and register (checks 2, 7, 10); (4) any disagreement, unattested form or U item goes to the native queue. Nothing marked U ships as an item until a native confirms it.

## 11. DEFINITE ERROR, VARIANT or FINE

**DEFINITE ERROR** (must be fixed; the lesson can't merge):
- any hard-list MSA or Egyptian/Levantine word in a Gulf line (outside a line labelled (formal) or a fixed religious formula);
- a second-person or first-person form that doesn't agree with the speaker or addressee in that line;
- missing -īn / -ūn where Gulf requires them;
- script, transliteration and English that say different things;
- transliteration outside the scheme, چ or گ in an Arabic field, final ه for ة, vowel marks or tanwīn in a Gulf line;
- two countries' variants in one speaker's line, or a variant in B's line;
- a wrong fixed reply to a social formula;
- a phrase already taught, a lint error, or a rude or taboo word as an item;
- a form with zero corpus hits and no other source, shipped as an item;
- an invented fact presented as true.

**VARIANT** (not wrong Arabic, but not the course's choice):
- a real Gulf form from another country or emirate (شنو, مو, إحنا, هب, عقب, أبا, بسير) in a default speaker's line → change it to the default, or move it to the note, or give the line to a speaker of that origin;
- a native spelling that differs from §2 (باجر, الي, ابا without hamza, مافي, ييت, ريال without shadda) → change to the course spelling and note "you'll see written …";
- a more conservative form (intin, hin, feminine plural verbs) → note only, from B1.

**FINE** (don't flag):
- words shared with fuṣḥā that Gulf also uses in speech: كيف chēf, بعد, قبل, كل, لو, إذا, شركة, الجامعة;
- stage 1 forms that are pan-Gulf or Kuwaiti-leaning (شلونك, إي, شلون), used by the learner;
- English loans and code-switching in peer dialogues among young people;
- the soft-list words in a fixed phrase, in a (formal) line, or in a speaker whose origin uses them;
- fast-speech reductions inside the transliteration only when they are taught (ʿshān for ʿashān is noted, not written).

## 12. Seed lexicon

Every ruling a reviewer or native speaker makes (form, course spelling, transliteration, gloss, region tag, register, source, status S/C/U/N) is logged so later lessons are checked against it. The lexicon file does not exist yet; until it does, log rulings in each batch's review sheet. The first entries are the defaults in §1 and the exceptions in §2. The y-for-ج word list and the ch-for-ك word list grow here, one word at a time.
