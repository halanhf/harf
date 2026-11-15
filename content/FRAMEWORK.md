# Harf course framework: scope and sequence, zero to C1

This is the plan that about 470 lessons are written and checked against. `STYLE.md` says how every line is written; this file says what goes in which lesson. Evidence keys are the same as in `STYLE.md`: **S** sourced, **C** attested in Gumar AE/KW (raw counts AE/KW, checked with `attest.py`), **U** unsourced, needs a native check, **[weak]** thin evidence, **E** design estimate. The main basis is `/home/claude/reports/Gulf Arabic course to C1.md`. Revised after `content/review/framework_review.md`; §15 answers the review.

**What the course can and can't do.** 466 lessons at about 10 minutes each, inside a 30-minute day, is roughly 230 hours of structured work. An English speaker probably needs 2,200 to 3,200 hours to reach C1 in Arabic (E, report). So stages 1 to 3 (A1 to B1) are self-contained, and stages 4 and 5 (B2, C1) are scaffolding: they add receptive items and optional weekly real-world tasks, and the hours spent on real input and conversation do most of the work.

## 1. Stages at a glance

| Stage | CEFR | Unit ids | Units | Items per normal lesson (receptive) | Items in stage | Productive / receptive | Cumulative items | Weekly tasks | Fuṣḥā batches | Readings |
|---|---|---|---|---|---|---|---|---|---|---|
| 1 | A1 | u1–u16 (existing) + **s1u017–s1u066** | 16 + 50 = **66** | 9 (0) | 140 + 435 = 575 | 575 / 0 | ~575 | — | F00 (44, shipped) + F01–F03 | R1: 12 |
| 2 | A2 | **s2u001–s2u090** | **90** | 9 (0) | ~790 | 790 / 0 | ~1,370 | — | F04–F07 | R2: 16 |
| 3 | B1 | **s3u001–s3u110** | **110** | 9 (0) | ~960 | 960 / 0 | ~2,330 | — | F08–F12 | R3: 20 |
| 4 | B2 | **s4u001–s4u110** | **110** | 9 (about 3) | ~960 | ~660 / ~300 | ~3,290 | 22 (every 5th unit) | F13–F17 | R4: 20 |
| 5 | C1 | **s5u001–s5u090** | **90** | 9 (about 4) | ~790 | ~460 / ~330 | ~4,080 | 18 (every 5th unit) | F18–F20 | R5: 14 |
| | | | **466** | | | **~3,450 / ~630** | **~4,080** | **40** | **1,000 words** | **82** |

**Daily time budget (course lead):** about 30 minutes: **one lesson ≈ 10 minutes, reviews ≈ 15, speaking ≈ 5** (role-play of the lesson's B lines, or the app's Talk partner). Reviews come first; if they run long, the new lesson waits for the next day. A lesson brings at most 9 new item cards plus its 2–8-word dialogue lines as sentence cards (E: up to about 15 new cards a day), which is what keeps reviews near 15 minutes. B2 and C1 `task`s are **weekly and optional**, done outside the 30 minutes. Receptive items cut production effort, not the number of reviews, so once reviews build up expect about 5 new lessons a week rather than 7 (E): the 466 lessons then take about 1.8 years at 30 minutes a day.

**Item arithmetic.** The app allows 5 to 9 items per unit, and each phrase is taught once in the whole course. About 4,080 items in 466 units needs **9 items in every normal lesson** (8 is the floor) and **6 in checkpoint and exit lessons**. Items may be words or chunks ("ما أدري وين", "على طول"). From B2 a lesson may mark some items **receptive** (optional field `"receptive": [indices]`, STYLE §13): about 3 per B2 lesson and 4 per C1 lesson, so the productive load drops to about 6 and 5 there, as the report advises ("met by receptive learning … not by overloading production drills"). Productive total ≈ 3,450 items; receptive ≈ 630, plus what tasks and the fuṣḥā track add. All figures are E.

**Per-stage lesson shape.**

| Stage | Dialogue lines | Words per line | Grammar label | culture field | task field | New, unglossed dialogue words |
|---|---|---|---|---|---|---|
| A1 | 4–6 | 1–7 | most lessons | 1 lesson in 3 | — | ≤20% (lint warns at 35%) |
| A2 | 5–7 | 2–10 | most lessons | 1 in 3 | — | ≤20% |
| B1 | 6–8 | 3–12 | grammar blocks; "recycle: …" in function blocks | 1 in 2 | — | ≤25% |
| B2 | 7–10 | 3–16 (half of B's lines 2–8) | as B1 | 1 in 2 | every 5th unit | ≤25% |
| C1 | 7–10 | 3–16 (half of B's lines 2–8) | as B1 | 1 in 2 | every 5th unit | ≤30% |

**Checkpoints** come every 6 to 18 units (numbered per stage: checkpoint 1.1, 1.2 …). The dialogue recycles the block's items in a new scene. The 6 items are things the block needed but didn't teach: group or other-gender forms of a frequent phrase, a collocation, or (from A2) a labelled regional variant. A checkpoint never re-teaches a phrase.

**How to read the "new items" cells below.** Forms before "recycle:" or "reuse:" are new items for that block. Forms after it were taught earlier: use them in the dialogue, never as items.

## 2. Cast and settings

Names carry origin, so reviewers can check each line against its speaker.

| Name | Script | Origin | Sex, age | Role | Register with the learner | From |
|---|---|---|---|---|---|---|
| (learner, B) | — | British, Muslim (fasts in Ramadan, prays; from s2u061), studying and interning in Dubai | man, ~20, unmarried; family in London: mum and dad, three older brothers, one older married sister (her husband and kids also in London); B is the youngest | always speaker B from s1u017; Arabic name Sālim if needed (u3) | — | s1u017 |
| Sēf | سيف | Emirati, Dubai | man, 22 | university friend | friends: yā rayyāl, khēba, English loans | s1u017 |
| Maryam | مريم | Emirati, Dubai | woman, 26 | colleague at the internship | polite, neutral; B practises -ich / -īn with her | s1u018 |
| Umm Sēf | أم سيف | Emirati, Dubai | woman, ~50 | Sēf's mother | respectful | s1u021 |
| Bū Rāshid | بو راشد | Emirati, Sharjah | man, ~60 | Sēf's uncle, majlis host | respectful: yā ʿammi, ṭawīl il-ʿumr | first named in stage 2 (no stage 1 unit names him); host from s2u063 |
| Rāshid | راشد | Emirati, Sharjah | man, 17 | Bū Rāshid's son | youth speech, slang | s4u090 |
| Fahad | فهد | Kuwaiti, Kuwait City | man, 24 | Sēf's friend; Kuwaiti forms | friends | s2u027 |
| Nūra | نورة | Kuwaiti | woman, 28 | Fahad's sister, met on the Kuwait trip | polite | s3u090 |
| unnamed A | — | default urban Emirati | any | shop, café, taxi, clinic, office staff; name the role in the goal | neutral | any |

Settings, Dubai first: karak stand, Dubai Metro, a mall, the office, a university corridor, Sēf's family home, Bū Rāshid's majlis in Sharjah, a winter desert camp, a pharmacy, a clinic, a bank, WhatsApp voice notes. Kuwait (a trip with Fahad) in s3u090–s3u095. Real public places may be named; facts about real organisations, prices or procedures may not be invented.

## 3. Stage 1 (A1): s1u017–s1u066, 50 new units

**Already taught in u1–u16 (never re-teach; reuse freely):** السلام عليكم, وعليكم السلام, هلا, هلا والله, شلونك, شلونج, زين, الحمد لله, الله يسلمك; صباح الخير, مساء الخير, آسف, سامحني, معليش, ما أتكلم عربي زين, لازم, في أمان الله, مع السلامة; إي, لا, مشكور, العفو, لو سمحت, تفضل, ما فهمت, شوي شوي, عيد مرة ثانية; ممكن, عطني, الله يخليك, ما قصرت, وين الحمام, هناك, عن إذنك, عندك, شو يعني؟; شسمك, اسمي, انت, انتي, من وين, أنا من, أدرس, هني, تشرفنا; طالب, أشتغل, وين تشتغل, الشرف لي, شركة, الجامعة, شغل; وين, شو, ليش, منو, متى, سيدا, يمين, يسار, قريب; أقدر, ما أقدر, أعرف, ما أعرف, تتكلم, عربي, أتعلم, شوي, تقول; في, ما في, مب, مب زين, مب مشكلة, ما أدري, بارد, حار, عصير; واحد … عشرة, عشرين, ثلاثين, خمسين, مية, ميتين, ألف, درهمين, بكم, كم, غالي, رخيص, وايد, هذي, سعر, آخر سعر, الساعة; أبي, تبي, قهوة, شاي, ماي, تمر, بس, الحساب, عيش; الحين, اليوم, باكر, أمس, بعدين, رايح, أروح, بروح, يلا; شلون, لف, وقف هني, خلاص, بعد شوي, الساعة كم, تاكسي; حياك الله, الله يحييك, يعطيك العافية, الله يعافيك, ما شاء الله, إن شاء الله, حلو, عساك بخير, ولا يهمك, عندي. Grammar already met as chunks: no copula, ʿind-, ma / mub, modal + bare verb, b- future, rāyiḥ, imperatives liff / waggif, the dual -ēn.

| Units | Grammar point (the `grammar` label) | Functions and situations | Domain | New items (then recycle / reuse) | Culture |
|---|---|---|---|---|---|
| s1u017–s1u020 | Independent pronouns, full set (ana, inta, inti, huwa, hiya, niḥin, intu, hum); no copula recycled | Emirati greetings and how-are-you; greeting a woman, a group, an elder; asking about someone (huwa wēn?) | people | شحالك, شحالج, هيه, والله ("really? / honestly"), طيب, مرحبا الساع, شو اليديد, ما شي, هلا بك, هلا فيك, شخبارك, نحن, هو, هي, هم, انتو; reuse: شلونك, إي (fine for B) | greeting order and handshakes between men and women (U) |
| s1u021–s1u026 | Possessive endings on nouns (-i, -ak, -ich, -ah, -ha, -na, -kum, -hum); ة → t before an ending; the construct (sayyārat Sēf, bēt ubūy); ḥagg- "belonging to, for" (māl- in a Kuwait note) | family: who's who, photos, how many brothers and sisters; whose is this? | family | حق, حقي, أمي, أبوي, أخوي, أختي, إخواني, خواتي, عيال, ولدي, بنتي, ريّال, ويا "with", كل; plural-looking family words taught as vocabulary | mā shāʼ allāh when praising children (S); asking after family without naming a man's wife (U) |
| s1u027–s1u031 | The article and sun letters; adjectives after the noun and agreement (m., f., plural -īn); demonstratives near and far (hādha, hādhi, hādhēla, hādhāk, hādhīch); hal- + noun (hal-bēt, hal-marra) | describing people, things, clothes and the home; this one or that one? | home, clothes | جي (UAE default), جذي (wider Gulf), هذاك, هذيك, هذيلا, شي, هالشي, هالمرة, يعني ("I mean"), غرفة, كبير, صغير, يديد | kandūra and shēla as culture words, not core vocabulary (C: كندورة 13.7 pm) |
| s1u032 | checkpoint 1.1 | a visit to Sēf's family recycles s1u017–s1u031 | — | 6 group forms: شحالكم (150/0), حياكم الله (43/43), مشكورين (26/24), عساكم بخير (18/8), تفضلوا, الله يسلمكم; no Kuwaiti items | — |
| s1u033–s1u038 | **Past tense I:** sound verbs, first I and you (shirabt, shirabt, shirabti), then he, she, we, you all, they; ma + past | what did you do yesterday? arriving late; a short past-tense question and answer | daily life | البارحة, قبل, أول ("first, before"), رحت, راح, وصلت, رجعت, شربت, كتبت, ما رحت; reuse: ما فهمت | — |
| s1u039–s1u042 | **Past tense II:** hollow (gilt, shift, kint, nimt), defective (sawwēt, ligēt, mishēt), doubled (ḥaṭṭēt), hamzated (kalt, khadht), "came / brought" (yīt, yibt) | what happened? telling one small event; good news | events | شو صار؟, قلت, شفت, سويت, ييت, يبت, لقيت, ما يا, مبروك, الله يبارك فيك | — |
| s1u043 | checkpoint 1.2 | Sēf tells B about his weekend | — | 6 items (other-person forms of the past chunks) | — |
| s1u044–s1u047 | Numbers 11–19 (U), counted nouns after 11 (singular); days of the week (S); parts of the day; telling the time with w-nuṣṣ, w-rubʿ, illa rubʿ (U) | making an appointment; what time do you finish? which day? good night | time | يوم الجمعة, يوم السبت, الصبح, العصر, الليل, مرة (chunk only, §2), ثاني, نص, وربع (never bare ربع, STYLE §2), تصبح على خير, وانت من أهله | prayer times as the frame of the day; the UAE and Kuwaiti weekends (U: confirm current days) |
| s1u048–s1u051 | Imperatives of core verbs, man, woman and group (taʿāl, taʿāli, taʿālu; rūḥ; shūf; khallni); la + verb for "don't" to a man (la trūḥīn, la trūḥūn as chunks) | asking someone to come, wait, look, bring, leave it | home, help | تعال, تعالي, خلني, شوف, تريا (UAE), ييب لي, لا تروح, لا تروحين | — |
| s1u052 | checkpoint 1.3 | errands with Maryam: requests and past events | — | 6 items | — |
| s1u053–s1u056 | Modal + bare imperfect for I and you, as chunks (abi arūḥ, tabi trūḥ, tabīn trūḥīn, agdar, tigdar); he / she forms wait for s2u001 (S: no linking particle) | wants, abilities and likes; offers; maybe and of course | plans | يمكن, أكيد, طبعا, عادي, عشان ("because"), ما أبي, تبين؟, أحب, ما أحب, عاجبني | — |
| s1u057–s1u060 | recycle: possessives, past, modals | breakfast, lunch, dinner; the supermarket; ordering food to the house; eating at a friend's | food, home | ريوق, غدا, عشا, دياي, سمك, خبز, أوكي, انزين, صح, بالعافية, تسلم, نعيما, الله ينعم عليك (pair U) | karak tea; eating with the right hand; the host keeps offering (S) |
| s1u061–s1u064 | Prepositions of place (fōg, taḥt, jiddām, wara, ṣōb, yamm, barra) | getting around: metro, bus, walking directions; on the phone: "where are you?" | transport | صوب, قدام, ورا, فوق, تحت, عدل, برا, ياي "coming", المترو, كيف chēf | — |
| s1u065 | checkpoint 1.4 | a day out with Sēf: metro, lunch, directions | — | 6 items | — |
| s1u066 | **A1 exit** | "Describe where I live and people I know" (CEFR A1 spoken production, S) | — | 6 items | — |

## 4. Stage 2 (A2): s2u001–s2u090

| Units | Grammar point | Functions and situations | Domain | New items (then recycle / reuse) | Culture |
|---|---|---|---|---|---|
| s2u001–s2u006 | **Present tense I:** sound verbs, full paradigm with -īn (you, a woman) and -ūn (plural) (S); habitual meaning | daily routine; what do you do every day? | routine | دوم, كل يوم, تدري, تدرين, يشتغل, يدرس; reuse: على طول | — |
| s2u007–s2u012 | **Present tense II:** hollow (ygūl, yrūḥ, yshūf), defective (ysawwi, yimshi, yilga, yaʿṭi), doubled (yḥuṭṭ), hamzated (yākil, yākhidh), "come" (yiyi); object -īh after a vowel (nsawwīh, S) | housework, cooking, the weekly shop | household | يطالع, يسوي, ياكل, ياخذ, يمشي, يحط | — |
| s2u013–s2u016 | **Future b-** full paradigm (bitrūḥīn, binrūḥ, biyrūḥūn), b- optional for future (S); negative ma b- (ma barūḥ); ma rāḥ as a Kuwaiti-leaning variant in notes | weekend plans; promises | plans | بيصير, ما بروح, بنروح, بتروحين | — |
| s2u017 | checkpoint 2.1 | — | — | 6 | — |
| s2u018–s2u022 | **Progressive gāʿid / gāʿda / gāʿdīn** + verb, agrees with the subject; negative mub gāʿid (S); yālis as a UAE variant in notes | phone calls: what are you doing right now? | phone | قاعد, قاعدة, المهم, ألو, لحظة, شو قاعد تسوي؟ | — |
| s2u023–s2u026 | Object endings on verbs (-ni, -ak, -ich, -ah, -ha, -na, -kum, -hum); dative l- + ending (gūl-li, agul-lich, S) | messages, WhatsApp, sending things; at the counter | technology | طرش, رسالة, موبايل (recognise), عطني اياه (27/12); full iyyā- grammar at s4u016; reuse: طرش لي, تلفون | workplace use of ṭarrish (S) |
| s2u027–s2u030 | Kuwaiti forms for recognition (items glossed "(Kuwait)") | Fahad arrives: understanding a Kuwaiti friend | people | شنو, مو, إحنا, إيه (ēh; the tip reminds the learner of ī from u2), ماكو, أكو, يمه, يبه, اهو, اهي, حيل, هذول | Gulf variety: where the UAE and Kuwait differ (S) |
| s2u031–s2u035 | Comparative afʿal + min, azyan (S); superlative (aḥsan wāḥid); mithil + noun "like" | shopping and bargaining; sizes and colours; returns; the restaurant bill | shopping, money | أحسن, أرخص, أغلى, أكبر, فلوس, مثل, شرات (UAE), اشتريت (71/16) | — |
| s2u036 | checkpoint 2.2 | — | — | 6 | — |
| s2u037–s2u040 | kān: "was" (kān fī, kān ʿindi); kān + imperfect for "used to" (S: 67 of 92 habitual pasts); ṣār-li + time "it's been … (for me)" | childhood; how things used to be; how long have you been in Dubai? | the past | كان, كنت, لما كنت صغير, صار لي (329/242) | old Dubai, briefly (C1 goes deeper) |
| s2u041–s2u045 | Time and reason clauses: lamma, awwal mā, baʿad mā, gabil lā (S/C); ʿashān "so that"; lēn "until"; ʿugub mā (UAE); yōm + past "when" (U) | telling the order of a day; why and what for | narration | لين, عقب, بعد ما, قبل لا, أول ما, يوم وصلت (89/17); recycle: عشان (now for purpose) | — |
| s2u046–s2u049 | Relative illi after a definite noun (S); ish-shay illi | study and work: my course, my internship, my manager; "the one who …" | study, work | اللي, اللي صار, الدوام, مدير, دراسة, شغلي; reuse: امتحان | — |
| s2u050–s2u053 | Numbers II: hundreds, thousands, money (dirham, fils; Kuwaiti dinar in notes); ordinals 1st–10th and ākhir (S); months by number (S: shahar tisʿa) and by name (U) | prices, dates, birthdays, appointments | numbers | ثلاث مية, ألفين, ثالث, رابع, عاشر, آخر واحد, شهر; recycle: أول, ثاني | — |
| s2u054 | checkpoint 2.3 | — | — | 6 | — |
| s2u055–s2u058 | recycle: present, past | at the clinic and pharmacy; I'm ill; get well soon; **emergencies**: an accident, calling an ambulance or the police (no invented procedures) | health, safety | تعبان, يعورني, أحس, دكتور, صيدلية, شفيك, خير؟, سلامات, ما تشوف شر, عسى ما شر, إسعاف, حادث, شرطة; reuse: الله يسلمك | — |
| s2u059–s2u060 | **Noun plurals:** sound -īn / -āt, the common broken plurals (bēt → byūt, rayyāl → ryāyīl, bint → banāt, sūg → aswāg, walad → ʿyāl), the dual recycled, plural + adjective agreement (S: gulfarabic.com G.2; published grammar) | describing the city, the neighbourhood and the shops | city | بيوت, رياييل (221/51; you'll see written ريايل), بنات, أسواق, سيارات, محلات, ناس | — |
| s2u061–s2u062 | recycle: plurals | seasons and occasions: summer heat, welcome back, **Ramadan and Eid greetings** | weather, seasons | الرطوبة, الغبار, الحمد لله على السلامة, رمضان كريم, الله أكرم, مبارك عليكم الشهر, تقبل الله, منا ومنكم, عساكم من عواده; reuse: الله يبارك فيك, الحر, البرد | Ramadan and Eid greetings (S: The National); summer life |
| s2u063–s2u067 | recycle: imperatives, object endings | **majlis visit** at Bū Rāshid's: coffee, dates, incense, the long goodbye; addressing elders | hospitality | فنجان, دلة, بخور, طال عمرك, طويل العمر, يا عمي, السموحة, مسموح, ما عليه (tip: "you'll also hear maʿlēsh"), حبيبي (register note) | the finjān shake to refuse more coffee (S); the long goodbye (S); yā rayyāl is for friends only (S); كثر خيرك as a polite refusal, recognise only until a native confirms it (S Wiktionary; C 3/0) |
| s2u068–s2u071 | ḥabbēt + verb "I'd like to" (S); widdi; khal / khallīna + verb "let's" (C) | invitations: accepting, declining, suggesting | social plans | حبيت, ودي, يصير؟, أبشر, على هالخشم, على راسي; reuse: خلنا | in shāʼ allāh as a soft "maybe" (S) |
| s2u072 | checkpoint 2.4 | — | — | 6 | — |
| s2u073–s2u076 | recycle: kān, illi | feelings and reactions | emotions | زعلان, معصب, مستانس, خايف, صج؟, حرام عليك, ما صارت, خيبة (friends only), الله يهداك | teasing among friends vs with strangers (S: khēba) |
| s2u077–s2u080 | discourse markers; fast-speech note (madri, shallah, aani, ʿshān, S: The National) | telling news; "so then…"; "mind you…" | conversation | عاد, عيل, ترا, أصلا, شكله, ماشي | — |
| s2u081–s2u084 | Negatives with nobody and nothing: maḥḥad, ma shay, wala shay, wala wāḥid; abad; māni | complaints and "no way" | conversation | محد, أبد, ماني, غصب, ولا واحد, ولا شي | — |
| s2u085–s2u087 | "just", "still", "should have" as chunks: tawwni (C), lil-ḥīn (C), chān gilt-li (S; full grammar at B2) | catching up; mild blame | conversation | توه, توني, للحين, جان قلت لي | — |
| s2u088 | Emirati alternatives (items glossed "(UAE)") | everyday Emirati forms you'll hear from Sēf and Maryam | people | أبا, تبا, هب, الحينه, يرمس, بسير, يالس; عسب in a note only | — |
| s2u089 | checkpoint 2.5 | — | — | 6 | — |
| s2u090 | **A2 exit** | "Describe my family, living conditions, education and job" (CEFR A2, S) | — | 6 | — |

## 5. Stage 3 (B1): s3u001–s3u110

| Units | Grammar point | Functions and situations | Domain | New items (examples; then recycle) | Culture |
|---|---|---|---|---|---|
| s3u001–s3u006 | **Active participles:** yāy, nāyim, msāfir (near future), ʿārif, fāhim, shāyif, msawwi; meaning depends on the verb class (S examples; class rules U) | on the way somewhere; travel plans; "I've already eaten" | travel | نايم, عارف, فاهم, شايف, مسوي; recycle: ياي, رايح, مسافر | — |
| s3u007–s3u011 | **Past progressive** kān gāʿid; inceptive gām + verb (gāmat taktib, S); kān rāḥ "was about to" (S); kint b- "was going to" | telling small incidents with background | storytelling | كان قاعد, قام يضحك, كنت بقول لك; recycle: قاعد | — |
| s3u012 | checkpoint 3.1 | — | — | 6 | — |
| s3u013–s3u018 | **Conditionals:** idha + perfect (S); lō hypothetical (S); ḥatta lō "even if" (C); ilā "if" (UAE / Bedouin) in notes | offers, advice, plans with conditions | plans | لو عندي, حتى لو; reuse: إذا تبي | — |
| s3u019–s3u023 | **Reported speech:** gāl inn- + ending (S: gilt-li innak msāfir); direct quotation; no tense backshift (U) | passing on messages; office gossip | work | قال إنه, يقولون إن, سمعت إن | — |
| s3u024–s3u027 | **Indirect questions:** ma adri wēn…, gūl-li shu…, idha "whether" (U) | asking for information politely; at a service counter | services | ما أدري وين, تدري شو, اسأله إذا | — |
| s3u028 | checkpoint 3.2 | — | — | 6 | — |
| s3u029–s3u034 | **Form II verbs** (doubled middle letter), taught as inflected chunks: yṣalliḥ, ghayyart, waddni, dawwart, khallaṣt, ngawwi (S) | tasks at work; fixing things | work | يصلح, غيرت, ودني, دورت, خلصت, الله يقويك (U); recycle: سويت, طرش | office hierarchy and politeness |
| s3u035–s3u040 | **Forms III, V, VI** as chunks (sāʿidni, sāfart; tʿawwadt, tʿarraft ʿala; tʿāwanna) (U for Gulf examples) | government and services: appointments, forms, help; **renting a flat, opening a bank account** (no invented procedures) | services | ساعدني, تعودت, تعرفت على, إيجار, حساب بنك; reuse: سافرت | — |
| s3u041–s3u045 | **Forms VII, VIII, X** (ingiṭaʿ, iḥtāj, ittiṣal, istaʿmal, istānas) (U) | travel problems: lost luggage, a cut-off phone, hotel complaints | travel | انقطع, أحتاج, اتصلت, استعملت, استانست; recycle: اشتريت | — |
| s3u046 | checkpoint 3.3 | — | — | 6 | — |
| s3u047–s3u051 | **Passive participle and verbal noun** (mamnūʿ, mashghūl, mitʿawwid; dirāsa, sawāga) (placement S, Gulf forms U) | rules and signs; busy and closed; hobbies | daily life | ممنوع, متعود, سواقة; recycle: مسموح, مشغول, مسكر | — |
| s3u052–s3u056 | **Permission and obligation:** ma yṣīr (C), ʿēb, ḥarām, il-mafrūẓ (C), lāzim ma vs mub lāzim (U scope), yabā-lah "it needs" (C: يباله 192/2) | etiquette, rules, what's allowed | etiquette | عيب, المفروض, مب لازم, لازم ما, يباله; recycle: يصير؟, ما يصير | mosque and majlis etiquette; ʿēb as a social word |
| s3u057–s3u060 | **khalli + object + verb** "let X do" (C): khallah yrūḥ, la tkhallīni | making plans with friends; light persuasion | social | خله يروح, لا تخليني, خلوه; recycle: خلنا, خلني | — |
| s3u061–s3u064 | **"Still", "no longer", "left":** ma ʿād, baʿad "still" (U), bāgi, ẓall (U) | catching up after time away | conversation | ما عاد, باقي, ظل, بعده ما يا (U); recycle: توه, للحين | — |
| s3u065 | checkpoint 3.4 | — | — | 6 | — |
| s3u066–s3u070 | **Relative clauses II:** resumptive pronouns, headless illi (illi yabi yrūḥ, yrūḥ), topic first (il-mudīr, ma shifta il-yōm) (U); plural agreement recycled | opinions and descriptions; "whoever…" | opinions | اللي يبي, اللي شفته; recycle: اللي | — |
| s3u071–s3u076 | recycle: all B1 so far | **Religion at depth:** Friday prayer, iftar invitations, condolences, the ʿazā visit | religion | عظم الله أجركم, الله يرحمه, مأجور, من العايدين والفايزين, شهرك مبارك, صلاة الجمعة; recycle: رمضان كريم, تقبل الله, عساكم من عواده | ḥagg il-lēla / girgēʿān (U); the ʿazā visit (S) |
| s3u077–s3u082 | recycle; b-raʼyi, aẓunn | experiences, plans, ambitions; opinions with reasons (CEFR B1, S) | personal | أظن, برأيي, حلمي, طموحي; recycle: ودي, أحس | — |
| s3u083 | checkpoint 3.5 | — | — | 6 | — |
| s3u084–s3u089 | recycle | relationships, friendship, misunderstandings, proper apologies; weddings and new babies | family, feelings | عقبالك, الله يسمع منك, بالأفراح دايمين, زعلت مني؟; recycle: سامحني, مبروك | wedding customs (U); mabrūk + mā shāʼ allāh for a baby (S) |
| s3u090–s3u095 | recycle; Kuwaiti forms II | **trip to Kuwait** with Fahad; meeting Nūra; the dīwāniyya | travel | شلونكم, شنو السالفة, دينار, ديوانية (U); recycle: شنو, مو, إحنا | Kuwaiti sub-dialects (S: Jibla, Sharq); the dīwāniyya (U) |
| s3u096–s3u100 | recycle | health II: A&E, insurance, reporting a lost wallet (no invented procedures) | health, safety | تأمين, طوارئ, بلاغ (U), ضاع; recycle: إسعاف, حادث, شرطة | — |
| s3u101 | checkpoint 3.6 | — | — | 6 | — |
| s3u102–s3u107 | recycle: participles, kān gāʿid, lamma, gām | storytelling: narrating an experience at length; jokes | storytelling | مرة من المرات, فجأة, في الآخر | — |
| s3u108 | checkpoint 3.7 (stage review) | — | — | 6 | — |
| s3u109–s3u110 | **B1 exit** | (109) unprepared conversation on a familiar topic; (110) narrate an experience (CEFR B1, S) | — | 6 each | — |

## 6. Stages 4 and 5 (B2, C1)

From here each lesson marks about 3 (B2) or 4 (C1) items receptive (STYLE §13), and every 5th unit carries a weekly optional `task` (§11). "New:" lists the forms to teach; everything else named in a cell is recycled.

### Stage 4 (B2): s4u001–s4u110

| Units | Grammar point | Functions and situations | Domain | Culture |
|---|---|---|---|---|
| s4u001–s4u006 | **Counterfactual** lō … chān + perfect; chān "you should have" (S: Alotaibi; CODA جان). Recycle: جان قلت لي | regrets, hindsight, advice about the past | decisions | — |
| s4u007–s4u010 | **Future perfect** biykūn + perfect, bakūn khallaṣt (S); biykūn "will probably be" | deadlines and guesses | work | — |
| s4u011–s4u014 | **Form VII passive / middle** (S: ndashsh, yindashsh); ygūlūn as an impersonal | what can and can't be done; rumours | society | — |
| s4u015 | checkpoint 4.1 | — | — | — |
| s4u016–s4u020 | **Double objects** with iyyā- (ʿaṭēta iyyāh) and contractions (U). Recycle: عطني اياه | lending, borrowing, giving it back | daily life | — |
| s4u021–s4u024 | **Quadriliteral verbs** and English verbs with Arabic endings (kansal, chayyak, ballak: U) | tech trouble; cancelling, checking, blocking | technology | youth loans |
| s4u025–s4u028 | **Wish, want, prefer.** New: atmanna, yā rēt, afaẓẓil. Recycle: widdi, ḥabbēt | preferences and hopes | personal | — |
| s4u029 | checkpoint 4.2 | — | — | — |
| s4u030–s4u034 | **Diminutives** (a -ayyir / -ayya example chosen with a native, U), abu / umm uses, address, exclamatives (U). New: yā khālti, yā bū X, يا أختي yā ukhti (chunk; 113/69), yā shēkh. Recycle: yā ʿammi, أختي, صغير | addressing people of every rank; nicknames | people | bū-names, kunya conventions (U) |
| s4u035–s4u039 | **kān / ykūn strings** (lāzim ykūn, yimkin kān); "as if"; "I think"; reciprocals; -an adverbs. New: atwaqqaʿ, taqrīban, awinna (UAE, S), kinnah / chinnah (C), baʿaẓ (C). Recycle: aẓunn, aḥiss, ṭabʿan, aṣlan | guessing, interpreting, describing impressions | conversation | — |
| s4u040–s4u043 | **Word order:** topic first with a resumptive pronoun, fronting for emphasis, question word at the end (S), agreement with non-human plurals (U) | emphasis and contrast in argument | conversation | — |
| s4u044 | checkpoint 4.3 | — | — | — |
| s4u045–s4u050 | recycle | agreeing, disagreeing politely, conceding (ṣaḥḥ bas…, maʿak ḥagg bas…); pros and cons | cost of living, rent | — |
| s4u051–s4u056 | recycle | society and community: neighbours, traffic, wedding costs, national days | society | national day dates (U: verify) |
| s4u057 | checkpoint 4.4 | — | — | — |
| s4u058–s4u063 | recycle; listening to fast speech | **other Arabic voices and media:** recognising Saudi (wish, abgha, daḥḥīn; marra "very" only in the chunk مرة حلو marra ḥilu, 14/43, because مرة "once" is an s1u044 item), Qatari, Bahraini and Omani forms (receptive items glossed by region); Levantine and Egyptian heard in Dubai (one weekly task); TV series, football, music | media | the Gulf's dialect map (S: Wikipedia; regional cells U) |
| s4u064–s4u069 | recycle; office register | work II: job interview, salary, presenting, complaining to a manager | work | office vs majlis register |
| s4u070 | checkpoint 4.5 | — | — | — |
| s4u071–s4u076 | recycle | health and lifestyle: diet, gym, sleep, stress; **explaining how to do something** (a recipe, an app, a process, without invented official steps) | health | — |
| s4u077–s4u082 | recycle; narrative markers | long storytelling, anecdotes, jokes (CEFR B2, Qasid 302, S) | storytelling | — |
| s4u083 | checkpoint 4.6 | — | — | — |
| s4u084–s4u089 | recycle | **proverbs and idioms I**, one per lesson at most, receptive: سو خير وقطه بحر, من قال ها سمع, غلطة الشاطر بألف, الذيب ما يهرول عبث (S, Wiktionary); الخنفس في عين أمه غزال (S, Gulf News; script U) | proverbs | proverbs are mostly for recognition (S) |
| s4u090–s4u095 | recycle | youth speech and code-switching with Rāshid: "ana ṭarrashtlak message" (S), kashkha (S), slang (U, receptive) | youth | code-switching as identity (S) |
| s4u096 | checkpoint 4.7 | — | — | — |
| s4u097–s4u102 | recycle; fuṣḥā-fed vocabulary (receptive) | education and careers: studying abroad, AI and technology | education | — |
| s4u103–s4u107 | recycle | environment and development: heat, water, cities (no invented statistics) | environment | — |
| s4u108 | checkpoint 4.8 | — | — | — |
| s4u109–s4u110 | **B2 exit** | (109) argue the advantages and disadvantages of a topical issue; (110) sustain a view in discussion (CEFR B2, S) | — | — |

### Stage 5 (C1): s5u001–s5u090

C1 grammar categories come from the table of contents of a published Emirati Arabic reference grammar. Only the contents page was read. **Don't draft s5 grammar labels or grammar notes until the book is in hand; draft functions, dialogues and tasks first.**

| Units | Grammar point | Functions and situations | Culture |
|---|---|---|---|
| s5u001–s5u006 | **Epistemic and evidential modality.** New: chūd (Kuwait-leaning, S Kuwaiti study; C جود 270/285 mixes jūd "generosity") [weak], wāẓiḥ inn, sāmiʿ inn. Recycle: yimkin, akīd, shakl-ah, ygūlūn inn (يقولون إن, s3u019) | hedging, guessing, reporting what you've heard | — |
| s5u007–s5u010 | **Optatives and hortatives.** New: عساه / عساها + wish (105/77), الله يوفقك (recycle: taught in s2u090) (170/160), الله يحفظك (272/49). Recycle: yā rēt, khal + verb, and the ʿasa and allāh y- formulas in §7 | wishing, blessing, urging | blessings as social glue |
| s5u011–s5u014 | **Assertive gid** in kān gid + perfect (S: Alotaibi, Kuwaiti; Emirati use U) [weak]; understatement. Recycle: wallāh, aṣlan, tara, ʿād | insisting, emphasising, playing down | — |
| s5u015 | checkpoint 5.1 | — | — |
| s5u016–s5u020 | **Negative polarity and concord.** New: wala marra (S), ma … illa, ma ʿumri. Recycle: abad, maḥḥad | strong denials, "never in my life" | — |
| s5u021–s5u025 | **Free and non-restrictive relatives; embedded and rhetorical questions; exclamatives** | arguing, reproaching, marvelling | — |
| s5u026–s5u030 | **Concessives, parentheticals, ellipsis;** repair (aqṣid, khallni agūlha b-ṭarīga thānya) | conceding, correcting yourself, short replies | — |
| s5u031 | checkpoint 5.2 | — | — |
| s5u032–s5u037 | **Politeness, honorifics, borrowed interjections, "trendy language"** (ch. 17–18). Recycle: ṭawīl il-ʿumr | speaking to rank and age; sheikhs and officials (S: Ask Ali) | honorifics |
| s5u038–s5u045 | **Register shifting** between majlis, office and formal speech; educated spoken Arabic (Gulf grammar with fuṣḥā vocabulary, q kept in classicisms); triglossia with English (ch. 1.2) | a toast, a short formal welcome, a radio-style interview, all labelled (formal) | triglossia in the UAE |
| s5u046 | checkpoint 5.3 | — | — |
| s5u047–s5u052 | recycle. New: wāyid ʿalēk (ironic, S). Recycle: khēba, awinna | irony, humour, teasing; where banter stops | humour |
| s5u053–s5u058 | recycle | persuasion and negotiation: business, renting, buying a car | — |
| s5u059–s5u063 | recycle | conflict: complaints, calming things down, formal apology, mediating (ṣulḥ) | — |
| s5u064 | checkpoint 5.4 | — | — |
| s5u065–s5u070 | recycle | **heritage I:** the sea, pearling, the dhow, old Dubai and the frīj; old words, receptive (S: NLA glossary; KUNA list of 1950s words) | pearling and sea life |
| s5u071–s5u075 | recycle | **heritage II:** the desert, falconry, camels, il-barr, the ʿizba; nabaṭi poetry, receptive | desert life, poetry |
| s5u076–s5u080 | recycle; fuṣḥā bridge | religion at depth: the Friday sermon (with fuṣḥā R4–R5), charity and zakat vocabulary (Gumar has no زكاة, so other sources), Kuwaiti Ramadan proverbs (S: Al-Jarida) | — |
| s5u081 | checkpoint 5.5 | — | — |
| s5u082–s5u087 | recycle | extended presentation and discussion: building on another speaker's point, chairing, summarising, debating | — |
| s5u088 | recycle | proverbs II, receptive: Emirati heritage proverbs (S: The National 2013, transliteration only; Arabic script U) | — |
| s5u089–s5u090 | **C1 exit** | (089) extended presentation integrating sub-themes and answering another speaker; (090) the same topic in majlis, office and formal registers | — |

## 7. Social formulas with their fixed replies

Teach the pair together, in the same dialogue. Evidence: S sourced; C Gumar phrase count AE/KW; U unsourced. A formula whose reply is U ships with the best-evidenced reply (corpus, grammar, course sources) and is listed in content/review/native_queue.md for a native to confirm (course-lead ruling).

| Formula | Fixed reply | When | Evidence | Taught in |
|---|---|---|---|---|
| السلام عليكم | وعليكم السلام | any greeting; more religious than hala (S) | S | u1 |
| هلا / هلا والله | هلا بك / هلا فيك, هلا والله | casual hello | C هلا بك 71/80, هلا فيك 81/261 | u1; هلا بك s1u017 |
| شلونك؟ / شحالك؟ | زين الحمد لله; بخير الله يسلمك | how are you | C بخير الله يسلمك 38/24; pair U | u1; s1u017 |
| مرحبا الساع | (reply U: هلا والله) | warm welcome to an arriving guest (UAE) | S (Eton); C 237/2 | s1u020 |
| شو اليديد؟ | ما شي | what's new? | S (Eton); C 8/0 [weak]; ما شي 549/11 | s1u017 |
| شخبارك؟ | زين الحمد لله | what's your news? | C 245/401; reply U | s1u018 |
| صباح الخير / مساء الخير | صباح النور / مساء النور | time of day | S; C 336/339 | u11 |
| تصبح على خير / تصبحين على خير | وانت من أهله | good night | C 171/116, reply 53/49; pair U | s1u044 |
| مشكور / مشكورة | العفو | thanks | S | u2 |
| تسلم / تسلمين | الله يسلمك | thanks for a favour | C 1226/890; pair U | s1u060 |
| ما قصرت | ما سوينا شي | thanks for real help | stage 1 | u12 |
| يعطيك العافية | الله يعافيك | to someone working or helping | S (phrase); reply U | u10 |
| (to someone working) الله يقويك | — | encouragement at work | C 15/21; U | s3u029 |
| بالعافية | الله يعافيك | after someone eats or drinks | S (AOL); reply U; C 144/146 | s1u057 |
| نعيما | الله ينعم عليك | after a shower or a haircut | C 22/4, 13/5; pair U | s1u059 |
| حياك الله / حياكم الله | الله يحييك / الله يحييكم | welcome to a guest | C 56/55, 43/43 | u10; حياكم s1u032 |
| تشرفنا | الشرف لي | nice to meet you | stage 1 | u3 |
| مبروك | الله يبارك فيك / فيج | any congratulations | C 304/269 (reply); general pair U | s1u039 |
| في أمان الله | في أمان الكريم; مع السلامة also answers | goodbye | C 4/16 (Kuwait-leaning) vs في امان الله 119/121; reply U | u11 |
| سلامات | الله يسلمك (reuse) | to someone ill | C 198/82; pair U | s2u055 |
| ما تشوف شر | الله يسلمك (U) | to someone ill | C 25/34; reply U | s2u055 |
| عسى ما شر؟ | ما شر, الحمد لله | "nothing bad, I hope?" | C 103/136; pair U | s2u055 |
| الحمد لله على السلامة | الله يسلمك (reuse) | welcome back from a trip or illness | C 180/89; pair U | s2u061 |
| رمضان كريم | الله أكرم | Ramadan | S | s2u061 |
| مبارك عليكم الشهر / شهرك مبارك | الله يبارك فيك (reuse) | start of Ramadan | S (The National) | s2u061; شهرك مبارك s3u071 |
| تقبل الله (منا ومنكم) | منا ومنكم | after prayer, fasting, iftar | S; C 20/30 | s2u061 |
| عساكم من عواده | repeat it | Eid (UAE and GCC) | S (reply: repeat) | s2u061 |
| كثر خيرك | (host insists or accepts) | polite refusal of an offer (S, Wiktionary) | C weak 3/0; usage U | culture note s2u063; item only after native check |
| طال عمرك / طويل العمر | — (respectful address, not a pair) | to elders, sheikhs, strangers (S) | S; C 172/123, 80/11 | s2u063 |
| السموحة | مسموح; ما عليه (U) | "excuse me, pardon" (meaning U) | C السموحه 489/67, السموحه منك 72/8, مسموح 124/51 | s2u063 |
| أبشر | (reply U) | "consider it done" | C 99/96; reply U | s2u068 |
| على هالخشم / على راسي | — | "gladly, at your service" | C 18/17, 375/170; usage U | s2u068 |
| الله يهداك | — | mild exasperation | C 98/91; usage U | s2u073 |
| من العايدين والفايزين | وانت من العايدين (U) | Eid | S; C 27/7 | s3u073 |
| عظم الله أجركم | أجرنا وأجركم (U) | condolences to the family | S (phrase); C 26/24; reply C 4/10, U | s3u075 |
| الله يرحمه / يرحمها | آمين (U) | on mentioning the dead | C 571/338 | s3u075 |
| مأجور | (reply U) | after a good deed, a funeral, paying for others | S (Wiktionary) | s3u076 |
| عقبالك | الله يسمع منك | at weddings and graduations | C 60/39, 47/58; pair U | s3u084 |
| بالأفراح دايمين | (U) | weddings, Eid | S (Eid list); wedding use inferred | s3u085 |
| new-baby, new-house and new-car formulas (beyond mabrūk + mā shāʼ allāh, S) | U | — | none sourced; don't write any until a native supplies them | B1 only after native check |

## 8. The glue words: all taught by the end of A2

These are the high-frequency dialect forms in the Gumar AE+KW top 1,000 (names, narrative verbs and spelling variants left out). Rank and AE:KW rate per million are from `gumar_ae_kw_top1000.tsv`. No Kuwaiti form is an item before s2u027.

| Form | Rank | AE:KW pm | Tag | Taught in |
|---|---|---|---|---|
| بس | 5 | 8146:7915 | GULF | u6 |
| اللي | 10 | 4906:5151 | GULF | s2u046 |
| شي | 11 | 4104:4757 | GULF | s1u031 |
| والله | 14 | 3558:3360 | GULF | s1u017 (u1 has هلا والله) |
| مو | 22 | 1109:4313 | KW | note in u13; item s2u027 |
| شو | 24 | 5011:139 | UAE | u7 |
| ليش | 27 | 2358:2524 | GULF | u7 |
| انتي | 30 | 2147:2553 | GULF | u3 |
| الحين | 45 | 1707:1819 | GULF | u8 |
| وين | 50 | 1757:1528 | GULF | u7 |
| راح | 54 | 1071:2039 | GULF | s1u035 |
| عشان | 56 | 1557:1550 | GULF | s1u056 |
| شوي | 57 | 1558:1528 | GULF | u9 |
| خلاص | 62 | 1234:1708 | GULF | u15 |
| مب | 74 | 2297:128 | UAE | u13 |
| شنو | 82 | 465:1715 | KW | s2u027 |
| هلا | 84 | 641:1438 | GULF | u1 |
| صار (شو صار؟) | 85 | 813:1215 | GULF | s1u039 |
| وش | 87 | 562:1437 | SA | note only (u3, s2u027) |
| مرة | 92 | 1014:862 | GULF | s1u031 (chunks only: hal-marra; ʿīd marra thānya in u2) |
| يلا | 95 | 706:1144 | GULF | u8 |
| يمه | 98 | 387:1432 | KW | s2u027 |
| هذي | 100 | 735:1078 | GULF | u14 |
| أول | 105 | 812:919 | GULF | s1u036 |
| زين | 108 | 968:741 | GULF | u1 |
| وايد | 113 | 1051:606 | GULF | u4 |
| أبي | 114 | 413:1244 | GULF | u6 |
| لازم | 116 | 814:834 | GULF | u11 |
| حق | 124 | 822:715 | GULF | s1u024 |
| يمكن | 131 | 786:701 | GULF | s1u056 |
| جذي | 133 | 294:1185 | GULF | s1u027 |
| لج / عليج | 137 / 143 | 741:701 / 836:590 | GULF | s1u021 (-ich endings) |
| هيه | 139 | 1395:35 | UAE | s1u018 |
| طيب | 142 | 412:1014 | GULF | s1u017 |
| منو | 149 | 782:612 | GULF | u7 |
| صوب | 152 | 1244:129 | UAE-leaning | s1u061 |
| لين | 155 | 892:460 | GULF | s2u041 |
| خير؟ | 157 | 675:668 | GULF | s2u055 |
| انزين | 158 | 876:464 | GULF | s1u058 |
| عيل | 177 | 894:321 | GULF | s2u077 |
| تبي | 182 | 342:836 | GULF | u6 |
| أكيد | 184 | 568:609 | GULF | s1u054 |
| عاد | 190 | 633:503 | GULF | s2u077 |
| صح | 191 | 645:489 | GULF | s1u057 |
| ما أدري | 195 | 512:601 | GULF | u13 |
| حبيبي | 200 | 419:687 | GULF (register) | s2u063 |
| عقب | 202 | 895:203 | UAE | s2u041 |
| ويا | 206 | 764:318 | GULF | s1u021 |
| محد | 208 | 676:399 | GULF | s2u081 |
| أوكي | 209 | 370:704 | GULF (loan) | s1u058 |
| شلون | 217 | 200:827 | KW-leaning | u15 |
| بعدين | 229 | 495:478 | GULF | u8 |
| صج | 259 | 274:607 | GULF | s2u073 |
| يصير؟ | 266 | 293:559 | GULF | s2u068 |
| جان (جان قلت لي) | 269 | 598:247 | GULF | s2u085 (chunk); B2 grammar |
| عادي | 273 | 441:390 | GULF | s1u055 |
| هني | 290 | 436:356 | GULF | u3 |
| باكر (باجر) | 292 | 452:337 | GULF | u8 |
| جي | 297 | 688:76 | UAE | s1u027 |
| أحسن | 311 | 325:415 | GULF | s2u031 |
| أقدر | 326 | 281:445 | GULF | u9 |
| حرام عليك | 334 | 366:342 | GULF | s2u073 |
| طبعا | 344 | 338:351 | GULF | s1u054 |
| المهم | 379 | 402:251 | GULF | s2u018 |
| قاعد | 390 | 231:402 | GULF | s2u018 |
| تدري | 391 | 247:386 | GULF | s2u003 |
| للحين | 418 | 152:447 | GULF | s2u085 |
| خلني | 422 (خل) | 241:354 | GULF | s1u050 |
| هالشي | 423 | 299:293 | GULF | s1u031 |
| تعال | 500 | 257:263 | GULF | s1u048 |
| أصلا | 527 | 266:220 | GULF | s2u077 |
| شكله | 531 | 277:208 | GULF | s2u077 |
| ماشي | 537 | 394:87 | GULF | s2u077 |
| إحنا | 547 | 106:365 | KW | s2u027 |
| حيل | 564 | 93:367 | KW-leaning | s2u027 |
| قدام | 571 (as جدام) | 300:153 | GULF | s1u061 |
| ما في | 581 | 166:280 | GULF | u13 |
| ترا | 606 | 219:207 | GULF | s2u077 |
| يطالع | 609 | 270:154 | GULF | s2u012 |
| ودي | 725 | 151:208 | GULF | s2u068 |
| ياي | 739 | 247:106 | GULF | s1u063 |
| دوم | 852 | 198:106 | GULF | s2u001 |
| توه | 861 | 152:149 | GULF | s2u085 |
| ماني | 928 | 85:192 | GULF | s2u081 |
| غصب | 935 | 107:168 | GULF | s2u081 |
| برا | 941 | 125:148 | GULF | s1u063 |
| أبد | 798 | 166:160 | GULF | s2u081 |

UAE-only forms taught as "(UAE)" items in s2u088: أبا (594), تبا (727), هب (466), الحينه (450), بسير (623), يالس (783), يرمس; عسب (437) appears in a note only.

## 9. Grammar recycling map

Each point is taught in its block and must reappear, in use, in the listed later ranges. Writers of the later block check that at least one dialogue line uses it.

| Point | Taught | Recycled in |
|---|---|---|
| possessive endings, construct | s1u021 | every stage; -ich forms in every block with Maryam or Umm Sēf |
| noun plurals and the dual | u14 (dual), s1u021 (family plurals as vocabulary), s2u059 | s2u061, s3u066, s4u040 (non-human agreement) |
| past tense (all types) | s1u033–s1u042 | s2u037 (kān), s2u041 (time clauses), s3u007 (kān gāʿid), s3u102 (storytelling), s4u077 |
| present tense -īn / -ūn | s2u001–s2u012 | s2u018 (progressive), s2u037 (used to), s3u013 (conditionals), all later dialogues |
| future b- | u8, s2u013 | s3u013 (result clause), s4u007 (future perfect) |
| gāʿid | s2u018 | s3u007 (kān gāʿid), s4u040 |
| object and dative endings | s2u023 | s3u019 (gāl-li innak), s4u016 (double objects) |
| comparatives, mithil | s2u031 | s4u045 (pros and cons), s5u053 |
| illi | s2u046 | s3u066 (resumptive, headless), s5u021 (free relatives) |
| participles | u8 (rāyiḥ), s3u001 | s3u047 (passive participle), s4u035 |
| conditionals | s3u013 | s4u001 (counterfactual), s5u026 (concessives) |
| reported speech and indirect questions | s3u019–s3u027 | s5u001 (evidentials), s5u021 |
| derived forms | s3u029–s3u045 | s4u011 (Form VII), s4u021 (quadriliterals) |
| modals | u9, u11, s1u053, s3u052 | s4u035 (kān / ykūn strings), s5u001 (epistemic) |
| negation | u13, s2u081 | s5u016 (negative concord) |
| register and address | s2u063 | s4u030, s5u032, s5u038 |

## 10. How earlier material is recycled

1. **Cards.** The app's spaced review brings back every item and every 2–8-word dialogue line. Lessons don't drill old items; they use them.
2. **Dialogues.** Each new dialogue uses at least 3 items from the previous 10 units and at least 2 from more than 30 units back. The reviewer lists them in the review sheet.
3. **Checkpoints** every 6 to 18 units put the block's items into a new scene (§1).
4. **Grammar** follows the map in §9.
5. **Cast continuity.** Sēf, Maryam, Bū Rāshid and Fahad keep their lives going (Sēf's exams, Maryam's project, the Kuwait trip), so earlier situations come back naturally.
6. **Teach once.** A form named after "recycle:" or "reuse:" in this file is never an item again. Stage 1 phrases appear in later dialogues verbatim (STYLE §3).
7. **Weekly tasks** re-use earlier functions: a B2 task may ask for the A2 majlis role-play done at B2 length.

## 11. B2 and C1 weekly tasks

The `task` field appears in every 5th unit of stages 4 and 5 (s4u005, s4u010 … s4u110; s5u005 … s5u090): 22 in B2 and 18 in C1, about one a week. Each starts **"This week: …"**, is optional, takes 15 to 30 minutes outside the daily session, and produces something: a voice note, a summary, a conversation. Links rot, so tasks never contain URLs. They name a kind of content and give **search terms in Arabic and English** (400 characters maximum).

| Code | Type | Example wording |
|---|---|---|
| I1 | gist listening | "This week: search YouTube for «مسلسل إماراتي» (Emirati series). Watch 5 minutes of any episode. Note who is arguing and about what, and say a 30-second summary aloud." |
| I2 | item hunt | "This week: search «بودكاست إماراتي» (Emirati podcast). Listen until you hear 3 items from this week's lessons, and write down the sentence around each." |
| I3 | shadowing | "This week: pick 5 short lines from any Emirati vlog («يومياتي في دبي»). Pause, repeat each one twice, matching speed." |
| I4 | fuṣḥā gist listening (from s4u097; at most 1 task in 5) | "This week: find a short Gulf TV news item («نشرة أخبار»). Listen twice, then tell Sēf in Gulf Arabic what happened." |
| T1 | conversation with a person | "This week: with a tutor or exchange partner (search a tutoring site for «Emirati Arabic tutor»), ask these 4 questions about their weekend and use 3 recent items in your answers." |
| T2 | voice note | "This week: record a 60-second voice note to Sēf saying why you can't come and what you suggest instead. Use chān and khallīna." |
| T3 | role-play in the app | "This week: in Talk, ask your partner to play a landlord who won't lower the rent. Keep it going for 8 turns." |
| M1 | mediation into English | "This week: explain to an English-speaking friend what a clip was about and one phrase you didn't know." |
| M2 | mediation inside Gulf Arabic | "This week: summarise a clip for Bū Rāshid, in respectful Gulf Arabic, in five sentences." |

**Durable search terms** (check each still returns dialect before using it): مسلسل إماراتي, مسلسل كويتي, بودكاست إماراتي, بودكاست كويتي, سوالف (chats), مقابلة باللهجة الإماراتية, طبخ إماراتي, رمضان في الإمارات, العيد في الكويت, سنع (Emirati etiquette), قصص الغوص (pearl-diving stories). For I4: نشرة أخبار, خطبة الجمعة. Long-running titles that are probably stable [U: check]: the Emirati cartoon فريج (Freej), the Kuwaiti classic درب الزلق.

**Dialect check, in every input task except I4:** "Within a minute you should hear شو / مب (UAE) or شنو / مو (Kuwait). If you hear سوف, ليس or هل all the time, it's fuṣḥā: pick another clip."

**Pattern:** B2 alternates input (I1–I3) and output (T1–T3, M1), with a conversation task (T1) at least every third task, and one Levantine or Egyptian gist task in s4u058–s4u063. C1 tasks are longer (10-minute conversations, 2-minute monologues); from s5u038 they switch register on purpose ("now say it as if to Bū Rāshid's majlis"), and I4 appears in at most 1 task in 5.

## 12. Culture topics by stage

| Stage | Topics (culture field, ≤400 characters) |
|---|---|
| A1 | greetings and handshakes between men and women (U); mā shāʼ allāh and the evil eye (S); Arabic coffee and dates; karak; the right hand; prayer times in the day; the weekend (U); Dubai's mix of nationalities and when English is the working language; kandūra, ghitra, shēla, ʿabāya as culture words |
| A2 | Ramadan and Eid greetings (S); majlis etiquette: finjān shake, bukhūr, the long goodbye (S); refusing politely (S); addressing elders and yā rayyāl (S); asking after family without naming a man's wife (U); summer life; UAE and Kuwaiti speech differences (S) |
| B1 | Ramadan at depth, iftar, ʿīdiyya (U); ḥagg il-lēla and girgēʿān (U); condolences and the ʿazā (S); weddings and new babies (S partial, U); office hierarchy; the Kuwaiti dīwāniyya (U); Kuwaiti sub-dialects (S) |
| B2 | the Gulf dialect map; code-switching and identity (S); loanword layers from English, Persian, Hindi-Urdu, Turkish (S); national days (U); football and TV drama; proverbs (S); sensitive words: descent labels, khaddāma vs ʿāmla (U) |
| C1 | pearling and the sea (S: NLA); the desert, falconry, the ʿizba; nabaṭi poetry; Kuwaiti Ramadan proverbs (S); the words the young no longer use (S: KUNA); honorifics and the majlis of a sheikh (S); triglossia (S, chapter title) |

## 13. The fuṣḥā track: 1,000 words and 82 readings

**Purpose:** reading and understanding signs, forms, news and the Friday sermon, never speaking. It runs alongside the dialect lessons and, from B2, feeds the receptive abstract vocabulary of educated Gulf speech. Listening to fuṣḥā is practised through I4 tasks. Rows in `content/msa.json` are `[vowelled ar, translit, english, gulf equivalent, domain]`.

**Gulf column format:** `G=` for a word identical in Gulf speech (شركة); `G~ <gulf translit>` for a cognate with a sound or form shift (قهوة → `G~ gahwa`; لكنّ → `G~ lākin`); `M <gulf script> <gulf translit>` for a word Gulf speech doesn't use (الآن → `M الحين il-ḥīn`). Most effort goes to M words (S: only about 21% of spoken words are identical to fuṣḥā in the one diglossia study, Palestinian). The 44 existing rows have no gulf or domain column yet and should be backfilled.

**Domain values:** function, signs, forms, services, news, religion, general.

**Order: the words Gulf speech doesn't use come first** (S, report): each F-batch puts its M rows first; G~ and G= may then mix. **Gulf column rulings (course lead):** same root with a different derived form or pattern is G~ (M only for a different root); a dropped final -a alone is G=; a G= row identical to a taught dialect item is a wasted card (lint warns). **The test for an M function word:** below about 128 pm in both Gumar corpora, or above it only through fuṣḥā narration in the novels (التي 160:204, تلك 170:83, هذه 103:112: Gulf speech uses اللي, هذيك, هذي). Words that pass Gumar's top 1,000 as real speech are G~, not M: لكن 802:1060, لأن 506:879, هنا 188:350, ثم 82:157, أن / إن, إلى. **The blacklist is the STYLE §10 hard list only.** F01 words not on it (سوى, قد, كما, إذن, نحو, حول, ضدّ, أثناء, ما زال, كي) are never auto-flagged: سوى normalises to Gulf sawwa / sawwi (1419/699) and إذن is also "permission" (عن إذنك). سوى must never enter the linter's MSA set. The ranked spine beyond F03 comes from the KELLY Arabic list (CC BY-NC-SA) cross-checked against Buckwalter and Parkinson; neither could be downloaded in the research, so **every batch after F03 needs the list obtained first** (U).

| Batch | Stage | Words | Domain | Contents (examples; never duplicate the 44 in F00) |
|---|---|---|---|---|
| F00 | 1 | 44 | mixed | shipped: مرحبًا, أريد, ماذا, لماذا, أين, الآن, سوف, ليس, لم, الذي, هل, كثيرًا, أستطيع, مخرج, مغلق, ممنوع… |
| F01 | 1 | 35 | function | M words, with Gumar pm (AE:KW): لن (38:61), ليست (12:11), جدًا (105:88), فقط (46:54), يجب (17:13), منذ (35:36), عندما (34:62), هذه, ذلك (50:81), تلك, هؤلاء (1:3), الذين (6:6), التي, حيث (28:39), خلال (42:42), لقد (26:12), يوجد (9:7), لدى (5:11), كذلك (5:5), لذلك (5:11), بينما (46:16), أيضًا (17:38), كما (60:41), قد (fuṣḥā "has / may"; not Gulf gid), إنّما (3:9), ربّما (11:24), لعلّ (10:4), كي (12:21), إذن (49:28), ما زال (25:20), نحو (11:45), حول, ضدّ (9:7), أثناء (4:9), and the false friend سوى "except" (Gulf sawwa "did") |
| F02 | 1 | 40 | signs | مدخل, خروج, اسحب, ادفع, طوارئ, استقبال, صيدلية, مصلى, للرجال, للنساء, العائلات, موقف, قف, الرجاء, يرجى, التدخين, مصعد, الطابق, مغادرة, وصول, بوابة, تذكرة… |
| F03 | 1 | 31 | forms (time) | days, Gregorian months, صباحًا, مساءً, ظهرًا, هـ / م after years, Eastern digits ٠–٩ (U: signage digit use) |
| F04 | 2 | 50 | forms | الاسم, اسم العائلة, تاريخ الميلاد, الجنسية, رقم الهوية, الإقامة, جواز السفر, العنوان, الحالة الاجتماعية, التوقيع, ذكر, أنثى, الرسوم, فاتورة, المبلغ, شامل الضريبة… |
| F05 | 2 | 50 | services | menus, shops, prices, banks, clinics, pharmacies: مشويات, عصائر, وجبة, السعر, خصم, صراف آلي, موعد, وصفة طبية… |
| F06 | 2 | 50 | general | G~ function words: لكنّ (G~ lākin), لأنّ (G~ lann), ثمّ (G=, thumm: only the final -a drops), إلى (G~ ila), أنّ / إنّ (G~ inn), هنا (G~ hni); core fuṣḥā verbs with their Gulf partners: رأى (M شاف shāf), جاء, أعطى, فعل / عمل (M سوى sawwa), نظر (M طالع ṭālaʿ), جلس, أرسل (M طرش ṭarrash), انتظر, وجد (M لقى liga), أخذ, سأل, أجاب, بدأ, انتهى… |
| F07 | 2 | 50 | news | headline nouns: وزارة, مجلس, شعب, منطقة, مدينة, عاصمة, العالم, الخليج, الإمارات, الكويت, مشروع, خطة, مبادرة, نفط, مليار… |
| F08 | 3 | 50 | news | news verbs: أكد, أعلن, أشار, أضاف, أوضح, تمّ, عقد, افتتح, أطلق, استقبل, زار, دعا, ارتفع, انخفض, بلغ… |
| F09 | 3 | 50 | general | society, family and daily-life prose (moved from news to balance the quota) |
| F10 | 3 | 50 | services | weather, environment, roads and transport notices |
| F11 | 3 | 50 | religion | mosque and khuṭba openings (الحمد لله, أما بعد, أيها المسلمون), prayer names, Hijri months, Ramadan and Eid notices (chosen from sermons and notices, not web frequency; S: KELLY's religious bias) |
| F12 | 3 | 50 | general | health, education, work |
| F13 | 4 | 50 | news | government, politics and international relations |
| F14 | 4 | 50 | news | economy and business |
| F15 | 4 | 50 | general | culture, sport, technology, media |
| F16 | 4 | 50 | religion | sermon discourse II, Qurʼanic set phrases (قال تعالى) |
| F17 | 4 | 50 | general | abstract nouns and verbal-noun patterns (تطوير, تعزيز, مشاركة, تحقيق) |
| F18 | 5 | 50 | function | connectors and stance: إلا أنّ, رغم, بالرغم من, من ناحية, بالإضافة إلى, وفقًا لـ, نظرًا لـ, أمّا … فـ, بل, لا سيّما |
| F19 | 5 | 50 | general | editorial and opinion vocabulary |
| F20 | 5 | 50 | news | formal speech, titles and ceremonies: صاحب السمو, معالي, سعادة, يسرّني, أتقدّم بالشكر |

Totals: 150 known words by the end of stage 1, 350 by stage 2, 600 by stage 3, 850 by stage 4, 1,000 by stage 5. Domain totals: about 135 function, 250 news and government, 150 signs and services, 80 forms, 100 religion, 285 general, close to the report's suggested quota (a design inference, not data).

**Graded readings** (`content/readings.json`; format `{id, level, stage, title, lines:[[ar, en]], questions:[[question, [options], answer]]}`; the app unlocks a reading when the learner reaches its stage).

| Level | Stage (unlock) | Number | Length | Text type | New words per text | Target coverage (lemmas, clitics stripped) | Vowelling | Questions |
|---|---|---|---|---|---|---|---|---|
| R1 | 1 | 12 | 5–30 words | signs, labels, a menu, a receipt, a metro notice | 3–5 | 90% (glossed) | full on new words, none on G= words | 2 |
| R2 | 2 | 16 | 30–80 | notices, a form, short headlines, a shop flyer | 4–6 | 95% | new and ambiguous words only | 3 |
| R3 | 3 | 20 | 80–150 | news briefs, announcements, a mosque notice, a weather report | 5–8 | 95–97% | disambiguating marks only (passive, shadda) | 3–4 |
| R4 | 4 | 20 | 150–300 | a news story, a sermon excerpt, a feature | 6–10 | 97–98% | none in the text; the batch cards are the vowelled glossary | 4 |
| R5 | 5 | 14 | 300–500 | adapted news and editorial | ≤10 | 98% | none | 4–5 |

Reading rules: ids `r1-01` … `r5-14`; within a level, order them by batch so each text uses only words from batches already unlocked plus G= words; one line per sentence, 20 words at most, so line playback works; questions in English. Wrong vowels are the most disruptive condition for readers (S: Alseraye 2024), so **a reading with any doubtful vowel mark ships without it**. Texts are fictional and generic ("the ministry", "a Dubai company"): no real people, no quotes, no invented news about real organisations, no real dates.

## 14. Still unsourced: needs native confirmation before it ships as an item

1. **Numbers and time:** 11–19 (Gumar has almost no hits, because novels write digits), 300–900, 2,000 and up, counted nouns after 11 and 100, the -ar form before nouns, telling the time (w-rubʿ, illa rubʿ, w-thilth), month names in speech, ordinals above 10.
2. **Modals:** the exact force of yṣīr / ma yṣīr, ʿēb, ḥarām, il-mafrūẓ, yabā-lah; the scope of mub lāzim vs lāzim ma; tawwa, ʿād / ma ʿād, bāgi, baʿad "still", ẓall, ṣār + verb.
3. **Clause structure:** indirect questions, idha "whether", resumptive pronouns, headless illi, ilā "if", yōm "when", baʿdēn, ḥatta, gabil-ma as connectors; whether reported speech backshifts.
4. **Morphology:** the full suffix table for Dubai and Kuwait; iyyā- chains and ʿaṭnīh vs ʿaṭni-yyāh; Forms III and V–X with Gulf examples; verbal nouns; participle meanings (mitʿawwid, shāyif); diminutives; non-human plural agreement; which broken plurals Dubai speakers use (ryāyīl, byūt); agreement of māl.
5. **Replies to formulas:** every reply marked U in §7, كثر خيرك in use, and the wedding, new-baby, new-house and new-car formulas.
6. **Discourse and address:** khalāṣ, ʿayal, ʿādi, yā salām, yā ḥaẓẓak, allāh yihdāk, is-samūḥa; yā bū X naming, yā ʿammi, yā khālti, ukhti, akhūy, yā shēkh; kinship vocatives.
7. **Course-specific choices made here:** the per-word list of y-words (ي) vs j-words (ج), which grows in the seed lexicon; كيف said chēf or kēf; قدام said jiddām or chiddām; تريا as the default "wait"; أمايه / أبويه pronunciation; whether هيه sounds natural from a foreign learner; جي as the Emirati default for "like this".
8. **Youth and loans:** kafu, ʿāsh, current social-media slang; English verbs with Arabic endings (kansal, chayyak, ballak); Arabizi; how often natives write چ and گ.
9. **Regional cells:** Abu Dhabi mash; Qatari, Bahraini, Omani and Saudi forms for s4u058–s4u063; the wish / wēsh split; chūd and gid in Emirati speech.
10. **Taboo and sensitivity:** descent labels, animal insults, the ṭalāg and ḥarām oaths, asking after a man's wife, khaddāma vs ʿāmla.
11. **Proverbs:** Arabic script for The National's 2013 Emirati set; which proverbs younger people still say.
12. **Facts:** the current UAE and Kuwaiti weekends, national day dates, any government, bank or rental procedure used in a lesson.
13. **C1 grammar:** all of it, until a full Emirati reference grammar is bought and read.
14. **Fuṣḥā track:** a verified frequency ranking (KELLY or Buckwalter must be obtained); Eastern vs Western digits on Gulf signs; Hijri dates on UAE and Kuwaiti documents.
15. **Scope numbers:** every lesson, item, minute and hour estimate in this file (E).

Five purchases or downloads would close most of this list (S, report): Holes, *Colloquial Arabic of the Gulf*; two published Emirati grammars; a Gulf Arabic-English dictionary; the CODA* seed lexicon (manual download); Hanan Al Fardan's *Spoken Emirati Phrasebook* for formula replies.

## 15. Responses to review

The review (`content/review/framework_review.md`, 55 rows) was applied in full: all 10 MUST FIX, all 27 SHOULD FIX and all 18 NOTEs. Course-lead decisions changed how four of them were resolved:
- **#1 (y-spelling):** resolved the other way by the course lead. Write ي for the y-sound in dialect words (ياي 2266/554 vs جاي 568/911; يالس 2951/48 vs جالس 505/839), keep ج for words said with j. STYLE §2 and §9 updated; homographs this creates (يدي, ويه, يا) are listed in STYLE §2.
- **#10 (time budget):** resolved through the course lead's 30-minute split (lesson ≈10, reviews ≈15, speaking ≈5), weekly optional tasks, and the `receptive` field (about 3 items per B2 lesson, 4 per C1), not by cutting B2/C1 lessons to 7 items. The productive target is restated as about 3,450 items, with about 630 receptive.
- **#11 (like this):** took the reviewer's first option. جي chī is the Emirati default, and جذي chidhi is taught beside it at s1u027.
- **#33 (other dialects):** placed at s4u058–s4u063 ("other Arabic voices and media", receptive items by region, plus one Levantine or Egyptian gist task), not at s5u053, so persuasion keeps its C1 block.

Other changes beyond the review: Kuwaiti items start at s2u027 (the s1u032 checkpoint now teaches group forms); a checkpoint (s1u052) was added to stage 1, shifting the modal and food blocks to s1u053 and s1u057; Ramadan and Eid greetings moved to A2 (now s2u061) and emergencies to s2u055; Form II to X verbs are taught as inflected chunks to avoid homograph collisions; weak forms were replaced after attest.py checks (خابرني 1/1 and صلحت 16/5 dropped for اتصلت 1839/870 and يصلح 110/75).

**Round 2** (appended to the same review file): all 3 MUST FIX, all 9 SHOULD FIX and all 5 NOTEs applied, none rejected. R2-1 to R2-3 (re-taught يقولون إن, أختي, Saudi مرة) moved to recycle or chunks; R2-4 exceptions list now names جي, جذي, جان; R2-5 "sit" is yalas / ييلس yiylis [weak]; R2-6 the blacklist is the STYLE §10 hard list only; R2-7 checkpoints "every 6 to 18 units"; R2-8 رياييل; R2-9 s5u007 names only new wishes; R2-10, R2-13 homograph list updated; R2-11 s2u059–s2u060 (plurals, city) split from s2u061–s2u062 (seasons, Ramadan and Eid; §7 "taught in" updated); R2-12 معليش is a stage 1 form, fine for B; R2-14 STYLE §9 marks the app and linter work done; R2-15 calendar note in §1; R2-16 diminutive example left to a native; R2-17 the DIALECT rule in index.html now has the ي rule. Stage 1 rows are unchanged.
