# Harf (حرف): Gulf Arabic

A web app that teaches Gulf Arabic (General Khaleeji, Emirati-leaning) from zero, for speaking, while building enough Modern Standard Arabic (fuṣḥā) to understand news, signs and formal speech. It has no end: everything you learn keeps coming back on a spaced schedule, and new lessons keep coming.

## Use it on your computer and phone (free)

| Way | Where it works | Progress | Speaking practice |
|---|---|---|---|
| **claude.ai version** (recommended) | Any browser or the Claude app, signed in to your account | Synced to your account: start on the computer, carry on on the phone | Dictation in Chrome or Edge on a computer or Android phone; on iPhone and in the Claude apps, say it aloud and compare |
| **Installable app** (`docs/`, after it's hosted) | Add to Home Screen on Android or iPhone; works offline | This device only; move it with Export / Import backup | The browser's own microphone where allowed, plus record-and-compare |

The claude.ai version needs nothing set up: open the same link on both devices. The installable app is built from the same `index.html` by `python build.py` into `docs/`, and `.github/workflows/pages.yml` publishes it with GitHub Pages. Pages is free for public repositories; for a private one it needs GitHub Pro, or use Cloudflare Pages (free) pointed at the `docs/` folder.

## How it teaches

The method combines the [Palteca method](https://palteca.com/method) (understandable input, small topic-grouped batches, spaced repetition, ear training, quick grammar tips) with speaking practice, which input-first methods underweight.

| Principle | In the app |
|---|---|
| Understandable input | Every lesson opens with a short dialogue. You listen and guess before the English is revealed |
| Small topic batches (7±2) | 5 to 9 new phrases per lesson, all on one topic |
| Retrieval beats rereading | A quick check straight after the lesson, then reviews that make you recall, not reread |
| Spacing | FSRS-5 scheduling. Missed cards return after 1 and 10 minutes, known ones at growing intervals |
| Desirable difficulty | A card is recognised while you're learning it, heard once it's held for a few days, then mostly said from English once it's held for a week. Forgetting it sends it back to recognition |
| Interleaving | Reviews mix units so you never get two from the same lesson in a row |
| Speaking (output) | Say every new phrase and see word by word what was caught; role-play each dialogue as speaker B; chat with an AI partner |
| Self-correction first | In chat and sentence practice a mistake gets a hint and another try before the answer is shown (prompts beat recasts in the research) |
| Many voices | Listening cards and ear training rotate through every Arabic voice the device has (high-variability training) |
| Ear training | Minimal pairs (قلب/كلب, صيف/سيف, ...) before you're asked to produce the sounds |
| Habit | One "Today" session of about 30 minutes, with at most 60 reviews a day, so a backlog after a break is worked off over a few days instead of in one sitting. New lessons pause while more than 40 reviews are waiting, so nothing slips. Streak freezes (one per 7-day streak, hold 2) so one missed day doesn't end the habit |
| Better scheduling | FSRS-5, the scheduler Anki uses by default: fewer reviews for the same retention, and it copes with breaks. You choose the retention target (85, 90 or 95%) |
| Graduated recall | New phrases come back after 1 minute and 10 minutes before moving to days (Pimsleur's graduated interval recall) |
| Building sentences | Each dialogue line becomes a word-tile puzzle the day after its lesson, then later something you say from English |
| Output with feedback | "Make a sentence": translate an English sentence built from your words, get a corrected Gulf version and why (Swain's output hypothesis) |
| Anticipation | Hands-free audio drill: English prompt, pause to answer out loud, then the Gulf phrase twice (Pimsleur) |
| Shadowing | Repeat along with any line, slow then normal speed. Record yourself and compare where the microphone is allowed |
| Tricky cards | Cards forgotten 4+ times are listed with an AI memory hook, since more repetition alone rarely fixes them |

## Stages

| Stage | Level | Content |
|---|---|---|
| 0 Foundations | | 28 letters and their shapes, vowel marks, how Gulf pronunciation differs, ear training |
| 1 Survival | A1 | 16 hand-written lessons: greetings, goodbyes and sorry, survival words, polite requests, about me, work and study, questions and directions, can/know, there is / not, numbers, prices, café, time, taxi, hospitality |
| 2 Everyday | A2 | 12 planned topics, each with a grammar point, lessons written for you by AI at your level |
| 3 Conversations | B1 | 12 planned topics, each with a grammar point |
| 4 Fluent | B2 | 10 planned topics, each with a grammar point |
| 5 Native-like | C1 | 10 planned topics |
| 6 Open-ended | | Any topic you choose, forever |

You move up when a stage's lessons are done **and** 80% of its phrases have stuck for at least a week. Fuṣḥā recognition cards start after five lessons, at three new words a day. The Course tab also has grammar tables (pronouns, endings, verbs, negation) and a numbers drill.

## Two versions

| | claude.ai version | Local / installable version |
|---|---|---|
| Stages 0 and 1, reviews, role-play, drills | Yes | Yes |
| AI lessons (stage 2+), stories, conversation partner, sentence practice | Yes | No (needs Claude) |
| Progress | Saved to your account, merged across devices so none is lost | This device; Export / Import backup |
| Speaking feedback | Claude dictation (Chrome or Edge on a computer or Android) | The browser's recogniser (Chrome, Edge), plus record and compare |
| Voice | The device's Arabic voice; the Claude voice where the device has none | The device's Arabic voice |
| Backup | Export a file from Progress | Export a file from Progress |

Run the installable version locally (speech recognition needs a secure page, and `localhost` counts as one). In PowerShell or a terminal, from the repo folder:

```
python build.py                          # only after changing index.html
python -m http.server 8000 -d docs       # then open http://localhost:8000
```

Serve `docs/`, not the repo root: the root `index.html` is the claude.ai source, which loads Google Fonts and has no offline support.

## Your progress is safe

| Risk | What the app does |
|---|---|
| Browser storage full or blocked (private window) | A warning appears at the top telling you to export a backup; nothing fails silently |
| Saved data can't be read | It is kept aside under another name, not overwritten, and you're told |
| Two tabs or windows open at once | Each tab merges the other's saves, so neither overwrites the other's reviews |
| A damaged or wrong backup file | Damaged cards are skipped, bad settings fall back to defaults, and the preview says what will change before anything is restored |
| A backup made after "Start over" on another device | The preview warns how many cards here it will remove |
| App update | Progress lives in browser storage, which updates never touch; the new version loads on the next open while online |

Export a backup from Progress now and then anyway: browser storage can be cleared by you or the system, and the installed app's progress lives only on that device. The installed app has a strict content security policy: it runs only its own scripts and loads nothing from other sites.

Privacy note: Chrome and Edge send speech recognition audio to Google's or Microsoft's servers. On claude.ai, dictation goes to Anthropic's speech-to-text and the page only receives the words.

## Research behind it

| Source | Finding used |
|---|---|
| [Anki manual: FSRS](https://docs.ankiweb.net/faqs/what-spaced-repetition-algorithm) | FSRS models stability, difficulty and retrievability; needs fewer reviews than SM-2 for the same retention and handles delays better |
| [Implementing FSRS in 100 lines](https://borretti.me/article/implementing-fsrs-in-100-lines) | FSRS-5 default parameters and formulas used here |
| [The Pimsleur Method](https://www.pimsleur.com/the_pimsleur_method) | Graduated interval recall, anticipation, a small core vocabulary, words learned inside conversations |
| [Swain's output hypothesis (JALT review)](https://jalt-publications.org/tlt/articles/2198-output-and-beyond-dialogue-review-merrill-swains-current-approach-sla) | Producing language makes learners notice gaps and test hypotheses, so input alone isn't enough |
| [Shadowing as a language learning method](https://journal.uia.no/index.php/NJLTL/article/view/1139) | Shadowing studied mainly for listening and pronunciation; evidence is promising but mostly small-scale |
| [Duolingo on streaks](https://blog.duolingo.com/how-duolingo-streak-builds-habit) | Streak freezes raised daily active learners without encouraging more days off |
| [The Palteca Method](https://palteca.com/method) | Input you can understand, topic clusters, 7±2 items, minimal pairs, short grammar insights |

Few apps teach Gulf Arabic specifically; most mainstream ones teach MSA, Egyptian or Levantine ([overview](https://talkinarabic.com/arabic-apps/)). That gap is why this course is written for Khaleeji.

## Known limits

- **Audio is standard Arabic.** Phone voices read Arabic script the standard way, so they say قهوة as qahwa where Gulf speakers say gahwa. Cards where this matters show a "Gulf: …" chip, and the transliteration always shows real Gulf pronunciation. Get native audio from YouTube or a tutor for these words.
- **AI-written lessons aren't human-checked.** Stage 2+ lessons are generated, shape-checked and de-duplicated, but not reviewed by a native speaker. Every card has a "hide it" button for anything that looks wrong.
- **Stage 1 content was checked by two separate AI reviewers, not a native speaker.** Have a Gulf speaker look over it when you can.
- **Speech scoring checks words, not accent.** Recognisers map what you say onto standard spelling, so a green word means it was understood, not that it sounded Emirati.
- **No app gets you to fluency on its own.** From stage 3, add a weekly session with a native Gulf tutor.
- Gulf varieties differ (Kuwaiti shinu vs Emirati shu, cham vs kam). Notes flag the common differences, but not every one.
- No pictures. The Palteca method uses images as memory aids; published pages can't load outside images, so this app doesn't.

## Tests

```
node --test tests/logic.test.js
```

Covers the FSRS scheduler (learning steps, growth, lapses, stability floor, hard < good < easy ordering, retention target, migration of older cards), the daily review cap, safe loading of damaged backups, card modes, interleaving, the mastery gate, the AI-lesson validator, Arabic normalisation (including Gulf letters چ and گ), word-level speech matching, streaks across time zones, the sync merge (stale copies never win, resets propagate), and the course data: every hand-written lesson must pass the same validator AI lessons do, with 5 to 9 phrases and no duplicates across the course.

`python build.py` rebuilds `docs/` (the installable app); CI fails if it's out of date. The tests also check that the built app loads nothing from other sites and that its content security policy matches its inline scripts.

## Credits

| What | From | Licence |
|---|---|---|
| Amiri (Arabic font) | [The Amiri Project Authors](https://github.com/aliftype/amiri), subset files from [Fontsource](https://fontsource.org) | SIL Open Font License 1.1, see `pwa/fonts/OFL-Amiri.txt` |
| Readex Pro (Latin font) | [The Readex Pro Project Authors](https://github.com/ThomasJockin/readexpro), subset files from [Fontsource](https://fontsource.org) | SIL Open Font License 1.1, see `pwa/fonts/OFL-ReadexPro.txt` |
| App icons | Made for this app: حرف set in Amiri | |
| FSRS-5 default parameters | [open-spaced-repetition](https://github.com/open-spaced-repetition/fsrs4anki) | MIT |

The teaching ideas credited to the Palteca method above are described in this project's own words. No Palteca text, lessons or images are included.

## Licence

MIT, see [LICENSE](LICENSE). The bundled fonts (Amiri, Readex Pro) stay under the SIL Open Font License; their licence files sit next to them in `docs/fonts/` and `pwa/fonts/`.
