# Harf course style sheet

Every lesson in `content/` is written and reviewed against this sheet. It sits beside `FRAMEWORK.md` (what goes where) and `tools/lint_content.py` (the automatic checks). When this sheet and the linter disagree, the linter's errors win until the sheet or the linter is changed on purpose. Revised after the review in `content/review/framework_review.md`; FRAMEWORK.md ends with the responses.

Evidence keys used below:
- **S**: a source the research actually read (see `/home/claude/reports/Gulf Arabic course to C1.md`).
- **C**: attested in the Gumar Emirati (AE, 9.05M words, 115 novels) and Kuwaiti (KW, 5.21M words, 87 novels) n-grams, checked with `python3 /home/claude/gulfcheck/attest.py`. Counts are given as **AE raw / KW raw (AE pm : KW pm)**, where pm = per million words. Gumar is online romance novels, not speech: a hit proves a spelling exists, not what it means or who says it. attest.py does not merge ج and ي, so always look up the spelling the course actually uses.
- **U**: the researchers' own knowledge. Needs a native check before it ships as a production item.
- **[weak]**: the rule rests on thin or conflicting evidence. Follow it, but log any native objection.

## 1. The default variety

**Target speech:** urban Emirati as spoken in Dubai and the northern emirates, by people aged about 20 to 40, in everyday colloquial register. The learner aims to sound like a local, not like a news reader.

**The rule for choosing a default (S, report):** where one form is common in both corpora (rates within about 3 to 1), it is the default, even if one country also has its own form. Otherwise the Dubai/northern-Emirates form is the default and the other forms go in notes. Kuwaiti forms are taught for recognition from A2 (a Kuwaiti friend joins the cast at s2u027), never at A1, and never banned.

**Stage 1 forms are FINE, everywhere.** The 16 stage 1 lessons stay as they are. Some of their forms are pan-Gulf or Kuwaiti-leaning (شلونك / شلونج, إي, شلون, معليش). They are correct Gulf Arabic, and B (the learner) may use them in any later lesson. The Emirati alternatives (شحالك, هيه, كيف chēf) are taught as **extra items**, never as corrections: no tip, note or reviewer comment may tell the learner to stop saying a stage 1 form. Emirati speakers in the cast use the Emirati default; B may use either.

| Feature | Default (script, translit) | Labelled variants (go in notes) | Gumar evidence | Stage 1 form (fine for B) |
|---|---|---|---|---|
| "what?" | شو shu | Kuwait: شنو shinu; Saudi: وش wish, ايش ēsh | شو 45390/723 (5015:139); شنو 4213/8938 (466:1716); وش 5088/7485 (562:1437) | شو (u7) |
| "not" (before non-verbs) | مب mub | Kuwait: مو mū; UAE also: هب hub; Abu Dhabi: مش mash [weak]; you'll see written موب | مب 20788/666 (2297:128); مو 10103/22518 (1116:4322); هب 4639/183 (513:35); مش 2208/192 (244:37) | مب (u13) |
| "how are you?" | شحالك shḥālak / شحالج shḥālich | Kuwait: شلونك / شلونج (stage 1) | شحالك 1296/22 (143:4); شحالج 1831/34 (202:7); شلونك 192/622 (21:119); شلونج 169/802 | شلونك, شلونج (u1) |
| "I want / you want" | أبي abi, تبي tabi, تبين tabīn | UAE also: أبا abā, تبا tabā; Saudi: أبغى abgha | ابي 6075/7534 (671:1446); ابا 4882/26 (539:5); تبا 3270/8 (361:2); ابغى 841/785 | أبي, تبي (u6) |
| "I don't want" | ما أبي ma abi | UAE also: ما أبا ma abā | ما ابي 1032/1681; ما ابا 560/0 | — |
| "we" | نحن niḥin | Kuwait: إحنا iḥna | نحن 3232/119 (357:23); احنا 1169/2062 (129:396) [weak count: نحن includes fuṣḥā narration] | — |
| "yes" | هيه hē | Kuwait: إيه ēh; إي ī (stage 1, pan-Gulf) | هيه والله 705/5 against اي والله 509/1183; هيه 12636/184 [weak count: هيه is also a spelling of hiya "she"] | إي (u2) |
| "like this, so" | جي chī | wider Gulf and Kuwait: جذي chidhi (also taught, s1u027); Saudi: كذا kidha | جي 6406/475 (708:91); مب جي 79/3; جذي 2679/6242 (296:1198); كذا 1869/3097 | — |
| "how?" (manner) | كيف chēf [weak: chēf or kēf, native check] | شلون shlōn (stage 1; Kuwait-leaning); Saudi: kēf | كيف 10142/3033 (1121:582) [weak: includes narration]; شلون 1808/4310 (200:827) | شلون (u15) |
| "who?" | منو minu | Hijaz, Egypt, Levant: مين (soft flag) | منو 7082/3187 (783:612) | منو (u7) |
| "why?" | ليش lēsh | ليه (Egypt, parts of Saudi; soft flag) | ليش 21343/13150; ليه 2966/2969 | ليش (u7) |
| "now" | الحين il-ḥīn | UAE also: الحينه il-ḥīna; Kuwait also: اللحين illaḥīn | الحين 16032/9612 (1771:1845); الحينه 5379/3; اللحين 1823/2608 | الحين (u8) |
| "very, a lot" | وايد wāyid | حيل ḥēl (Kuwait-leaning); واجد wājid | وايد 9853/3156 (1089:606); حيل 844/1914 (93:367) | وايد (u4) |
| "there isn't" | ما في ma fī | Kuwait: ماكو māku (there is: أكو aku) | مافي 1537/1496 (170:287); ماكو 255/1232 (28:236) | ما في (u13) |
| future "I'll go" | بروح barūḥ | UAE also: بسير basīr; ما راح + verb for "won't" (Kuwait-leaning) | بروح 3724/2809; بسير 3707/27; ماراح 1261/2289 | بروح (u8) |
| progressive | قاعد gāʿid + verb (agrees: gāʿda, gāʿdīn) | UAE also: يالس yālis | قاعد 2123/2102 (235:403); يالس 2951/48 (326:9) | — |
| "after" | بعد baʿad | UAE also: عقب ʿugub | بعد 34005/18353; عقب 8104/1060 (895:203) | بعد (u15) |
| "because, so that" | عشان ʿashān | لأن lann (everyday too); علشان; UAE: عسب ʿasab (note only: Emarat Alyoum calls it a modern error, S) | عشان 14269/8209; لان 4583/4582 (506:879); عسب 5212/4 | — |
| "like, as" | مثل mithil | UAE also: شرات shrāt | مثل 7118/5885; شرات 2156/7 | — |
| "he / she" | هو huwa / هي hiya | Kuwait: اهو ihu / اهي ihi | اهو 1003/2756 (111:529); اهي 896/3197 (99:614) | — |
| "you (m.)" | انت inta | you'll see written انته | انته 6293/210 | انت (u3) |
| "these" | هذيلا hādhēla | Kuwait: هذول hadhōl | هذيلا 353/41 (39:8); هذول 125/205 (14:39) | — |
| "outside" | برا barra | you'll see written برع (mostly UAE) | برا 1150/786; برع 3043/191 | — |
| "my mum / my dad" | أمي ummi / أبوي ubūy | UAE also: أمايه ummāya, أبويه ubūya [translit U]; Kuwait vocative: يمه yumma, يبه yuba | امي 7176/4407; امايه 6680/3; يمه 3616/7758; ابويه 4238/10 | — |
| "kids, child" | عيال ʿyāl | UAE also: يهال yahhāl, ياهل yāhil "child" | عيال 1531/720; يهال 347/124; ياهل 1068/399 | — |
| "room" | غرفة ghurfa | UAE also: حجرة ḥijra | غرفه 3503/2239; حجره 1251/31 | — |
| "talk, speak" | يتكلم yitkallam; يسولف ysōlif "chat" | UAE also: يرمس yirmis | يتكلم 1015/882; يرمس 1205/6; يسولف 488/188 | تتكلم (u9) |
| "sit" | قعد gaʿad | UAE also: يلس yalas [weak: native check yalas / yilas]; present ييلس yiylis | قعد 923/1404 (102:269); يلس 1566/15, يلست 5388/22, ييلس 420/4 | — |
| "sleep" | نام nām | UAE also: رقد rgad | انام 784/1146; ارقد 1528/67 | — |
| "money" | فلوس flūs | UAE also: بيزات bēzāt | فلوس 342/391; بيزات 129/5 | — |
| "car / phone" | سيارة sayyāra, تلفون tilifōn | موتر mōtar, موبايل mobāyl (recognise; mōtar is old-fashioned in Kuwait, S) | سياره 2170/860 vs موتر 52/1; تلفون 955/492 vs موبايل 338/114 | — |
| "wait!" | تريا trayya (UAE) [weak]; you'll see written اتريا | Kuwait: انطر; never استنى (Levant/Egypt) | اتريا 529/2, تريا 121/3; انطر 117/231 | — |
| "what's wrong?" | شفيك shfīk / شفيج shfīch | UAE also: شو فيك shu fīk | شفيك 719/1193; شو فيك 430/9 | — |

**How to use the table:** a default form may appear in any speaker's line. A variant appears only (a) in the note column, (b) in a line spoken by a character of that origin (Fahad and Nūra are Kuwaiti, see `FRAMEWORK.md` §2), or (c) as an item in a lesson whose point is that variety, with "(Kuwait)" or "(UAE)" in the English. Never mix two countries' variants in one speaker's line. B uses defaults and stage 1 forms only.

## 2. Spelling (Arabic script)

The course follows **CODA-Gulf** (S: Khalifa et al. 2016; Habash et al. 2018) for q, k and the -ich ending: spell by the fuṣḥā cognate and let the transliteration carry the Gulf sound. **It departs from CODA for the y-sound** (course-lead decision): where Gulf speakers say y for fuṣḥā j in an everyday dialect word, write ي. Natives mostly write it that way, the corpus supports it, and the app's text-to-speech reads the script, so ي gives the right sound. Common native spellings that differ go in the note as "you'll see written …".

| Feature | Rule | Example | Evidence |
|---|---|---|---|
| g (and j) from ق | write ق | قهوة gahwa, قال gāl, قريب garīb, قدام jiddām [weak translit] | S (CODA*) |
| ch from ك in roots | write ك | باكر bāchir, سمك simach, كم cham | S (GUMAR) |
| 2nd person feminine -ich | always ـج | عندج ʿindich, شحالج shḥālich, عليج ʿalēch | S; C (عليج 7565/3072, لج 6707/3650) |
| **y-sound from fuṣḥā j, in dialect words** | write ي | ياي yāy "coming" (2266/554 vs جاي 568/911); يالس yālis (2951/48 vs جالس 505/839); ريّال rayyāl (2293/683); يديد yidīd (962/194 vs جديد 765/710 for jadīd); شو اليديد (8/0); يهال, ياهل; ييت yīt "I came" (801/266 vs جيت 321/567); يبت yibt "I brought" (370/93); ييب لي yīb-li (16/9); دياي diyāy (39/25); يلس yalas (1566/15; present ييلس yiylis 420/4); ويهي wiyhi "my face" (2446/235); يوعان yōʿān "hungry" (194/83) | C; course lead |
| **j kept** | write ج where the word is said with j: fuṣḥā-shared, formal or recent words | جامعة jāmʿa, جواز jawāz, جنسية jinsiyya, مسجد masjid, الجمعة il-jumʿa (relaxed speech yimʿa: note it), مجلس majlis | stage 1 (u7, u16); y-spellings are rare: اليامعه 17/0. Exception: with the article, المسيد 451/29 beats المسجد 48/63 (UAE). Keep masjid as the item, and always note "UAE also: il-masīd" |
| deciding j or y | look up both spellings with attest.py, cite both counts in the review sheet, and log the word in the seed lexicon | — | — |
| ch in شاي | write ش | شاي chāy | S (GUMAR) |
| counterfactual chān | جان, kept apart from كان "was" | جان قلت لي chān gilt-li | S (GUMAR) |
| fixed forms | وايد, مب | — | S |
| future b- | joined to the verb | بروح, بتروح, بنروح | S (CODA*) |
| negation ما | a separate word | ما أدري, ما في, ما راح | S (CODA*) |
| negated pronouns | joined | ماني "I'm not", ماهو | S (CODA*) |
| final tāʼ marbūṭa | always ة; becomes ت before a suffix | سيارة → سيارتي | S (GUMAR) |
| 3rd person masculine suffix | ـه | بيته bētah, عنده ʿindah | S |
| alif maqṣūra | as in fuṣḥā | متى, على, سوى | S |
| initial hamza | write أ / إ / آ where fuṣḥā has it (stage 1 practice: أبي, أقدر, أنا, إي, إن شاء الله, آسف). Kept from stage 1: انت, انتي, انتو without hamza | أروح, أعرف; انت | stage 1; CODA* allows either. The linter and attest.py ignore hamza |
| vowel marks | none. Shadda only where it prevents a misreading (ريّال "man" vs ريال the coin) | — | lint warns on other marks |
| Persian letters چ گ ڤ پ | never in an Arabic field. Allowed in a note: "you'll see written چاي" | — | S (CODA* uses none) |
| numbers | words, not digits, in dialogue and items | بعشرين درهم | stage 1 |
| punctuation | Arabic comma ، and question mark ؟ | — | stage 1 |

**Deliberate exceptions (whole list):**
1. **جذي chidhi, جي chī** and **جان chān**: ch spelled ج. Natives write جذي 2679/6242 against كذي 17/4, and جي 6406/475; كذي and كي would read as Saudi كذا or fuṣḥā كي. جان is CODA's own spelling.
2. **باكر bāchir** stays as in u8 and the app's DIALECT rule, although natives mostly write باجر (4173/1772 against 137/42). Note "you'll see written باجر" the first time it recurs.
3. **ثنين thnēn** stays as in u4 and the NUMBERS table, although اثنين is more common in writing (349/301 against 46/43).
4. **محد maḥḥad** "nobody" is one word (it is fused, not ما + word). C: 676/399 pm. [weak]
5. **في أمان الله** stays as in u11; note "you'll see written فمان الله" (539/110).
6. **بعد** is transliterated by meaning: baʿad "too, also, still, yet" (ana baʿad), baʿd "after" (baʿd il-maghrib, baʿd bāchir). Course lead ruling; both are the same spelling.
7. **الفريج il-firīj "the neighbourhood"** keeps ج although the j comes from ق (course-lead exception): فريق reads as "team" in the app's voice and in print.
8. **Helping vowel in CvCC nouns:** Gulf usually inserts a short vowel between the last two consonants: akil, isim, ṣifir, khubiz, ʿiṭir, laḥam, shahar, baḥar, dihin (the published UAE grammar writes them this way). Not when the first of the two is l, r, n or m: bint, galb, ḥarb, shams. Kept as the course already teaches them, pending a native check: ṣubḥ, is-sabt, ʿashr (before a noun). Every other new CvCC noun follows the rule (khashim "nose", per the published grammar).
9. **The future b- keeps the i before a consonant cluster:** binitrayyāk, bititʼakhkhar, binitghadda (not bintrayyāk). Before a single consonant: bashūf, bitrūḥ.
10. **A final -i or -u lengthens before a suffix:** giltī-li, giltī-lah, giltū-li, ṭarrashtī-lhum (written with ā/ī/ū because the vowel is stressed and long).
11. **An unstressed i in a verb's last syllable drops before a vowel-initial ending:** ywaffig + ak → ywaffgak, garrib + ah → garrbah, khabbir + ich → khabbrich, ṭarrish + ī → ṭarrshī (as s1u049).

**Homographs: teach these only as chunks, never bare,** because the linter's duplicate check sees one key:
- يدي: yaddi "my grandfather" vs īdi "my hand" (write "my hand" إيدي, 3592/421).
- ويه: wiyh "face" vs wēh "ugh!". Teach ويهي "my face"; the interjection only in notes.
- يا: "he came" vs the vocative يا. Teach ما يا "he didn't come" (110/10) or another chunk attested with attest.py; never bare يا.
- مرة: marra "once, time" (taught only in chunks: ʿīd marra thānya u2, hal-marra s1u031, il-marra th-thānya s1u037) vs mara "woman, wife" vs Saudi marra "very". Teach "wife" as مرتي (187/274) and Saudi "very" only in a chunk such as مرة حلو (14/43).
- يصلح: yṣalliḥ "fixes" (the item, s3u029) vs yiṣlaḥ "will do, is suitable". Teach the second only as ما يصلح (16/25).
- ربع: rubʿ "quarter" (clock time: w rubʿ, illa rubʿ) vs rabʿ "friends, mates". Teach "friends" as ربعي rabʿi "my mates" (276/130); never bare ربع.
- يمه: yumma "mum" (the item, s2u030) vs yammah "beside him, near him". Teach "near him" as a chunk (يمه على طول style) and note the clash where yumma is taught.
- تسلم: tislam "thanks (to a man)" vs tsallim "you hand over / greet". Write تسلّم with shadda for the second.
- صج ṣij "really" keeps ج (natives write صج 2476/3162 vs صق 3/0): a deliberate exception to the ق rule, like الفريج.
- طب: ṭibb "medicine" (the item, s2u003) vs UAE ṭabb "came in, entered" vs Egyptian/Levantine ṭab "OK" (never use). Teach ṭabb only as a chunk.
- ودنا: widdana "we'd like" vs waddna "take us!" Teach only as a chunk (ودنا نشوفك, ودنا المول).
- تعور: tʿawwir "it hurts (f.)" vs tʿūr (rare). Teach as a chunk: tʿawwirni rāsi / rāsi yʿawwirni.
- ارتاح: irtāḥ "he rested" vs artāḥ "I rest". Teach as a chunk (artāḥ shwayy).
- لفت: lift "lift, elevator" (loan) vs lifat "he turned". Teach il-lift as a chunk with the article.
- غير ghēr "other" vs ghayyar "changed" (teach غيرت); دور dōr "turn, floor" vs dawwar "looked for" (teach دورت); تعرف "you know" vs taʿarraf (teach تعرفت على, 55/36); ودي widdi "I'd like" vs ودى wadda "took" (teach ودني "take me", 219/131).
- ريال (coin) vs ريّال (man): only the shadda separates them, and the linter ignores shadda, so they can't both be items. "Man" is the item (s1u025); the coin goes in notes and dialogue.

## 3. Transliteration

One scheme, always. It is the app's `DIALECT` scheme (index.html), with the y rule added (★). The linter accepts: a–z, A–Z, ā ī ū ē ō, ḥ ṣ ṭ ẓ (and ḍ with a warning), the capitals Ā Ī Ū Ē Ō Ḥ Ṣ Ṭ Ẓ for names, ʿ (U+02BF), ʼ (U+02BC), hyphen, space and ordinary punctuation. Never ʾ (U+02BE), ḏ, ' or 3.

| Sound | Write | Examples | Notes |
|---|---|---|---|
| long vowels | ā ī ū | bāchir, ʿīd, rūḥ | |
| Gulf ay / aw | ē ō | bēt, zēn, yōm, mōl | never ay / aw in Gulf lines, except: geminate -ayy- / -aww- (shwayy, ḥayyāk, sawwa, Dbayy); shay "thing"; law in the stage 1 phrase law samaḥt (elsewhere لو is lō); religious formulas as stage 1 has them (as-salāmu ʿalaykum); the past plural verb ending -aw (rāḥaw, yaw); ay "which/any" (أي); aw "or" (أو); aw kept in maC- nouns (mawʿid, mawẓūʿ) and aCC- plurals and elatives (awlād, awgāt, awrāg, awsaṭ), per the published UAE grammar; ō stays in yōm, mōl, yōṣal |
| short vowels | a i u | shismak, ʿarabi | don't write e or o for short vowels |
| feminine ending ة | -a; **-at in a construct** (before the possessor noun) | gahwa; sayyārat Sēf, ghurfat ubūy, ghalṭat ish-shāṭir | -t before a suffix: sayyārti |
| "his" ـه | -ah (after a vowel: -h) | bētah, ʿindah, ʿaṭāh | keeps it apart from -a |
| ح ص ط | ḥ ṣ ṭ | ḥilu, ṣabāḥ, ṭālib | |
| ض and ظ | ẓ for both | tfaẓẓal, abyaẓ, il-mafrūẓ | ḍ triggers a lint warning |
| ع / hamza | ʿ / ʼ | ʿindi; masāʼ, shāʼ allāh, b-raʼyi, liʼann | no ʼ at the start of a word (ana, abi, idhnak) |
| خ غ ش ث ذ | kh gh sh th dh | khalāṣ, ghāli, thalātha, hādha, idha | never ḏ |
| ق | g; j where Gulf says j; q only in religious or formal words | gahwa, garīb, jiddām; qurʼān | |
| ك | k; ch only where Gulf really says ch | kitāb; bāchir, simach, cham, -ich | ch is learned word by word (S: lexical, not a rule) |
| ج / ي | ج is j, or ch in the listed words جي, جذي, جان (§2 exceptions); ★ ي spells the Gulf y-sound and is y | jāmʿa, masjid; chī, chidhi, chān; yāy, yidīd, rayyāl, yīt | ★ addition to DIALECT |
| geminates | doubled letters | sawwa, rayyāl, ḥammām | |
| article | il-; l- after a vowel; doubled before sun letters (t th d dh r z s sh ṣ ẓ ṭ l n) | il-bēt, is-sūg, ish-shams, fi l-jāmʿa, maʿa s-salāma | ق (g), ك (ch), ج (j) and ي (y) are moon letters: il-gahwa, il-jāmʿa, il-yidīd |
| imperfect prefix | no vowel before a long-vowel or doubled stem; yi- / ti- / ni- before a consonant cluster | ygūl, trūḥ, ygūlūn, yḥuṭṭ; yishrab, titkallam, nishtaghil | stage 1 (tgūl, trūḥ, titkallam) |
| future b- | joined, no hyphen | barūḥ, bitrūḥ, binrūḥ, biyrūḥ, biykūn, bakūn | stage 1, DIALECT |
| preposition b- | hyphen | b-cham, b-khēr, b-ʿishrīn | stage 1 |
| "and" | w as its own word | w inta, w il-ḥsāb | stage 1 |
| dative l- + suffix on a verb | hyphen | gūl-li, gilt-lah, ṭarrish-li, ṣār-li | S (agul-lich) |
| suffixes | joined; hyphen only where letters would read as a digraph | bētak, ʿindich; bēt-ha, ʿind-hum | DIALECT |
| negator ما | ma | ma adri, ma fī, ma barūḥ | DIALECT, GRAMMAR table. Long mā only in mā shāʼ allāh and the stage 1 formulas mā gaṣṣart and mā sawwēna shay (kept as taught) |
| "no", prohibitive | la | la, la trūḥ | stage 1 |
| God | allāh, lower case | in shāʼ allāh, allāh ykhallīk | |
| capitals | lower case, also at sentence start; capitalise names and places only | Sēf, Dbayy, il-Kwēt | stage 1 |
| English loans | Gulf pronunciation, not English spelling | ōkē, tāksi, mōl, tilifōn | |

**Reused phrases keep their first transliteration.** A phrase already taught as an item is copied verbatim (script and transliteration) when it reappears in a later dialogue.

## 4. Gender, number and the learner

- **From s1u017 on, the learner is always speaker B**, a young British man studying and interning in Dubai (his Arabic name in u3 is Sālim). In stage 1 the role varies (the learner is A in u4, u7, u11–u14), so the B-line checks don't apply there. B's own forms are masculine (ṭālib, rāyiḥ, āsif). A addresses B as a man.
- **Items are given in the masculine singular by default.** The English says **(to a man)**, **(said by a man)** or **(a man)**, and the note gives the woman's form first: `to a woman: shḥālich (شحالج)`, `a woman says: āsfa (آسفة)`, `a woman: rāyḥa`. The linter warns if "(to a man)" has no "woman" in the note.
- **The reverse:** when the lesson's point is the feminine form, the English says **(to a woman)** and the note gives `to a man: …`. Teach the woman's form as its own item only for very frequent phrases (how are you, thanks, do you want, you know).
- **Plurals:** English **(to a group)**, note `to one man: …; to one woman: …`. Default plural forms are the merged ones: intu, -kum, hum, -ūn (S). Feminine plurals (intin, -kin, -in) are recognition only, in notes, from B1.
- **The learner must produce feminine and plural forms.** From s1u018 on, at least one dialogue in three has B speaking to a woman (Maryam, Umm Sēf, Nūra) or to a group, so B's own lines carry -ich, -īn and -ūn.
- **"I" has one form for both sexes in verbs:** riḥt, rijaʿt, khallaṣt are said by men and women alike; -ti is only "you" to a woman (riḥti "you (f.) went"). Never write "a woman says: …ti" for a first-person verb. Only adjectives and participles change (āsif/āsfa, rāyiḥ/rāyḥa).
- **Every second-person form must match its addressee in that line:** -ak / t-verb for a man; -ich / t-…-īn for a woman; -kum / t-…-ūn for a group. The English gloss must match too ("you (f.)" where it isn't obvious).

## 5. Variants and labels in notes

- **Note column order:** gender counterpart; then regional variants; then a usage hint. Separate with "; ". Example: `to a woman: tabīn; UAE also: tabā (تبا); Saudi: tabgha`.
- **Region names, in this order:** UAE also:, Kuwait:, Saudi:, Qatar:, Bahrain:, Oman:, Abu Dhabi:. Use the full name, as stage 1 does ("Kuwait: mū (مو)").
- **Script in brackets** after the transliteration the first time a variant is shown, optional after that.
- **"you'll see written X"** for native spellings that differ from the course's: باجر, الي (for اللي), فمان الله, چاي, مافي, برع, انته, اتريا, and the fast-speech spellings مدري (ma adri, 1975/1044) and شالله (in shāʼ allāh, 1384/958).
- **Fast speech:** when a reduction is common (ʿshān for ʿashān, madri for ma adri, shallah, aani for yaʿni, S: The National), note it as "fast speech: madri". The item keeps the full form.
- **In the English column** use these register labels in brackets: (friends only), (respectful), (formal), (old-fashioned), (UAE), (Kuwait), (Saudi). Rude, taboo or insulting words are **never items**. They go in a note or the culture field marked "don't use": چب, باية, زقوم, مالت عليك, the oaths عليّ الحرام / عليّ الطلاق, animal insults.

## 6. Register

- **Colloquial by default.** Every Gulf line is what a Dubai friend, colleague or shopkeeper would actually say.
- **Religious formulas are not "formal".** السلام عليكم, الحمد لله, إن شاء الله, ما شاء الله, عظم الله أجركم and the Ramadan and Eid formulas are normal everyday speech.
- **Formal or fuṣḥā-flavoured forms are taught only on purpose and always labelled (formal):** "educated spoken" vocabulary from B2 and the register-shift units in C1. A formal form never replaces a colloquial default in an ordinary dialogue. (لأن is everyday Gulf, not formal: لان 506:879 pm, لاني and لانها in the top 500. ʿashān stays the taught default.)
- **Politeness level follows the person addressed.** Elders and strangers get allāh ykhallīk, ṭawīl il-ʿumr, yā ʿammi; friends get yā rayyāl, khēba, English loans. يا ريّال to an elder or in a meeting is "a major social faux pas" (S, The National).
- **Code-switching** (English words, ōkē, bro, sorry) belongs in peer dialogues among young people only. Elder and formal scenes stay unmixed (S, Gulf News).

## 7. Writing natural dialogues

1. **Short turns.** A1 lines 1 to 7 words (one-word formula replies allowed, as in stage 1); A2 up to 10; B1 up to 12; B2 and C1 up to about 16, but keep at least half of B's lines at 2 to 8 words, because those become sentence-building cards. 200 characters maximum (lint).
2. **Line counts:** A1 4 to 6 lines, A2 5 to 7, B1 6 to 8, B2 and C1 7 to 10. A lesson takes about 10 minutes, so don't go longer.
3. **Real settings.** Dubai first: a karak stand, the metro, a mall, the office, a university corridor, a majlis in Sharjah, a desert camp, a pharmacy, a WhatsApp voice note. Kuwait from B1 (a trip with Fahad). Use real public places (Dubai Metro, Deira, the Avenues) but never invent facts about real organisations or people.
4. **Fixed cast** (FRAMEWORK §2). Name tells origin, so reviewers can check each line against its speaker. When A is not a cast member, A is a default-variety Emirati speaker; name the role in the goal ("Order from a café worker").
5. **Every item appears in the dialogue,** exactly or with an ending changed. At most two items may be absent, and only if each is the counterpart (other gender, plural, opposite) of an item that does appear. Receptive items (§13) appear in A's lines.
6. **Mostly known words.** The linter warns when more than 35% of dialogue words are neither known nor in this lesson's items. Aim for under 20% at A1–A2, 25% at B1–B2, 30% at C1. Allowed extras: names, numbers, place names, words the English context makes obvious.
7. **No translationese.** Write the scene in Gulf first, then gloss it in English. Never translate an English script line by line. Gulf people answer "how are you" with formulas, not with information. They say "yalla", not "OK, let us go now".
8. **Social formulas come with their reply** in the same dialogue (FRAMEWORK §7).
9. **One point per lesson, recycled in the dialogue at least twice.**
10. **English gloss:** natural English, same gender and number as the Arabic, no word-for-word glossing. Use brackets for what English needs but Arabic leaves out: "(It's) twenty dirhams."
11. **Gulf norms for a male learner (course-lead ruling).** B is an unmarried young man. He is never alone socially with an unrelated woman: no one-to-one coffee, walks, meals or cooking with Maryam, Umm Sēf, Nūra or other women. Maryam is a colleague: meet her at work, in a group, or in a public place with others; Umm Sēf hosts only when Sēf or the family is present, and B's dealings with her are brief and respectful (he asks after her, she asks after his family). Invitations to homes come through the men (Sēf, Bū Rāshid). Phone and work messages between B and a woman stay polite and to the point.
12. **No fabricated facts.** No invented holidays, laws, prices given as current fact, office procedures or quotes from real people. When a fact is needed (weekend days, visa steps), mark it U in the review sheet and send it to the native queue.

## 8. The fuṣḥā column (item field 4)

- **What it holds:** the ordinary fuṣḥā equivalent a reader would meet in news or on a sign, in Arabic script. Identical words are repeated (السلام عليكم → السلام عليكم; شركة → شركة).
- **No vowel marks,** except the minimum that shows gender or a needed case ending (أنتِ, عندكَ, كيف حالكِ؟), as in stage 1. Tanwīn is fine here (شكرًا, جدًا), because this column is fuṣḥā.
- **Two equivalents** at most, separated by " / " (جدًا / كثيرًا).
- **Leave it ""** for Gulf formulas, interjections, slang, loans and names with no fuṣḥā counterpart (هلا والله, الله يحييك, خيبة, اوكي).
- **Never** put a Gulf form, a definition or Latin letters in it. The linter errors if the field isn't Arabic.

## 9. Changes this sheet needs in the app and linter

1. **`DIALECT` constant (index.html). Done.** Arabic-script rule: replace "keep ق for the g sound and ك for k (باكر is said bāchir)" with "keep ق for the g sound and ك for k (باكر is said bāchir); write ي where Gulf speakers say y in dialect words (ياي, ريّال, يديد, يالس) and keep ج where the word is said with j (جامعة)". Transliteration: replace "ج as j" with "ج as j; ي as y". Dialect rules: add "Emirati forms are the default: hē (yes), niḥin (we), shḥālak (how are you), chī (like this), hādhēla (these); Kuwaiti shinu, mū, iḥna, ēh only from a Kuwaiti character; the learner's stage 1 forms shlōnak, ī, shlōn are always fine".
2. **`GRAMMAR` table.** "I, you, he…": put نحن niḥin first ("we; Kuwait: iḥna"). "This, that…": put هذيلا hādhēla first ("these; Kuwait: hadhōl").
3. **`tools/lint_content.py`. Done:** `receptive` is accepted and checked for valid, distinct indexes. Until the linter also checks it, "stage 4–5 only" and "at most 5 per unit" are reviewer checks (§10 check 11).
4. **The app. Done** (receptive cards, weekly tasks). Items listed in a unit's `receptive` field get only "recognize" and "listen" card modes, never "produce" (see `cardMode`), and are left out of `knownList` (they aren't words the learner is expected to use). B2/C1 `task` text is shown as an optional weekly task, not as part of the day's lesson.

## 10. Reviewer checklist, ranked by how often each error is expected

Apply every check to every Arabic line and item. Ranks 1 to 3 come from documented LLM failure modes (S: AL-QASIDA, AraDiCE, Barmandah 2025); the rest are inferred from Gulf morphology.

| # | Check | Look for | Action |
|---|---|---|---|
| 1 | **MSA leakage** | Hard list: سوف, لن, ليس/ليست, لم + verb, الآن, جدا, فقط, يجب, منذ, عندما, هذه, ذلك, تلك, هؤلاء, الذين, الذي, التي, حيث, خلال, لقد, يوجد, لدى, كذلك, لذلك, بينما, أيضا, كثيرا, أريد, ماذا, لماذا, حسنا, لكي, إنني, ربما, إنما, لعل; case endings or tanwīn; أنا لا أفهم-type sentences. Soft list (fine in fixed phrases or (formal) lines only): هل, كيف حالك, نعم, قد | Hard: rewrite. Soft: justify or rewrite. Gumar hits on these words come from narration and do not count as evidence (e.g. اريد 2170/347, هذه 934/585) |
| 2 | **Over-formal politeness** | هل يمكنك…, من فضلك chains, شكرًا جزيلًا in speech, textbook greetings | Use لو سمحت, ممكن…؟, عطني, الله يخليك, مشكور, ما قصرت |
| 3 | **Egyptian or Levantine leakage** | Hard: عايز, عاوز, بدّي, بدك, دلوقتي, هلق, كده, هيك, ازيك, كيفك, منيح, كويس, فين, ما…ش, ح- future, عم + verb, بـ as present tense, استنى. Soft (they occur in Gulf novels): مش (Abu Dhabi only, tagged), ليه, مين, معليش (soft in A's lines only; it is a stage 1 item and always fine for B), شو in a Kuwaiti's line | Hard: rewrite. Soft: change to default unless the speaker's origin justifies it |
| 4 | **Wrong person, gender or number** | -īn missing for a woman (تقولي for تقولين), -ūn missing for a group, ـك where ـج is meant, masculine adjective for a woman speaker, English gloss with the wrong gender | Fix to agree with the addressee in that line |
| 5 | **Regions mixed inside one speaker** | مب with شنو, هيه with إحنا, Kuwaiti اهو in an Emirati's line | Make the line match the speaker's origin |
| 6 | **Invented or unattested form** | attest.py gives under 3 hits for a word, or 0 for a two-word phrase. For y-words, look up the ي spelling and cite it | Exact-string web search for Gulf hits; still nothing → native queue, and it can't ship as an item |
| 7 | **Calque from English** | "have a nice day" translated literally, English word order, "I am feeling…" | Ask "would a Dubai local say this here?" Rewrite from the situation |
| 8 | **Transliteration off-scheme** | wayid/waayed, č, ḏ, ʾ, q for a Gulf g, ay/aw in Gulf words, ḍ, missing hyphen on il-, b-ykūn | Fix to §3 |
| 9 | **Script, transliteration and English disagree** | قال with qāla, gloss "you (m.)" over a ـج form, جديد written but yidīd transliterated | Fix so all three say the same thing |
| 10 | **Cultural or factual fabrication** | wrong formula reply (السلام عليكم → الله يسلمك is wrong), invented customs, wrong weekend days, invented quotes | Check against FRAMEWORK §7 and sources; U → native queue |
| 11 | **Course structure** | a phrase taught twice (lint error), a bare homograph (§2), an item missing from the dialogue beyond the allowed two, over-length fields, more than one new grammar point, a rude word as an item, a tip that "corrects" a stage 1 form, a receptive item in B's line, `receptive` outside stage 4–5 or more than 5 per unit | Fix before merge |

**Order of work for every batch:** (1) `python3 tools/lint_content.py N` with zero errors; (2) `python3 tools/lint_content.py N --gumar` and `python3 /home/claude/gulfcheck/attest.py unit <file>`, with every "check" flag either fixed or justified in the review sheet; for every y-word, cite the ي-spelling count and the ج-spelling count; (3) two blind reviewers, one hunting leakage (checks 1, 3, 5), one judging naturalness and register (checks 2, 7, 10); (4) any disagreement, unattested form or U item goes to the native queue. Nothing marked U ships as an item until a native confirms it.

## 11. DEFINITE ERROR, VARIANT or FINE

**DEFINITE ERROR** (must be fixed; the lesson can't merge):
- any hard-list MSA or Egyptian/Levantine word in a Gulf line (outside a line labelled (formal) or a fixed religious formula);
- a second-person or first-person form that doesn't agree with the speaker or addressee in that line;
- missing -īn / -ūn where Gulf requires them;
- script, transliteration and English that say different things;
- transliteration outside the scheme, چ or گ in an Arabic field, final ه for ة, vowel marks or tanwīn in a Gulf line;
- two countries' variants in one speaker's line, or a Kuwaiti or Saudi variant in B's line (B's stage 1 forms شلونك / شلونج, إي, شلون and معليش are not variants for this rule: they are always fine);
- a wrong fixed reply to a social formula;
- a phrase already taught, a bare homograph, a lint error, or a rude or taboo word as an item;
- a form with zero corpus hits and no other source, shipped as an item;
- an invented fact presented as true.

**VARIANT** (not wrong Arabic, but not the course's choice):
- a real Gulf form from another country or emirate (شنو, مو, إحنا, هب, عقب, أبا, بسير) in a default speaker's line → change it to the default, move it to the note, or give the line to a speaker of that origin;
- a native spelling that differs from §2 (باجر, الي, ابا without hamza, مافي, جاي for yāy, ريال without shadda for "man") → change to the course spelling and note "you'll see written …";
- a more conservative form (intin, hin, feminine plural verbs) → note only, from B1.

**FINE** (don't flag):
- the learner's stage 1 forms (شلونك / شلونج, إي, شلون, معليش) in B's lines, anywhere in the course;
- words shared with fuṣḥā that Gulf also uses in speech: كيف chēf, بعد, قبل, كل, لو, إذا, لأن lann, لكن, ثم, شركة, الجامعة;
- English loans and code-switching in peer dialogues among young people;
- the soft-list words in a fixed phrase, in a (formal) line, or in a speaker whose origin uses them;
- fast-speech reductions in a note (§5).

## 12. Seed lexicon

Every ruling a reviewer or native speaker makes (form, course spelling, transliteration, gloss, region tag, register, source, status S/C/U/N) is logged so later lessons are checked against it. The lexicon file does not exist yet; until it does, log rulings in each batch's review sheet. The first entries are the defaults in §1, the exceptions and homographs in §2, and every y-word (with both counts) as it is first used.

## 13. Receptive items (B2 and C1)

From stage 4, a unit may list some items as receptive in an optional field `"receptive": [indices]` (0-based positions in `items`). A receptive item is recognised and heard in reviews, never asked for in production. Plan about 3 per B2 lesson and 4 per C1 lesson; never more than 5.
- **Make receptive:** proverbs, heritage and old-fashioned words, formal or fuṣḥā-flavoured vocabulary, Saudi, Qatari, Bahraini and Omani forms, slang the learner shouldn't use with strangers, and low-frequency words.
- **Keep productive:** anything the learner needs to say in that lesson's situation, and every function phrase (agreeing, conceding, hedging).
- Receptive items still count as taught (teach-once applies), still appear in the dialogue, and appear only in A's lines. Prefer A lines over 8 words for them, so the app doesn't make a sentence-building card from the line.
- The English gloss is the same as for any item. Add "(recognise)" to the note.
- The linter and app need the changes in §9 before the first stage 4 batch.
