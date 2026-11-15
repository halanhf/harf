# Harf course framework: scope and sequence, zero to C1

This is the plan that about 470 lessons are written and checked against. `STYLE.md` says how every line is written; this file says what goes in which lesson. Evidence keys are the same as in `STYLE.md`: **S** sourced, **C** attested in Gumar AE/KW (raw counts AE/KW, checked with `attest.py`), **U** unsourced, needs a native check, **[weak]** thin evidence. The main basis is `/home/claude/reports/Gulf Arabic course to C1.md`.

**What the course can and can't do.** About 466 half-hour lessons is roughly 230 hours of structured work. An English speaker probably needs 2,200 to 3,200 hours to reach C1 in Arabic (E, report). So stages 1 to 3 (A1 to B1) are self-contained lessons, and stages 4 and 5 (B2, C1) are scaffolding: every lesson there sets a real-input or conversation task, and those hours, not the lesson text, do most of the work.

## 1. Stages at a glance

| Stage | CEFR | Unit ids | Units | New items per normal lesson | Items in stage (approx.) | Cumulative items | Tasks | Fuṣḥā batches | Readings |
|---|---|---|---|---|---|---|---|---|---|
| 1 | A1 | u1–u16 (existing, in place) + **s1u017–s1u066** | 16 + 50 = **66** | 8–9 | 140 + 438 = 578 | ~580 | none | F00 (44, shipped) + F01–F03 | R1: 12 |
| 2 | A2 | **s2u001–s2u090** | **90** | 8–9 | ~790 | ~1,370 | none | F04–F07 | R2: 16 |
| 3 | B1 | **s3u001–s3u110** | **110** | 9 | ~960 | ~2,330 | optional, from s3u090 | F08–F12 | R3: 20 |
| 4 | B2 | **s4u001–s4u110** | **110** | 9 | ~960 | ~3,290 | every lesson | F13–F17 | R4: 20 |
| 5 | C1 | **s5u001–s5u090** | **90** | 8–9 | ~790 | ~4,080 | every lesson | F18–F20 | R5: 14 |
| | | | **466** | | | **~4,080** | | **1,000 words** | **82** |

**Item arithmetic.** The app allows 5 to 9 items per unit, and each item is taught once in the whole course. Reaching about 4,000 productive items in 466 units therefore needs **9 items in every normal lesson** (8 is the floor) and **6 in checkpoint and exit lessons**. Items may be single words or chunks ("ما أدري وين", "على طول"), which is how one item can carry a lemma plus its most useful pattern. These are design estimates (E), not sourced figures. The report's lemma targets (500 / 1,200 / 2,000 / 3,000 / 4,000) are met if roughly four items in five carry a new lemma.

**Per-stage lesson shape.**

| Stage | Dialogue lines | Words per line | Grammar label | culture field | task field | New, unglossed dialogue words |
|---|---|---|---|---|---|---|
| A1 | 4–6 | 2–7 | most lessons | 1 lesson in 3 | — | ≤20% (lint warns at 35%) |
| A2 | 5–7 | 2–10 | most lessons | 1 in 3 | — | ≤20% |
| B1 | 6–8 | 3–12 | grammar blocks; "recycle: …" in function blocks | 1 in 2 | optional from s3u090 | ≤25% |
| B2 | 7–10 | 3–16 (half of B's lines 2–8) | as B1 | 1 in 2 | every lesson | ≤25% |
| C1 | 7–10 | 3–16 (half of B's lines 2–8) | as B1 | 1 in 2 | every lesson | ≤30% |

**Checkpoints.** Every 6 to 12 units there is a checkpoint. Its dialogue recycles the block's items in a new scene. Its 6 items are things the block needed but didn't teach: the other-gender or plural form of a frequent phrase, a common collocation, or a Kuwaiti or Emirati variant labelled in the English. It never re-teaches a phrase (lint error).

## 2. Cast and settings

Names carry origin, so reviewers can check each line against its speaker. Names avoid capital letters the linter rejects (Ā, Ḥ, Ṣ and similar).

| Name | Script | Origin | Sex, age | Role | Register with the learner | From |
|---|---|---|---|---|---|---|
| (learner, B) | — | British, studying and interning in Dubai | man, ~20 | always speaker B; Arabic name Sālim if needed (u3) | — | u1 |
| Sēf | سيف | Emirati, Dubai | man, 22 | university friend | friends: yā rayyāl, khēba, English loans | s1u017 |
| Maryam | مريم | Emirati, Dubai | woman, 26 | colleague at the internship | polite, neutral; B practises -ich / -īn with her | s1u018 |
| Umm Sēf | أم سيف | Emirati, Dubai | woman, ~50 | Sēf's mother | respectful | s1u021 |
| Bū Rāshid | بو راشد | Emirati, Sharjah | man, ~60 | Sēf's uncle, majlis host | respectful: yā ʿammi, ṭawīl il-ʿumr | s2u063 (named earlier in family lessons) |
| Rāshid | راشد | Emirati, Sharjah | man, 17 | Bū Rāshid's son | youth speech, slang (B2) | s4u090 |
| Fahad | فهد | Kuwaiti, Kuwait City | man, 24 | Sēf's friend; Kuwaiti forms (shinu, mū, iḥna, ī) | friends | s2u027 |
| Nūra | نورة | Kuwaiti | woman, 28 | Fahad's sister, met on the Kuwait trip | polite | s3u090 |
| unnamed A | — | default urban Emirati | any | shop, café, taxi, clinic, office staff; name the role in the goal | neutral | any |

Settings, Dubai first: karak stand, Dubai Metro, a mall, the office, a university corridor, Sēf's family home, Bū Rāshid's majlis in Sharjah, a winter desert camp, a pharmacy, a clinic, a bank, WhatsApp voice notes. Kuwait (a trip with Fahad) in s3u090–s3u095. Real public places may be named; facts about real organisations, prices or procedures may not be invented.

## 3. Stage 1 (A1): s1u017–s1u066, 50 new units

**Already taught in u1–u16 (don't re-teach):** greetings with salām, hala, shlōnak/shlōnich, ṣabāḥ / masāʼ il-khēr, goodbyes; mashkūr, il-ʿafu, law samaḥt, tfaẓẓal, mumkin, ʿaṭni, allāh ykhallīk, mā gaṣṣart, ʿan idhnak; ismi, min wēn, tsharrafna, ṭālib, ashtaghil; the question words wēn, shu, lēsh, minu, mita, shlōn, cham; sīda, yamīn, yasār, garīb; agdar, aʿarf, ma adri, titkallam, atʿallam, tgūl; fī / ma fī, mub; numbers 1–10, 20, 30, 50, 100, 200, 1,000, dual -ēn; b-cham, ghāli, rkhīṣ, wāyid, ākhir siʿir; abi, tabi, gahwa, chāy, māy, tamr, il-ḥsāb, ʿēsh; il-ḥīn, il-yōm, bāchir, ams, baʿdēn, rāyiḥ, arūḥ, barūḥ, yalla; liff, waggif, is-sāʿa cham, tāksi; ḥayyāk allāh, yaʿṭīk il-ʿāfya, mā shāʼ allāh, in shāʼ allāh, ʿasāk b-khēr, wala yhimmak. Grammar already met as chunks: no copula, ʿind-, ma / mub, modal + bare verb, b- future, rāyiḥ, imperatives liff/waggif.

| Units | Grammar point (the `grammar` label) | Functions and situations | Domain | Glue and core words introduced | Culture |
|---|---|---|---|---|---|
| s1u017–s1u020 | Independent pronouns, full set (ana, inta, inti, huwa, hiya, niḥin, intu, hum); no copula recycled | Emirati greetings and how-are-you; greeting a woman, a group, an elder; asking about someone (huwa wēn?) | people | شحالك, شحالج, هيه, والله ("really? / honestly"), طيب, مرحبا الساع, شو اليديد → ما شي, هلا بك, نحن | greeting order and handshakes between men and women (U) |
| s1u021–s1u026 | Possessive endings on nouns (-i, -ak, -ich, -ah, -ha, -na, -kum, -hum); ة → t before an ending; ḥagg- "belonging to, for" (māl- in Kuwait note); iḍāfa (bēt ubūy) | family: who's who, photos, how many brothers and sisters; whose is this? | family | حق, أمي, أبوي, أخوي, أختي, عيال, ويا "with", كل | mā shāʼ allāh when praising children (S); asking after family without naming a man's wife (U) |
| s1u027–s1u031 | The article and sun letters; adjectives after the noun and agreement (m., f., plural -īn); demonstratives near and far (hādha, hādhi, hādhēla, hādhāk, hādhīch) | describing people, things, clothes and the home; this one or that one? | home, clothes | جذي, هذاك, هذيك, هذيلا, شي, يعني ("I mean"), غرفة | kandūra and shēla as culture words, not core vocabulary (C: كندورة 13.7 pm) |
| s1u032 | checkpoint A | a visit to Sēf's family recycles u017–u031 | — | 6 variant items: شلونج answer forms, إحنا (Kuwait), هذول (Kuwait)… | — |
| s1u033–s1u038 | **Past tense I:** sound verbs, first I and you (shirabt, shirabt, shirabti), then he, she, we, you all, they; ma + past (ma fhimt recycled) | what did you do yesterday? arriving late; a short past-tense question and answer | daily life | البارحة, قبل, أول ("first, before"), رحت / راح (hollow, as chunks), وصلت, رجعت | — |
| s1u039–s1u042 | **Past tense II:** hollow (gilt, shift, kint, nimt), defective (sawwēt, ligēt, mishēt), doubled (ḥaṭṭēt), hamzated (kalt, khadht), "came" (yīt, j→y) | what happened? telling one small event; good news | events | شو صار؟, سويت, جيت, لقيت, مبروك → الله يبارك فيك | — |
| s1u043 | checkpoint B | Sēf tells B about his weekend | — | 6 items | — |
| s1u044–s1u047 | Numbers 11–19 (U), counted nouns after 11 (singular); days of the week (S); parts of the day; telling the time with w-nuṣṣ, w-rubʿ, illa rubʿ (U) | making an appointment; what time do you finish? which day? | time | يوم الجمعة etc., الصبح, العصر, الليل, مرة, ثاني, نص, ربع | prayer times as the frame of the day; the UAE and Kuwaiti weekends (U: confirm current days) |
| s1u048–s1u051 | Imperatives of core verbs, man, woman and group (taʿāl, taʿāli, taʿālu; rūḥ; shūf; khallni); la + verb for "don't" | asking someone to come, wait, look, bring, leave it | home, help | تعال, خلني, شوف, تريا (UAE), جيب لي, لا تروح | — |
| s1u052–s1u055 | Modal + bare imperfect, full set (abi, tabi, tabīn, agdar, tigdar, lāzim, mumkin, yimkin) with you, he, she (S: no linking particle) | wants and abilities; offers; maybe and of course | plans | يمكن, أكيد, طبعا, عادي, عشان ("because"), ما أبي | — |
| s1u056–s1u060 | recycle: possessives, past, modals | breakfast, lunch, dinner; the supermarket; ordering food to the house; at a friend's for a meal | food, home | ريوق, غدا, عشا, دجاج diyāy, سمك simach, أوكي, انزين, صح, بالعافية | karak tea; eating with the right hand; the host keeps offering (S) |
| s1u061–s1u064 | Prepositions of place (fōg, taḥt, jiddām, wara, ṣōb, yamm, barra) | getting around: metro, bus, walking directions; on the phone: "where are you?" | transport | صوب, قدام jiddām, ورا, عدل, برا, ياي "coming", المترو | — |
| s1u065 | checkpoint C | a day out with Sēf: metro, lunch, directions | — | 6 items | — |
| s1u066 | **A1 exit** | "Describe where I live and people I know" (CEFR A1 spoken production, S) | — | 6 items | — |

## 4. Stage 2 (A2): s2u001–s2u090

| Units | Grammar point | Functions and situations | Domain | Glue and core words | Culture |
|---|---|---|---|---|---|
| s2u001–s2u006 | **Present tense I:** sound verbs, full paradigm with -īn (you, a woman) and -ūn (plural) (S); habitual meaning | daily routine; what do you do every day? | routine | دوم, كل يوم, على طول, تدري / تدرين | — |
| s2u007–s2u012 | **Present tense II:** hollow (ygūl, yrūḥ, yshūf), defective (ysawwi, yimshi, yilga, yaʿṭi), doubled (yḥuṭṭ), hamzated (yākil, yākhidh), "come" (yiyi); object -īh after a vowel (nsawwīh, S) | housework, cooking, the weekly shop | household | يطالع, يسوي, ياكل, ياخذ | — |
| s2u013–s2u016 | **Future b-** full paradigm (bitrūḥīn, binrūḥ, biyrūḥūn), b- optional for future (S); negative ma b- (ma barūḥ); ma rāḥ as Kuwaiti-leaning variant | weekend plans; promises; what will you do? | plans | بيصير, ما بروح | — |
| s2u017 | checkpoint D | — | — | 6 | — |
| s2u018–s2u022 | **Progressive gāʿid / gāʿda / gāʿdīn** + verb, agrees with the subject; negative mub gāʿid (S); yālis as UAE variant | phone calls: what are you doing right now? | phone | قاعد, المهم, ألو, لحظة (recycle) | — |
| s2u023–s2u026 | Object endings on verbs (-ni, -ak, -ich, -ah, -ha, -na, -kum, -hum); dative l- + ending (gūl-li, agul-lich, S) | messages, WhatsApp, sending things | technology | طرش "send" (S), تلفون, رسالة, موبايل (recognise) | workplace use of ṭarrish (S) |
| s2u027–s2u030 | Kuwaiti forms for recognition (items glossed "(Kuwait)") | Fahad arrives: understanding a Kuwaiti friend | people | شنو, مو, إحنا, إي / إيه, ماكو / أكو, يمه / يبه, اهو / اهي, حيل | Gulf variety: where the UAE and Kuwait differ (S) |
| s2u031–s2u035 | Comparative afʿal + min, azyan (S); superlative (aḥsan wāḥid) | shopping and bargaining; sizes and colours; returns; the restaurant bill | shopping, money | أحسن, أرخص, أغلى, أكبر, فلوس | — |
| s2u036 | checkpoint E | — | — | 6 | — |
| s2u037–s2u040 | kān: "was" (kān fī, kān ʿindi); kān + imperfect for "used to" (S: 67 of 92 habitual pasts) | childhood; how things used to be | the past | كان, كنت, لما كنت صغير | old Dubai, briefly (C1 goes deeper) |
| s2u041–s2u045 | Time and reason clauses: lamma, awwal mā, baʿad mā, gabil lā (S/C); ʿashān "so that"; lēn "until"; ʿugub mā (UAE) | telling the order of a day; why and what for | narration | لين, عقب, بعد ما, قبل لا, أول ما | — |
| s2u046–s2u049 | Relative illi after a definite noun (S); ish-shay illi | describing people and things more fully; "the one who …" | people | اللي, اللي صار | — |
| s2u050–s2u053 | Numbers II: hundreds, thousands, money (dirham, fils; Kuwaiti dinar in notes); ordinals 1st–10th and awwal / ākhir (S); months by number (S: shahar tisʿa) and by name (U) | prices, dates, birthdays, appointments | numbers | ثلاث مية, ألفين, أول, ثاني, ثالث, شهر | — |
| s2u054 | checkpoint F | — | — | 6 | — |
| s2u055–s2u058 | recycle: present, past; aḥiss "I feel" | at the clinic and pharmacy; I'm ill; get well soon | health | تعبان, يعورني, دكتور, صيدلية, شفيك, سلامات → الله يسلمك, ما تشوف شر | — |
| s2u059–s2u062 | recycle: future, comparatives | weather and seasons; summer travel; welcome back | weather, travel | الحر, الرطوبة, الغبار, البرد, الحمد لله على السلامة | summer heat and life indoors |
| s2u063–s2u067 | recycle: imperatives, object endings | **majlis visit** at Bū Rāshid's: coffee, dates, incense, the long goodbye; addressing elders | hospitality | فنجان, دلة, بخور, كثر خيرك (polite no, S), طال عمرك, طويل العمر, يا عمي, السموحة | the finjān shake to refuse more coffee (S); the long goodbye (S); yā rayyāl is for friends only (S) |
| s2u068–s2u071 | ḥabbēt + verb "I'd like to" (S); widdi; khal / khallīna + verb "let's" (C) | invitations: accepting, declining, suggesting | social plans | ودي, خلنا, يصير؟, أبشر, على هالخشم, على راسي | in shāʼ allāh as a soft "maybe" (S) |
| s2u072 | checkpoint G | — | — | 6 | — |
| s2u073–s2u076 | recycle: kān, illi | feelings and reactions | emotions | زعلان, معصب, مستانس, خايف, صج؟, حرام عليك, ما صارت, خيبة (friends only) | teasing among friends vs with strangers (S: khēba) |
| s2u077–s2u080 | discourse markers | telling news; "so then…"; "mind you…" | conversation | عاد, عيل, ترا, أصلا, شكله, ماشي | — |
| s2u081–s2u084 | Negatives with nobody and nothing: maḥḥad, ma shay, wala shay, wala wāḥid; abad; māni | complaints and "no way" | conversation | محد, أبد, ماني, غصب, ما عليه | — |
| s2u085–s2u087 | "just", "still", "should have" as chunks: tawwni (C), lil-ḥīn (C), chān gilt-li (S, full grammar at B2) | catching up; mild blame | conversation | توه / توني, للحين, جان قلت لي | — |
| s2u088 | Emirati forms for recognition (items glossed "(UAE)") | Sēf's grandmother's way of talking | people | أبا / تبا, جي, هب, الحينه, يرمس, بسير; عسب in a note only | — |
| s2u089 | checkpoint H | — | — | 6 | — |
| s2u090 | **A2 exit** | "Describe my family, living conditions, education and job" (CEFR A2, S) | — | 6 | — |

## 5. Stage 3 (B1): s3u001–s3u110

| Units | Grammar point | Functions and situations | Domain | Core words (examples) | Culture |
|---|---|---|---|---|---|
| s3u001–s3u006 | **Active participles:** rāyiḥ, yāy, nāyim, msāfir (near future), ʿārif, fāhim, shāyif, msawwi; meaning depends on the verb class (S examples; class rules U) | on the way somewhere; travel plans; "I've already eaten" | travel | مسافر, ياي, نايم, عارف, فاهم | — |
| s3u007–s3u011 | **Past progressive** kān gāʿid; inceptive gām + verb (gāmat taktib, S); kān rāḥ "was about to" (S); kint b- "was going to" | telling small incidents with background | storytelling | كان قاعد, قام يصيح, كنت بخابرك | — |
| s3u012 | checkpoint I | — | — | 6 | — |
| s3u013–s3u018 | **Conditionals:** iḏa + perfect (S); lō hypothetical (S); ḥatta lō "even if" (C); ilā "if" (UAE / Bedouin) in notes | offers, advice, plans with conditions | plans | إذا, لو, حتى لو | — |
| s3u019–s3u023 | **Reported speech:** gāl inn- + ending (S: gilt-li innak msāfir); direct quotation; no tense backshift (U) | passing on messages; office gossip | work | قال إنه, يقولون إن, سمعت إن | — |
| s3u024–s3u027 | **Indirect questions:** ma adri wēn…, gūl-li shu…, iḏa "whether" (U) | asking for information politely; at a service counter | services | ما أدري وين, تدري شو, اسأله إذا | — |
| s3u028 | checkpoint J | — | — | 6 | — |
| s3u029–s3u034 | **Form II verbs** (sawwa, ṣallaḥ, ghayyar, wadda, dawwar, ṭarrash, gawwa, S for the last); doubled middle letter | tasks at work; fixing things | work | صلح, غير, ودى, دور, خلص | office hierarchy and politeness |
| s3u035–s3u040 | **Forms III, V, VI** (sāʿad, khābar, sāfar; tʿallam, tʿawwad, tʿarraf; tʿāwan) (U for Gulf examples) | government and services: appointments, forms, help | services | ساعد, خابر, تعود, تعرف | — |
| s3u041–s3u045 | **Forms VII, VIII, X** (ingiṭaʿ, ishtara, iḥtāj, istaʿmal, istānas) (U) | travel problems: lost luggage, a cut-off phone, hotel complaints | travel | انقطع, اشترى, احتاج, استعمل, استانس | — |
| s3u046 | checkpoint K | — | — | 6 | — |
| s3u047–s3u051 | **Passive participle and verbal noun** (maktūb, mamnūʿ, masmūḥ, mashghūl, mitʿawwid; dirāsa, sawāga) (placement S, Gulf forms U) | rules and signs; busy and closed; hobbies | daily life | ممنوع, مسموح, مشغول, متعود, سواقة | — |
| s3u052–s3u056 | **Permission and obligation:** yṣīr / ma yṣīr (C), ʿēb, ḥarām, il-mafrūḍ (C), lāzim ma vs mub lāzim (U), yabī-lah "it needs" (C: يباله 192/2) | etiquette, rules, what's allowed | etiquette | يصير, ما يصير, عيب, المفروض, مب لازم | mosque and majlis etiquette; ʿēb as a social word |
| s3u057–s3u060 | **Hortative khalli / khal** (C); la tkhallīni | making plans with friends; light persuasion | social | خلينا, خله, لا تخليني | — |
| s3u061–s3u064 | **"Just", "still", "no longer":** tawwa + ending, ʿād / ma ʿād, lil-ḥīn, baʿad "still" (U), bāgi "left", ẓall "kept on" (U) | catching up after time away | conversation | توه, ما عاد, للحين, باقي, ظل | — |
| s3u065 | checkpoint L | — | — | 6 | — |
| s3u066–s3u070 | **Relative clauses II:** resumptive pronouns, headless illi (illi yabi yrūḥ, yrūḥ), topic first (il-mudīr, ma shifta il-yōm) (U) | opinions and descriptions; "whoever…" | opinions | اللي يبي, اللي شفته | — |
| s3u071–s3u076 | recycle: all B1 so far | **Religion and seasons:** Ramadan, iftar, Eid, Friday, condolences | religion | مبارك عليكم الشهر, رمضان كريم, تقبل الله, عساكم من عواده, عظم الله أجركم, الله يرحمه, مأجور | Ramadan and Eid formulas (S); ḥagg il-lēla / girgēʿān (U); the ʿazā visit (S) |
| s3u077–s3u082 | recycle; b-raʾyi, aẓunn, aḥiss inn | experiences, plans, ambitions; opinions with reasons (CEFR B1, S) | personal | أظن, أحس إن, حلمي, ودي | — |
| s3u083 | checkpoint M | — | — | 6 | — |
| s3u084–s3u089 | recycle | relationships, friendship, misunderstandings, proper apologies; weddings and new babies | family, feelings | عقبالك, بالأفراح دايمين, سامحني (recycle), زعلت مني؟ | wedding customs (U); mabrūk + mā shāʼ allāh for a baby (S) |
| s3u090–s3u095 | recycle; Kuwaiti forms II | **trip to Kuwait** with Fahad; meeting Nūra; the dīwāniyya | travel | شلونكم, شنو السالفة, دينار, diwaniya words (U) | Kuwaiti sub-dialects (S: Jibla, Sharq); the dīwāniyya (U) |
| s3u096–s3u100 | recycle | health II and emergencies: A&E, a car accident, the police (no invented procedures) | health, safety | إسعاف, حادث, شرطة, تأمين | — |
| s3u101 | checkpoint N | — | — | 6 | — |
| s3u102–s3u107 | recycle: participles, kān gāʿid, lamma, gām | storytelling: narrating an experience at length; jokes | storytelling | مرة من المرات, فجأة, في الآخر | — |
| s3u108 | checkpoint O (stage review) | — | — | 6 | — |
| s3u109–s3u110 | **B1 exit** | (109) unprepared conversation on a familiar topic; (110) narrate an experience (CEFR B1, S) | — | 6 each | — |

## 6. Stages 4 and 5 (B2, C1)

### Stage 4 (B2): s4u001–s4u110, every lesson has a `task`

| Units | Grammar point | Functions and situations | Domain | Culture |
|---|---|---|---|---|
| s4u001–s4u006 | **Counterfactual** lō … chān + perfect; chān "you should have" (S: Alotaibi; CODA جان) | regrets, hindsight, advice about the past | decisions | — |
| s4u007–s4u010 | **Future perfect** b-ykūn + perfect (S); b-ykūn "will probably be" | deadlines and guesses | work | — |
| s4u011–s4u014 | **Form VII passive / middle** (S: ndashsh, yindashsh); yigūlūn as an impersonal | what can and can't be done; rumours | society | — |
| s4u015 | checkpoint P | — | — | — |
| s4u016–s4u020 | **Double objects** with iyyā- (ʿaṭni iyyāh) and contractions (U) | lending, borrowing, giving it back | daily life | — |
| s4u021–s4u024 | **Quadriliteral verbs** and English verbs with Arabic endings (kansal, chayyak, ballak: U) | tech trouble; cancelling, checking, blocking | technology | youth loans |
| s4u025–s4u028 | **Wish, want, prefer:** atmanna, yā rēt, afaẓẓil, widdi (placement S, forms U) | preferences and hopes | personal | — |
| s4u029 | checkpoint Q | — | — | — |
| s4u030–s4u034 | **Diminutives** (ṣghayyir), uses of abu / umm, forms of address (yā ʿammi, yā khālti, yā bū X, ukhti, yā shēkh), exclamatives (U) | addressing people of every rank; nicknames | people | bū-names, kunya conventions (U) |
| s4u035–s4u039 | **kān / ykūn strings** (lāzim ykūn, yimkin kān); "as if" (awinna, UAE, S; kinnah / chinnah, C); "I think" (aẓunn, aḥiss, atwaqqaʿ, C); reciprocals (baʿaẓ, C); -an adverbs (ṭabʿan, aṣlan, taqrīban) | guessing, interpreting, describing impressions | conversation | — |
| s4u040–s4u043 | **Word order:** topic first with a resumptive pronoun, fronting for emphasis, question word at the end (S), agreement with non-human plurals (U) | emphasis and contrast in argument | conversation | — |
| s4u044 | checkpoint R | — | — | — |
| s4u045–s4u050 | recycle | agreeing, disagreeing politely, conceding (ṣaḥ bas…, maʿak ḥagg bas…); pros and cons | cost of living, rent | — |
| s4u051–s4u056 | recycle | society and community: neighbours, traffic, weddings costs, national days | society | National Day dates (U: verify) |
| s4u057 | checkpoint S | — | — | — |
| s4u058–s4u063 | recycle | media: TV series, football, music, social media | media, sport | football rivalries (U) |
| s4u064–s4u069 | recycle; office register | work II: job interview, salary, presenting, complaining to a manager | work | office vs majlis register |
| s4u070 | checkpoint T | — | — | — |
| s4u071–s4u076 | recycle | health and lifestyle: diet, gym, sleep, stress | health | — |
| s4u077–s4u082 | recycle; narrative markers | long storytelling, anecdotes, jokes (CEFR B2, Qasid 302, S) | storytelling | — |
| s4u083 | checkpoint U | — | — | — |
| s4u084–s4u089 | recycle | **proverbs and idioms I**, one per lesson at most: سو خير وقطه بحر, من قال ها سمع, غلطة الشاطر بألف, الذيب ما يهرول عبث (S, Wiktionary); الخنفس في عين أمه غزال (S, Gulf News, script U) | proverbs | proverbs are mostly for recognition (S) |
| s4u090–s4u095 | recycle | youth speech and code-switching with Rāshid: "ana ṭarrashtlak message" (S), kashkha (S), slang (U) | youth | code-switching as identity (S) |
| s4u096 | checkpoint V | — | — | — |
| s4u097–s4u102 | recycle; fuṣḥā-fed vocabulary | education and careers: studying abroad, AI and technology | education | — |
| s4u103–s4u107 | recycle | environment and development: heat, water, cities (no invented statistics) | environment | — |
| s4u108 | checkpoint W | — | — | — |
| s4u109–s4u110 | **B2 exit** | (109) argue the advantages and disadvantages of a topical issue; (110) sustain a view in discussion (CEFR B2, S) | — | — |

### Stage 5 (C1): s5u001–s5u090, every lesson has a `task`

C1 grammar categories come from the table of contents of a published Emirati Arabic reference grammar. Only the contents page was read, so every C1 grammar note is **U until the book is bought and checked**.

| Units | Grammar point | Functions and situations | Culture |
|---|---|---|---|
| s5u001–s5u006 | **Epistemic and evidential modality:** chūd (S: Kuwaiti study; C جود 270/285), yimkin, akīd, shakl-ah, wāẓiḥ inn, yigūlūn inn | hedging, guessing, reporting what you've heard | — |
| s5u007–s5u010 | **Optatives and hortatives:** ʿasa + ending, allāh y- wishes, yā rēt, khal + verb | wishing, blessing, urging | blessings as social glue |
| s5u011–s5u014 | **Assertive gid** in kān gid + perfect (S: Alotaibi, optional); emphasis with wallāh, aṣlan, tara, ʿād; understatement | insisting, emphasising, playing down | — |
| s5u015 | checkpoint X | — | — |
| s5u016–s5u020 | **Negative polarity and concord:** wala marra (S), abad, maḥḥad … wala, ma … illa, ma ʿumri | strong denials, "never in my life" | — |
| s5u021–s5u025 | **Free and non-restrictive relatives; embedded and rhetorical questions; exclamatives** | arguing, reproaching, marvelling | — |
| s5u026–s5u030 | **Concessives, parentheticals, ellipsis;** repair (aqṣid, khallni agūlha b-ṭarīga thānya) | conceding, correcting yourself, short replies | — |
| s5u031 | checkpoint Y | — | — |
| s5u032–s5u037 | **Politeness, honorifics, borrowed interjections, "trendy language"** (ch. 17–18) | speaking to rank and age; sheikhs and officials (ṭawīl il-ʿumr, S) | honorifics (S: Ask Ali) |
| s5u038–s5u045 | **Register shifting** between majlis, office and formal speech; educated spoken Arabic (Gulf grammar with fuṣḥā vocabulary, q kept in classicisms); triglossia with English (ch. 1.2) | a toast, a short formal welcome, a radio-style interview, all labelled (formal) | triglossia in the UAE |
| s5u046 | checkpoint Z | — | — |
| s5u047–s5u052 | recycle | irony, humour, teasing: wāyid ʿalēk (S), khēba (S), awinna (S); where banter stops | humour |
| s5u053–s5u058 | recycle | persuasion and negotiation: business, renting, buying a car | — |
| s5u059–s5u063 | recycle | conflict: complaints, calming things down, formal apology, mediating (ṣulḥ) | — |
| s5u064 | checkpoint AA | — | — |
| s5u065–s5u070 | recycle | **heritage I:** the sea, pearling, the dhow, old Dubai and the frīj; recognise-only old words (S: NLA glossary; KUNA list of 1950s words) | pearling and sea life |
| s5u071–s5u075 | recycle | **heritage II:** the desert, falconry, camels, il-barr, the ʿizba; nabaṭi poetry for recognition | desert life, poetry |
| s5u076–s5u080 | recycle; fuṣḥā bridge | religion at depth: the Friday sermon (with fuṣḥā R4–R5), charity and zakat vocabulary (Gumar has no زكاة, so other sources), Kuwaiti Ramadan proverbs (S: Al-Jarida) | — |
| s5u081 | checkpoint AB | — | — |
| s5u082–s5u087 | recycle | extended presentation and discussion: building on another speaker's point, chairing, summarising, debating | — |
| s5u088 | recycle | proverbs II: Emirati heritage proverbs (S: The National 2013, transliteration only; Arabic script U) | — |
| s5u089–s5u090 | **C1 exit** | (089) extended presentation integrating sub-themes and answering another speaker; (090) the same topic in majlis, office and formal registers | — |

## 7. Social formulas with their fixed replies

Teach the pair together, in the same dialogue. Evidence: S sourced; C Gumar phrase count AE/KW; U unsourced. Formulas marked U for the **reply** may be used in dialogue only after a native confirms the reply.

| Formula | Fixed reply | When | Evidence | Taught in |
|---|---|---|---|---|
| السلام عليكم | وعليكم السلام | any greeting; more religious than hala (S) | S | u1 |
| هلا / هلا والله | هلا بك / هلا فيك, هلا والله | casual hello | C هلا بك 71/80, هلا فيك 81/261 | u1; reply s1u017 |
| شلونك؟ / شحالك؟ | زين الحمد لله; بخير الله يسلمك | how are you | C بخير الله يسلمك 38/24; pair U | u1; s1u017 |
| مرحبا الساع | (reply U: مرحبا بك / هلا والله) | warm welcome to an arriving guest (UAE) | S (Eton); C 237/2 | s1u017 |
| شو اليديد؟ | ما شي | what's new? | S (Eton); C weak 8/0; ما شي 549/11 | s1u017 |
| شخبارك؟ | زين الحمد لله | what's your news? | C 245/401; reply U | s1u019 |
| صباح الخير / مساء الخير | صباح النور / مساء النور | time of day | S; C 336/339 | u11 |
| تصبح على خير / تصبحين على خير | وانت من أهله | good night | C 171/116, reply 53/49; pair U | s1u044 |
| مشكور / مشكورة | العفو | thanks | S | u2 |
| تسلم / تسلمين | الله يسلمك | thanks for a favour | C 1226/890; pair U | s1u056 |
| ما قصرت | ما سوينا شي | thanks for real help | stage 1 | u12 |
| يعطيك العافية | الله يعافيك | to someone working or helping | S (phrase); reply U | u10 |
| بالعافية | الله يعافيك | after someone eats or drinks | S (AOL); reply U; C 144/146 | s1u056 |
| حياك الله / حياج الله | الله يحييك / الله يحييج | welcome to a guest | C 56/55, 36/30 | u10 |
| تشرفنا | الشرف لي | nice to meet you | stage 1 | u3 |
| مبروك | الله يبارك فيك / فيج | any congratulations | C 304/269 (reply); general pair U | s1u039 |
| في أمان الله | في أمان الكريم | goodbye | stage 1; C 4/16 | u11 |
| سلامات | الله يسلمك | to someone ill | C 198/82; pair U | s2u055 |
| ما تشوف شر | الله يسلمك (U) | to someone ill | C 25/34; reply U | s2u055 |
| عسى ما شر؟ | ما شر, الحمد لله | "nothing bad, I hope?" | C 103/136; pair U | s2u055 |
| الحمد لله على السلامة | الله يسلمك | welcome back from a trip or illness | C 180/89; pair U | s2u059 |
| كثر خيرك | (no reply needed; host insists or accepts) | polite refusal of an offer (S, Wiktionary) | S; C weak 3/0 | s2u063 |
| طال عمرك / طويل العمر | — (a respectful address, not a pair) | to elders, sheikhs, strangers (S) | S; C 172/123, 80/11 | s2u063 |
| السموحة | ما عليه / عادي | "excuse me, pardon" (U meaning) | C 489/67 | s2u063 |
| أبشر | (reply U) | "consider it done" | C 99/96; reply U | s2u068 |
| على هالخشم / على راسي | — | "gladly, at your service" | C 18/17, 375/170; usage U | s2u068 |
| الله يهداك | — | mild exasperation | C 98/91; usage U | s2u073 |
| مبارك عليكم الشهر / شهرك مبارك | الله يبارك فيك | start of Ramadan | S (The National) | s3u071 |
| رمضان كريم | الله أكرم | Ramadan | S | s3u071 |
| تقبل الله (منا ومنكم) | منا ومنكم | after prayer, fasting, iftar | S; C 20/30 | s3u071 |
| عساكم من عواده | repeat it | Eid (UAE and GCC) | S (reply: repeat) | s3u073 |
| من العايدين والفايزين | وانت من العايدين (U) | Eid | S; C 27/7 | s3u073 |
| عظم الله أجركم | أجرنا وأجركم (U) | condolences to the family | S (phrase); C 26/24; reply U, C 4/10 | s3u075 |
| الله يرحمه / يرحمها | آمين (U) | on mentioning the dead | C 571/338 | s3u075 |
| مأجور | (reply U) | after a good deed, a funeral, paying for others | S (Wiktionary) | s3u076 |
| عقبالك | الله يسمع منك | at weddings and graduations | C 60/39, 47/58; pair U | s3u084 |
| بالأفراح دايمين | (U) | weddings, Eid | S (Eid list); wedding use inferred | s3u085 |
| new-baby, new-house and new-car formulas (beyond mabrūk + mā shāʼ allāh, S) | U | — | U: none sourced, don't write any until a native supplies them | B1 only after native check |

## 8. The glue words: all taught by the end of A2

These are the high-frequency dialect forms in the Gumar AE+KW top 1,000 (names, narrative verbs and spelling variants left out). Rank and AE:KW rate per million are from `gumar_ae_kw_top1000.tsv`.

| Form | Rank | AE:KW pm | Tag | Taught in |
|---|---|---|---|---|
| بس | 5 | 8146:7915 | GULF | u6 |
| اللي | 10 | 4906:5151 | GULF | s2u046 |
| شي | 11 | 4104:4757 | GULF | s1u027 |
| والله | 14 | 3558:3360 | GULF | u1 (هلا والله); alone s1u017 |
| مو | 22 | 1109:4313 | KW | note in u13; item s2u027 |
| شو | 24 | 5011:139 | UAE | u7 |
| ليش | 27 | 2358:2524 | GULF | u7 |
| انتي | 30 | 2147:2553 | GULF | u3 |
| الحين | 45 | 1707:1819 | GULF | u8 |
| وين | 50 | 1757:1528 | GULF | u7 |
| راح | 54 | 1071:2039 | GULF | s1u033 |
| عشان | 56 | 1557:1550 | GULF | s1u052; purpose s2u041 |
| شوي | 57 | 1558:1528 | GULF | u9 |
| خلاص | 62 | 1234:1708 | GULF | u15 |
| مب | 74 | 2297:128 | UAE | u13 |
| شنو | 82 | 465:1715 | KW | s2u027 |
| هلا | 84 | 641:1438 | GULF | u1 |
| صار | 85 | 813:1215 | GULF | s1u039 |
| وش | 87 | 562:1437 | SA | note only (u3, s2u027) |
| مرة | 92 | 1014:862 | GULF | s1u044 |
| يلا | 95 | 706:1144 | GULF | u8 |
| يمه | 98 | 387:1432 | KW | s2u027 |
| هذي | 100 | 735:1078 | GULF | u14 |
| أول | 105 | 812:919 | GULF | s1u033 |
| زين | 108 | 968:741 | GULF | u1 |
| وايد | 113 | 1051:606 | GULF | u4 |
| أبي | 114 | 413:1244 | GULF | u6 |
| لازم | 116 | 814:834 | GULF | u11 |
| حق | 124 | 822:715 | GULF | s1u021 |
| يمكن | 131 | 786:701 | GULF | s1u052 |
| جذي | 133 | 294:1185 | GULF | s1u027 |
| لج / عليج | 137 / 143 | 741:701 / 836:590 | GULF | s1u021 (-ich endings) |
| هيه | 139 | 1395:35 | UAE | s1u017 |
| طيب | 142 | 412:1014 | GULF | s1u017 |
| منو | 149 | 782:612 | GULF | u7 |
| صوب | 152 | 1244:129 | UAE-leaning | s1u061 |
| لين | 155 | 892:460 | GULF | s2u041 |
| خير (shu fīk? khēr) | 157 | 675:668 | GULF | s2u055 |
| انزين | 158 | 876:464 | GULF | s1u056 |
| عيل | 177 | 894:321 | GULF | s2u077 |
| تبي | 182 | 342:836 | GULF | u6 |
| أكيد | 184 | 568:609 | GULF | s1u052 |
| عاد | 190 | 633:503 | GULF | s2u077 |
| صح | 191 | 645:489 | GULF | s1u056 |
| ما أدري | 195 | 512:601 | GULF | u13 |
| حبيبي | 200 | 419:687 | GULF (register) | s2u063 |
| عقب | 202 | 895:203 | UAE | s2u041 |
| ويا | 206 | 764:318 | GULF | s1u021 |
| محد | 208 | 676:399 | GULF | s2u081 |
| أوكي | 209 | 370:704 | GULF (loan) | s1u056 |
| شلون | 217 | 200:827 | KW-leaning | u15 |
| بعدين | 229 | 495:478 | GULF | u8 |
| صج | 259 | 274:607 | GULF | s2u073 |
| يصير | 266 | 293:559 | GULF | s2u068 |
| جان | 269 | 598:247 | GULF | s2u085 (chunk); B2 grammar |
| عادي | 273 | 441:390 | GULF | s1u052 |
| هني | 290 | 436:356 | GULF | u3 |
| باكر (باجر) | 292 | 452:337 | GULF | u8 |
| جي | 297 | 688:76 | UAE | s2u088 |
| أحسن | 311 | 325:415 | GULF | s2u031 |
| أقدر | 326 | 281:445 | GULF | u9 |
| حرام | 334 | 366:342 | GULF | s2u073 |
| طبعا | 344 | 338:351 | GULF | s1u052 |
| المهم | 379 | 402:251 | GULF | s2u018 |
| قاعد | 390 | 231:402 | GULF | s2u018 |
| تدري | 391 | 247:386 | GULF | s2u001 |
| للحين | 418 | 152:447 | GULF | s2u085 |
| خل / خلني | 422 | 241:354 | GULF | s1u048 |
| تعال | 500 | 257:263 | GULF | s1u048 |
| أصلا | 527 | 266:220 | GULF | s2u077 |
| شكله | 531 | 277:208 | GULF | s2u077 |
| ماشي | 537 | 394:87 | GULF | s2u077 |
| إحنا | 547 | 106:365 | KW | s2u027 |
| حيل | 564 | 93:367 | KW-leaning | s2u027 |
| قدام | 571 (as جدام) | 300:153 | GULF | s1u061 |
| ما في | 581 | 166:280 | GULF | u13 |
| ترا | 606 | 219:207 | GULF | s2u077 |
| يطالع | 609 | 270:154 | GULF | s2u007 |
| ودي | 725 | 151:208 | GULF | s2u068 |
| ياي | 739 | 247:106 | GULF | s1u061 |
| دوم | 852 | 198:106 | GULF | s2u001 |
| توه | 861 | 152:149 | GULF | s2u085 |
| ماني | 928 | 85:192 | GULF | s2u081 |
| غصب | 935 | 107:168 | GULF | s2u081 |
| برا | 941 | 125:148 | GULF | s1u061 |
| أبد | 798 | 166:160 | GULF | s2u081 |

UAE-only forms taught for recognition in s2u088: أبا (594), هب (466), الحينه (450), بسير (623), يالس (783), يرمس; عسب (437) appears in a note only.

## 9. Grammar recycling map

Each point is taught in its block and must reappear, in use, in the listed later ranges. Writers of the later block check that at least one dialogue line uses it.

| Point | Taught | Recycled in |
|---|---|---|
| possessive endings | s1u021 | every stage; -ich forms in every block with Maryam or Umm Sēf |
| past tense (all types) | s1u033–s1u042 | s2u037 (kān), s2u041 (time clauses), s3u007 (kān gāʿid), s3u102 (storytelling), s4u077 |
| present tense -īn / -ūn | s2u001–s2u012 | s2u018 (progressive), s2u037 (used to), s3u013 (conditionals), all later dialogues |
| future b- | u8, s2u013 | s3u013 (apodosis), s4u007 (future perfect) |
| gāʿid | s2u018 | s3u007 (kān gāʿid), s4u040 |
| object and dative endings | s2u023 | s3u019 (gāl-li innak), s4u016 (double objects) |
| comparatives | s2u031 | s4u045 (pros and cons), s5u053 |
| illi | s2u046 | s3u066 (resumptive, headless), s5u021 (free relatives) |
| participles | u8 (rāyiḥ), s3u001 | s3u047 (passive participle), s4u035 |
| conditionals | s3u013 | s4u001 (counterfactual), s5u026 (concessives) |
| reported speech and indirect questions | s3u019–s3u027 | s5u001 (evidentials), s5u021 |
| derived forms | s3u029–s3u045 | s4u011 (Form VII), s4u021 (quadriliterals) |
| modals | u9, u11, s1u052, s3u052 | s4u035 (kān / ykūn strings), s5u001 (epistemic) |
| negation | u13, s2u081 | s5u016 (negative concord) |
| register and address | s2u063 | s4u030, s5u032, s5u038 |

## 10. How earlier material is recycled

1. **Cards.** The app's spaced review brings back every item and every 2–8-word dialogue line. Lessons don't need to drill old items, only use them.
2. **Dialogues.** Each new dialogue uses at least 3 items from the previous 10 units and at least 2 from more than 30 units back. The reviewer lists them in the review sheet.
3. **Checkpoints** every 6 to 12 units put the block's items into a new scene (§1).
4. **Grammar** follows the map in §9.
5. **Cast continuity.** Sēf, Maryam, Bū Rāshid and Fahad keep their lives going (Sēf's exams, Maryam's project, the Kuwait trip), so earlier situations come back naturally.
6. **Stage 1 is never re-taught.** Its phrases appear in later dialogues verbatim (STYLE §3).
7. **B2 and C1 tasks** re-use earlier functions: a B2 task may ask for an A2 majlis role-play done at B2 length.

## 11. B2 and C1 tasks

Every B2 and C1 unit has a `task` (400 characters maximum). A task takes 10 to 15 minutes and produces something: a voice note, a summary, a conversation. Links rot, so tasks never contain URLs. They name a kind of content and give **search terms in Arabic and English**.

**Task types (alternate them):**

| Code | Type | Example wording |
|---|---|---|
| I1 | gist listening | "Search YouTube for «مسلسل إماراتي» (Emirati series). Watch 5 minutes of any episode. Note who is arguing and about what. Say a 30-second summary aloud." |
| I2 | item hunt | "Search «بودكاست إماراتي» (Emirati podcast). Listen until you hear 3 of today's items. Write down the sentence around each." |
| I3 | shadowing | "Pick 5 short lines from any Emirati vlog («يومياتي في دبي»). Pause, repeat each one twice, matching speed." |
| C1 | conversation with a person | "With a tutor or exchange partner (search a tutoring site for «Emirati Arabic tutor»), ask these 4 questions about their weekend and use 3 of today's items in your answers." |
| C2 | voice note | "Record a 60-second voice note to Sēf saying why you can't come and what you suggest instead. Use chān and khallīna." |
| C3 | role-play in the app | "In Talk, ask your partner to play a landlord who won't lower the rent. Keep it going for 8 turns." |
| M | mediation | "Explain to an English-speaking friend, in English, what the clip you watched was about and one phrase you didn't know." |

**Durable search terms** (check each still returns dialect before using it): مسلسل إماراتي, مسلسل كويتي, بودكاست إماراتي, بودكاست كويتي, سوالف (chats), مقابلة باللهجة الإماراتية, طبخ إماراتي, رمضان في الإمارات, العيد في الكويت, سنع (Emirati etiquette), قصص الغوص (pearl diving stories). Long-running titles that are probably stable [U: check]: the Emirati cartoon فريج (Freej), the Kuwaiti classic درب الزلق.

**Dialect check, written into every input task:** "Within a minute you should hear شو / مب (UAE) or شنو / مو (Kuwait). If you hear سوف, ليس or هل all the time, it's fuṣḥā: pick another clip."

**Stage pattern:** B2 alternates input (I1–I3) and output (C1–C3, M), with a conversation task at least every third unit. C1 tasks are longer (10-minute conversations, 2-minute monologues), and from s5u038 they switch register on purpose ("now say it as if to Bū Rāshid's majlis").

## 12. Culture topics by stage

| Stage | Topics (culture field, ≤400 characters) |
|---|---|
| A1 | greetings and handshakes between men and women (U); mā shāʼ allāh and the evil eye (S); Arabic coffee and dates; karak; the right hand; prayer times in the day; the weekend (U); Dubai's mix of nationalities and when English is the working language; kandūra, ghitra, shēla, ʿabāya as culture words |
| A2 | majlis etiquette: finjān shake, bukhūr, the long goodbye (S); refusing politely (S); addressing elders and yā rayyāl (S); asking after family without naming a man's wife (U); summer life; UAE and Kuwaiti speech differences (S) |
| B1 | Ramadan, iftar, Eid and ʿīdiyya (S, U); ḥagg il-lēla and girgēʿān (U); condolences and the ʿazā (S); weddings and new babies (S partial, U); office hierarchy; the Kuwaiti dīwāniyya (U); Kuwaiti sub-dialects (S) |
| B2 | code-switching and identity (S); loanword layers from English, Persian, Hindi-Urdu, Turkish (S); national days (U); football and TV drama; proverbs (S); sensitive words: descent labels, khaddāma vs ʿāmla (U) |
| C1 | pearling and the sea (S: NLA); the desert, falconry, the ʿizba; nabaṭi poetry; Kuwaiti Ramadan proverbs (S); the words the young no longer use (S: KUNA); honorifics and the majlis of a sheikh (S); triglossia (S, chapter title) |

## 13. The fuṣḥā track: 1,000 words and 82 readings

**Purpose:** reading and understanding only (signs, forms, news, the Friday sermon), never speaking. It runs alongside the dialect lessons and, from B2, feeds the abstract vocabulary of educated Gulf speech. Rows in `content/msa.json` are `[vowelled ar, translit, english, gulf equivalent, domain]`.

**Gulf column format:** `G=` for a word identical in Gulf speech (شركة); `G~ <gulf translit>` for a cognate with a sound shift (قهوة → `G~ gahwa`); `M <gulf script> <gulf translit>` for a word Gulf speech doesn't use (الآن → `M الحين il-ḥīn`). Most effort goes to M words (S: only about 21% of spoken words are identical to fuṣḥā in the one diglossia study, Palestinian). The 44 existing rows have no gulf or domain column yet and should be backfilled.

**Domain values:** function, signs, forms, services, news, religion, general.

**Order: the words Gulf speech never uses come first** (S, report: the M-list). They double as the dialect lessons' MSA blacklist. The ranked spine beyond these comes from the KELLY Arabic list (CC BY-NC-SA) cross-checked against Buckwalter and Parkinson; neither could be downloaded in the research, so **every batch after F03 needs the list obtained first** (U).

| Batch | Stage | Words | Domain | Contents (examples; never duplicate the 44 in F00) |
|---|---|---|---|---|
| F00 | 1 | 44 | mixed | shipped: مرحبًا, أريد, ماذا, الآن, سوف, ليس, لم, الذي, هل, مخرج, مغلق, ممنوع… |
| F01 | 1 | 35 | function | the M-list not yet shipped: لن, جدًا, فقط, يجب, منذ, عندما, هذه, ذلك, تلك, هؤلاء, التي, الذين, حيث, خلال, لقد, يوجد, لدى, أيضًا, كذلك, لذلك, بينما, إلى, أنّ, لكنّ, ثمّ, كما, لأنّ, هنا… |
| F02 | 1 | 40 | signs | مدخل, خروج, اسحب, ادفع, طوارئ, استقبال, صيدلية, مصلى, للرجال, للنساء, العائلات, موقف, قف, الرجاء, يرجى, التدخين, مصعد, الطابق, مغادرة, وصول, بوابة, تذكرة… |
| F03 | 1 | 31 | forms (time) | days, Gregorian months, صباحًا, مساءً, ظهرًا, هـ / م after years, Eastern digits ٠–٩ (U: signage digit use) |
| F04 | 2 | 50 | forms | الاسم, اسم العائلة, تاريخ الميلاد, الجنسية, رقم الهوية, الإقامة, جواز السفر, العنوان, الحالة الاجتماعية, التوقيع, ذكر, أنثى, الرسوم, فاتورة, المبلغ, شامل الضريبة… |
| F05 | 2 | 50 | services | menus, shops, prices, banks, clinics, pharmacies: مشويات, عصائر, وجبة, السعر, خصم, حساب, صراف آلي, موعد, وصفة طبية… |
| F06 | 2 | 50 | general | core fuṣḥā verbs with their Gulf partners: رأى (M شاف), جاء, أعطى, فعل / عمل (M سوى), نظر (M طالع), جلس, أرسل (M طرش), انتظر, وجد (M لقى), أخذ, سأل, أجاب, بدأ, انتهى… |
| F07 | 2 | 50 | news | headline nouns: وزارة, مجلس, شعب, منطقة, مدينة, عاصمة, العالم, الخليج, الإمارات, الكويت, مشروع, خطة, مبادرة, نفط, مليار… |
| F08 | 3 | 50 | news | news verbs: أكد, أعلن, أشار, أضاف, أوضح, تمّ, عقد, افتتح, أطلق, استقبل, زار, دعا, ارتفع, انخفض, بلغ… |
| F09 | 3 | 50 | news | government, economy and society |
| F10 | 3 | 50 | services | weather, environment, roads and transport news |
| F11 | 3 | 50 | religion | mosque and khuṭba openings (الحمد لله, أما بعد, أيها المسلمون), prayer names, Hijri months, Ramadan and Eid notices (chosen from sermons and notices, not web frequency, S: KELLY's religious bias) |
| F12 | 3 | 50 | general | health, education, work |
| F13 | 4 | 50 | news | politics and international relations |
| F14 | 4 | 50 | news | economy and business |
| F15 | 4 | 50 | general | culture, sport, technology, media |
| F16 | 4 | 50 | religion | sermon discourse II, Qurʾanic set phrases (قال تعالى) |
| F17 | 4 | 50 | general | abstract nouns and verbal-noun patterns (تطوير, تعزيز, مشاركة, تحقيق) |
| F18 | 5 | 50 | function | connectors and stance: إلا أنّ, رغم, بالرغم من, من ناحية, بالإضافة إلى, وفقًا لـ, نظرًا لـ, أمّا … فـ, بل, لا سيّما |
| F19 | 5 | 50 | general | editorial and opinion vocabulary |
| F20 | 5 | 50 | news | formal speech, titles and ceremonies: صاحب السمو, معالي, سعادة, يسرّني, أتقدّم بالشكر |

Totals: 150 known words by the end of stage 1, 350 by stage 2, 600 by stage 3, 850 by stage 4, 1,000 by stage 5. Domain totals come out near the report's suggested quota (about 120 function, 250 news and government, 150 signs and services, 80 forms, 100 religion, 300 general; the quota itself is a design inference).

**Graded readings** (`content/readings.json`; format `{id, level, stage, title, lines:[[ar, en]], questions:[[question, [options], answer]]}`; the app unlocks a reading when the learner reaches its stage).

| Level | Stage (unlock) | Number | Length | Text type | New words per text | Target coverage (lemmas, clitics stripped) | Vowelling | Questions |
|---|---|---|---|---|---|---|---|---|
| R1 | 1 | 12 | 5–30 words | signs, labels, a menu, a receipt, a metro notice | 3–5 | 90% (glossed) | full on new words, none on G= words | 2 |
| R2 | 2 | 16 | 30–80 | notices, a form, short headlines, a shop flyer | 4–6 | 95% | new and ambiguous words only | 3 |
| R3 | 3 | 20 | 80–150 | news briefs, announcements, a mosque notice, a weather report | 5–8 | 95–97% | disambiguating marks only (passive, shadda) | 3–4 |
| R4 | 4 | 20 | 150–300 | a news story, a sermon excerpt, a feature | 6–10 | 97–98% | none in the text; the batch cards are the vowelled glossary | 4 |
| R5 | 5 | 14 | 300–500 | adapted news and editorial | ≤10 | 98% | none | 4–5 |

Reading rules: ids `r1-01` … `r5-14`; within a level, put them in batch order so each text uses only words from batches already unlocked plus G= words; one line per sentence, 20 words at most, so line playback works; questions in English. Wrong vowels are the most disruptive condition for readers (S: Alseraye 2024), so **a reading with any doubtful vowel mark ships without it**. Texts are fictional and generic ("the ministry", "a Dubai company"): no real people, no quotes, no invented news about real organisations, no real dates.

## 14. Still unsourced: needs native confirmation before it ships as an item

1. **Numbers and time:** 11–19 (Gumar has almost no hits, because novels write digits), 300–900, 2,000 and up, counted nouns after 11 and 100, the -ar form before nouns, telling the time (w-rubʿ, illa rubʿ, w-thilth), month names in speech, ordinals above 10.
2. **Modals:** the exact force of yṣīr / ma yṣīr, ʿēb, ḥarām, il-mafrūḍ, yabī-lah; the scope of mub lāzim vs lāzim ma; tawwa, ʿād / ma ʿād, bāgi, baʿad "still", ẓall, ṣār + verb.
3. **Clause structure:** indirect questions, iḏa "whether", resumptive pronouns, headless illi, ilā "if", baʿdēn, ḥatta, gabil-ma, yōm "when" as connectors; whether reported speech backshifts.
4. **Morphology:** the full suffix table for Dubai and Kuwait; iyyā- chains and ʿaṭnīh vs ʿaṭni-yyāh; Forms III and V–X with Gulf examples; verbal nouns; participle meanings (mitʿawwid, shāyif); diminutives; non-human plural agreement; agreement of māl.
5. **Replies to formulas:** every reply marked U in §7, and the wedding, new-baby, new-house and new-car formulas.
6. **Discourse and address:** khalāṣ, ʿayal, ʿādi, yā salām, yā ḥaẓẓak, allāh yihdāk; yā bū X naming, yā ʿammi, yā khālti, ukhti, akhūy, yā shēkh; kinship vocatives.
7. **Course-specific choices made here:** which ج-words a Dubai speaker says with y (the y-list); whether ج is a sun letter when said y (il-yidīd vs iy-yidīd); كيف said chēf or kēf; قدام said jiddām or chiddām; تريا as the default "wait"; أمايه / أبويه pronunciation; whether هيه sounds natural from a foreign learner; the exceptions ريّال and جذي.
8. **Youth and loans:** kafu, ʿāsh, current social-media slang; English verbs with Arabic endings (kansal, chayyak, ballak); Arabizi; how often natives write چ and گ.
9. **Regional cells:** Abu Dhabi mash; Qatari, Bahraini and Saudi Eastern forms; the wish / wēsh split.
10. **Taboo and sensitivity:** descent labels, animal insults, the ṭalāg and ḥarām oaths, asking after a man's wife, khaddāma vs ʿāmla.
11. **Proverbs:** Arabic script for The National's 2013 Emirati set; which proverbs younger people still say.
12. **Facts:** the current UAE and Kuwaiti weekends, national day dates, any government procedure used in a B1 services lesson.
13. **C1 grammar:** all of it, until a full Emirati reference grammar is bought and read.
14. **Fuṣḥā track:** a verified frequency ranking (KELLY or Buckwalter must be obtained); Eastern vs Western digits on Gulf signs; Hijri dates on UAE and Kuwaiti documents.
15. **Scope numbers:** every lesson, item and hour estimate in this file (E).

Five purchases or downloads would close most of this list (S, report): Holes, *Colloquial Arabic of the Gulf*; two published Emirati grammars; a Gulf Arabic-English dictionary; the CODA* seed lexicon (manual download); Hanan Al Fardan's *Spoken Emirati Phrasebook* for formula replies.
