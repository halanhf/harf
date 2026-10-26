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
| Habit | One "Today" session of about 30 minutes. New lessons pause if reviews pile up, so nothing slips |

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
| Speech scoring | No (published pages can't use the microphone) | Yes, in Chrome, Edge or recent Safari |

Run locally (speech recognition needs a secure page, so serve it):

```
python -m http.server 8000      # then open http://localhost:8000
```

Privacy note: Chrome and Edge send speech recognition audio to Google's or Microsoft's servers.

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

Covers the scheduler, card-mode progression, interleaving, the mastery gate, the AI-lesson validator, Arabic normalisation (including Gulf letters چ and گ), and the course data: every hand-written lesson must pass the same validator AI lessons do, with 5 to 9 phrases and no duplicates across the course.
