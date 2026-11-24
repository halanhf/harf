# Graded readings brief (R1–R5, 82 texts)

Read FRAMEWORK.md §13 (the readings table and "Reading rules") and STYLE.md §8 and §10 first. FUSHA_LEAD.md "Reading batches" has the file format.

## Files
- One file per level: `content/readings/r1.json` … `r5.json`, a JSON array of `{id, level, stage, title, lines:[[arabic, english]], questions:[[question, [options], answer]]}`.
- ids `r1-01`…`r1-12`, `r2-01`…`r2-16`, `r3-01`…`r3-20`, `r4-01`…`r4-20`, `r5-01`…`r5-14`. `level` = `stage` = the level number.
- Title: short, in English (the app shows it in an English list), e.g. "Car park sign", "Weather: a hot weekend".

## The words a reader has
- `python3 tools/reading_check.py rN` prints each text's coverage and the words not yet in the learner's set (fuṣḥā rows unlocked by that stage + dialect items taught by that stage + a few function words). Matching is crude: judge the list yourself.
- Target coverage per §13 (R1 90%, R2 95%, R3 95–97%, R4 97–98%, R5 98%), and at most the §13 number of new words per text (R1 3–5, R2 4–6, R3 5–8, R4 6–10, R5 ≤10). Proper names (generic: "Dubai", "the ministry"), digits and times don't count. **Course-lead ruling:** in a short text the two targets conflict (4 new words in a 15-word sign is 73%); every line has its English one tap away, so the new-word count governs and the percentage is a guide.
- Fuṣḥā rows are in content/msa.json and content/msa/w1–w3.json. Unlocked: stage 1 = msa.json + w1 rows 0–105 (F01–F03); stage 2 = w1 rows 106–305 (F04–F07); stage 3 = w2 rows 0–249 (F08–F12); stage 4 = w2 rows 250–349 + w3 rows 0–149 (F13–F17); stage 5 = w3 rows 150–299 (F18–F20). Build each text around its level's own batches, so the reading practises them.

## Language
- Correct, natural Modern Standard Arabic of the kind printed in the UAE and Kuwait: signs, notices, forms, WAM-style news briefs, mosque notices, weather reports, features, editorials. Sign Arabic is terse (nominal phrases, يرجى + verbal noun, ممنوع + verbal noun); news uses the standard news verbs.
- No dialect words in the Arabic (Gulf words that are also fuṣḥā are fine).
- Spelling: hamzas on their correct seats, ة / ه and ى / ي correct, تنوين alif (شكرًا) where vowelled. Eastern or Western digits as UAE signs use them; be consistent within a text.
- Vowelling (the riskiest thing in this task: a wrong vowel is worse than none, §13):
  - R1: vowel the new words only (those reading_check lists that are real new words), fully and correctly; leave known words bare.
  - R2: new and ambiguous words only.
  - R3: disambiguating marks only (a passive verb, a shadda that changes the word).
  - R4, R5: no vowel marks at all.
  - Any mark you are not certain of: remove it.
- English column: an accurate, natural translation of that line (not word for word, but nothing added or dropped).

## Content rules
- Fictional and generic: "the ministry", "a Dubai company", "the municipality", "Al Nahda Mosque" (made-up names are fine if obviously generic). No real people, no quotes from real people, no invented news about real organisations, no real dates (use "on Sunday", "next week", "1 to 15 March" without a year).
- No unsourced facts presented as real (statistics, laws, fines): make figures plainly local to the fictional text ("the company said sales rose 10%").
- Religious texts (mosque notices, a sermon opening) use the standard formulas correctly; Qurʼan verses or hadith are not quoted (a misquoted verse is a serious error): say "قال تعالى" only if you then quote nothing, or better, avoid it.
- Variety: across a level, mix the §13 text types; R4 includes one or two sermon excerpts (own wording, standard openings and closings), R5 includes 4–6 editorials or opinion pieces using the F18–F19 connectors.

## Questions
- In English, about meaning (gist, detail, inference at R4–R5), never about grammar. §13 count: R1 2, R2 3, R3 3–4, R4 4, R5 4–5.
- 3 or 4 options, exactly one right, distractors plausible, the answer string exactly equal to one option. Answerable only from the Arabic, not from general knowledge.

## Loop (writer)
1. Write the level file. 2. `python3 tools/reading_check.py rN`: fix coverage and new-word counts. 3. `python3 tools/lint_content.py` (0 errors; fix any reading warnings). 4. Re-read every Arabic line once for grammar (agreement, case after prepositions in vowelled words, idāfa, number–noun agreement) and every vowel mark. 5. Write `content/review/readings_rN_writer.md`: per text, its new words and why each vowel mark is certain. Don't commit. Don't touch other files.
