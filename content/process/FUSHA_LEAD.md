# Running one batch of the fuṣḥā (MSA) track

The fuṣḥā track teaches the learner to *recognise* Modern Standard Arabic (signs, forms, news, sermons), never to
speak it. Read `content/FRAMEWORK.md` §13 (batches F01-F20, readings R1-R5, the gulf-column format, domains, the
order rule, vowelling policy) and `content/STYLE.md` (transliteration scheme; fuṣḥā transliteration uses q, k, j,
ay, aw and case endings only where they are pronounced in pause form). Existing words: `content/msa.json` (44, never
edit or reorder: card ids are positional) and any `content/msa/*.json` files written before yours. Frequency
evidence: `/home/claude/research_notes/Gulf Arabic course to C1/wordfreq_ar_top4000.tsv` (general Arabic, word forms)
and `fusha_track.md`; Gulf evidence for the gulf column: `python3 /home/claude/gulfcheck/attest.py word <arabic>`.

## Word batches
Write `content/msa/{file}.json`: a JSON array of rows `[vowelled arabic, translit, english, gulf column, domain]` in
the batch order given in your brief (F-batch by F-batch, as §13 orders them). Gulf column: `G=` (same word in Gulf
speech), `G~ <gulf translit>` (cognate said differently), or `M <gulf script> <gulf translit>` (Gulf uses another
word). Domain: function, signs, forms, services, news, religion, general. Full, correct vowelling (tashkīl) on every
word; the dictionary form a reader meets (verbs in the 3rd person masculine past with the present in the english if
useful, e.g. "to announce (yuʿlinu)"). No word may duplicate one already in the track (the linter normalises).

## Reading batches
Write `content/readings/{file}.json`: `{id:"rL-NN", level, stage, title, lines:[[arabic, english]], questions:[[question,
[options], answer]]}` per §13: length, vowelling policy, coverage (only words from fuṣḥā batches unlocked by that
stage, plus G= words and very common function words), one sentence per line (≤20 words), questions in English with
the answer exactly one of the options. Write realistic Gulf-context texts (UAE/Kuwait notices, news briefs, sermon
openings) that are original, not copied.

## Loop
1. Write the batch, then `python3 tools/lint_content.py` must show 0 errors (warnings: fix or justify).
2. Review round r: start two NEW general-purpose agents in parallel (Agent tool, run_in_background false), each with
   only this prompt: "Blind-review the fuṣḥā batch /home/claude/arabic-learn/content/{path}, round {r}, focus {A|B},
   for the Harf course. Rules: /home/claude/arabic-learn/content/FRAMEWORK.md §13 and STYLE.md. Focus A: every
   vowelling, spelling, transliteration and English gloss is correct MSA; the gulf column is right (check Gulf claims
   with python3 /home/claude/gulfcheck/attest.py word <arabic>). Focus B: words are high-value for a Gulf resident
   at that stage, ordering follows §13, no duplicates, readings are natural MSA at the right level with correct
   questions. Do not edit. Write content/review/{name}_review{A|B}_r{r}.md as a table: row/id | current | verdict
   (DEFINITE ERROR / VARIANT) | exact replacement | reason + evidence. Final message ≤4 lines with counts."
   If the Agent tool isn't available, say so and stop after step 1.
3. Fix every DEFINITE ERROR and apply or answer each VARIANT (responses in `content/review/{name}_responses.md`).
4. Repeat with fresh reviewers until a round has 0 DEFINITE ERRORs from both; stop after round 4 regardless.

Do not commit and do not touch other files. Final report ≤5 lines: file, rows/readings written, rounds, errors per
round, clean or not.
