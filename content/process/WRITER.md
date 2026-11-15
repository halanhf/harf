# Writing a batch of lessons

You write one batch (about 10 lessons) of Harf, a pre-written course of spoken Gulf Arabic (Emirati default) for one
English-speaking learner. Accuracy matters more than speed: every line will be checked by two blind reviewers and
against a corpus of real Gulf writing, and anything wrong will come back to you.

## Read first
- `content/STYLE.md` (all of it): variety defaults, spelling, transliteration, gender, variants, register, dialogue
  rules, the reviewer checklist (§10) and what counts as an error (§11). Follow it exactly.
- `content/FRAMEWORK.md`: your batch's rows (grammar point, functions, domain, the named new items, culture), the
  cast (§2), the social formulas (§7), glue words (§8), recycling (§9-10), tasks (§11) and the responses to review (§15).
- Everything already written before your batch: `content/stage1.json`, then `content/stage{N}/*.json` for earlier
  stages and earlier batches of your stage that exist. You must not re-teach any phrase already taught as an item
  (the linter will reject it), and your dialogues should mostly use words the learner has already met.
- Evidence when you need it: the research notes in `/home/claude/research_notes/Gulf Arabic course to C1/`, the report
  `/home/claude/reports/Gulf Arabic course to C1.md`, and the corpus tool:
  `python3 /home/claude/gulfcheck/attest.py word <arabic>`, `phrase "<arabic>"`, `unit <file> [unit id]`
  (counts in ~9M words of Emirati (AE) and ~5M of Kuwaiti (KW) written dialect; 0 hits is a warning sign, not proof).
  Search the web for anything you are unsure of. Reference sources are in `/home/claude/refs/` (read its README.md; grep the .txt files).

## Write
Output: `content/stage{N}/b{NN}.json`, a JSON array of units in teaching order, exactly the ids your batch was given.
Unit shape (the app depends on it):
`{"id","stage","title"(≤80),"goal"(≤160),"tip"(≤300),"grammar"(≤120, the batch row's grammar point in a few words),
"dialogue":[["A"|"B", arabic, translit, english], 3-10 lines],
"items":[[arabic, gulf translit, english, fuṣḥā equivalent or "", note or ""], 5-9],
optional "culture"(≤400), "task"(≤400, B2/C1 weekly task where the framework says), "receptive":[item indexes] (B2/C1)}`

For every lesson:
- Teach the row's grammar point clearly in the tip, with 1-2 short transliterated examples, and use it several times
  in the dialogue.
- Items are whole, usable chunks the learner will actually say (verb with its person, noun with il- when natural),
  taken from the dialogue where possible. Use the named items from the framework row; choose the rest yourself.
- The dialogue is a real Gulf situation between the framework's cast, 4-8 short natural turns, each a complete
  sentence; lines of 2-8 words become sentence-building cards, so prefer that length. B is the learner's role.
- Colloquial as locals speak. No fuṣḥā, no Egyptian/Levantine, no translationese, no textbook politeness.
- Gender: "(to a man)" in the english and the woman's form in the note (or the reverse).
- Fuṣḥā column: the MSA equivalent in Arabic script when it differs, else "".
- Notes: the woman's form, a Kuwaiti/Saudi variant ("Kuwait: …"), a usage warning, or "".

## Check before you finish (loop until clean)
1. `python3 tools/lint_content.py {N}` must show 0 errors for your file. Read every warning and fix it or be ready to
   justify it.
2. `python3 tools/lint_content.py {N} --gumar` and `python3 /home/claude/gulfcheck/attest.py unit content/stage{N}/b{NN}.json`:
   every word with under 3 hits and every unseen pair is either replaced with an attested form or justified (a web
   source, or a clear reason such as a name or a modern word).
3. Re-read every line against STYLE §10, top to bottom.

## Log
Write `content/review/stage{N}_b{NN}_writer.md`: per unit, any choice that rests on weak evidence (mark U), every
unattested form you kept and why, and anything a native speaker should confirm. Keep it short.
