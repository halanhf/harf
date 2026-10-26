# Harf (حرف): Gulf Arabic

A web app that teaches Gulf Arabic (General Khaleeji, Emirati-leaning) from zero, for speaking, while building enough Modern Standard Arabic (fuṣḥā) to understand news, signs and formal speech. It has no end: everything you learn keeps coming back on a spaced schedule, and new lessons keep coming.

## How it teaches

The method combines the [Palteca method](https://palteca.com/method) (understandable input, small topic-grouped batches, spaced repetition, ear training, quick grammar tips) with speaking practice, which input-first methods underweight.

| Principle | In the app |
|---|---|
| Understandable input | Every lesson opens with a short dialogue. You listen and guess before the English is revealed |
| Small topic batches (7±2) | 5 to 9 new phrases per lesson, all on one topic |
| Retrieval beats rereading | A quick check straight after the lesson, then reviews that make you recall, not reread |
| Spacing | Simplified SM-2 scheduling. Missed cards return in a minute, known ones at growing intervals |
| Desirable difficulty | Each card starts as recognition, moves to listening, then mostly to speaking it from English |
| Interleaving | Reviews mix units so you never get two from the same lesson in a row |
| Speaking (output) | Say every new phrase, role-play each dialogue as speaker B, chat with an AI partner |
| Ear training | Minimal pairs (قلب/كلب, صيف/سيف, ...) before you're asked to produce the sounds |
| Habit | One "Today" session of about 30 minutes. New lessons pause if reviews pile up, so nothing slips. Streak freezes (one per 7-day streak, hold 2) so one missed day doesn't end the habit |
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
| 1 Survival | A1 | 10 hand-written lessons: greetings, survival words, about me, numbers, café, directions, time, can/know, hospitality |
| 2 Everyday | A2 | 10 planned topics, lessons written for you by AI at your level |
| 3 Conversations | B1 | 10 planned topics |
| 4 Fluent | B2 | 10 planned topics |
| 5 Native-like | C1 | 10 planned topics |
| 6 Open-ended | | Any topic you choose, forever |

You move up when a stage's lessons are done **and** 80% of its phrases have stuck for at least a week. Fuṣḥā recognition cards start after stage 1 lesson 5, at three new words a day.

## Two versions

| | claude.ai version | Local / GitHub version |
|---|---|---|
| Stages 0 and 1, reviews, role-play | Yes | Yes |
| AI lessons (stage 2+), stories, conversation partner | Yes | No (needs Claude) |
| Progress | Saved to your account, private to you, works across devices | This browser only |
| Speech scoring, record and compare | No (published pages can't use the microphone) | Yes, in Chrome, Edge or recent Safari |
| Backup | Export a file from Progress | Export a file from Progress |

Run locally (speech recognition needs a secure page, so serve it):

```
python -m http.server 8000      # then open http://localhost:8000
```

Privacy note: Chrome and Edge send speech recognition audio to Google's or Microsoft's servers.

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
- **Stage 1 content was reviewed by an AI, not a native speaker.** Have a Gulf speaker look over it when you can.
- **No app gets you to fluency on its own.** From stage 3, add a weekly session with a native Gulf tutor.
- Gulf varieties differ (Kuwaiti shinu vs Emirati shu, cham vs kam). Notes flag the common differences, but not every one.
- No pictures. The Palteca method uses images as memory aids; published pages can't load outside images, so this app doesn't.

## Tests

```
node --test tests/logic.test.js
```

Covers the FSRS scheduler (learning steps, growth, lapses, retention target, migration of older cards), card-mode progression, interleaving, the mastery gate, the AI-lesson validator, Arabic normalisation (including Gulf letters چ and گ), and the course data: every hand-written lesson must pass the same validator AI lessons do, with 5 to 9 phrases and no duplicates across the course.
