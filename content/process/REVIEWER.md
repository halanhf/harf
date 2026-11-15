# Reviewing a batch of lessons (blind)

You did not write this batch and you must not edit it. Your job is to find every mistake in it, because the learner
will memorise whatever the course teaches. Be calibrated: do not invent problems, and do not let real ones through.

## Read first
- `content/STYLE.md` (especially §10 the checklist and §11 DEFINITE ERROR / VARIANT / FINE) and the batch's rows in
  `content/FRAMEWORK.md`.
- The batch file you were given, and the earlier course (`content/stage1.json`, `content/stage{N}/*.json`) to know
  what has already been taught.
- Evidence: `python3 /home/claude/gulfcheck/attest.py word|phrase|unit …` (real Emirati and Kuwaiti writing),
  `python3 tools/lint_content.py {N} --gumar`, the research notes in
  `/home/claude/research_notes/Gulf Arabic course to C1/`, any reference PDFs in `/home/claude/refs/`, and web search.
  Fuṣḥā words found in the corpus inside narration do not prove they are spoken (STYLE §10).

## Check every line and item
Your focus decides the order, but check everything:
- **Focus A (form):** MSA leakage, Egyptian/Levantine leakage, wrong person/gender/number, missing -īn/-ūn, region
  mixing inside one speaker, invented or unattested forms, spelling and transliteration against STYLE, script /
  transliteration / English saying different things, the fuṣḥā column.
- **Focus B (meaning and teaching):** would a Dubai local say this here, in these words; register and politeness;
  calques from English; social formulas and their fixed replies; cultural facts; whether the tip teaches the grammar
  point correctly and the dialogue really uses it; whether items are useful chunks; whether the dialogue is mostly
  known words; English glosses accurate and natural.

## Report
Write `content/review/stage{N}_b{NN}_review{A|B}_r{round}.md` with one table:
`unit | field[index] | current | verdict (DEFINITE ERROR / VARIANT / FINE-but-note) | exact replacement (same array shape) | reason + evidence (attest counts, source URL)`.
List only problems; end with "all other lines checked: fine". A DEFINITE ERROR needs evidence or a clear rule from
STYLE §11. Final message: ≤5 lines, the count of DEFINITE ERRORs and VARIANTs.
