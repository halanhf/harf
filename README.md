# Harf (حرف)

A single-page web app for learning Modern Standard Arabic (fuṣḥā): the alphabet, vocabulary with spaced repetition, listening, speaking and writing. No build step, no backend, no account. One `index.html`.

## What it does

| Tab | Practice |
|---|---|
| Letters | All 28 letters with their four positional shapes (alone, start, middle, end), sound, Arabic name and an example word, all playable |
| Review | Spaced-repetition flashcards (simplified SM-2) in three directions: Arabic to English, English to Arabic, audio to meaning. 10 new cards a day |
| Quiz | Letter shape to name, unvowelled reading, listening |
| Speak | Hear a phrase, say it, get a percentage match from speech recognition |
| Type | Hear a word and write it in Arabic script with an on-screen keyboard. Vowel marks and alif/hamza variants are ignored when checking |
| Tutor | Conversation practice with Claude (only in the claude.ai version, see below) |
| Progress | Streak, cards learned and per-deck counts |

Decks: greetings, polite words, numbers 1 to 10, people and pronouns, everyday nouns. Around 65 cards plus the alphabet.

## Run it locally

Speech recognition needs a secure page, so serve it rather than double-clicking the file:

```
cd arabic-learn
python -m http.server 8000      # then open http://localhost:8000 in Chrome or Edge
```

## Voice

- **Listening** uses your device's own Arabic text-to-speech voice. Quality varies by device. If you hear nothing or an English accent, install an Arabic voice: Windows (Settings, Time & language, Speech, add Arabic), Android (Google Speech Services, Arabic), iPhone (Settings, Accessibility, Spoken Content, Voices, Arabic).
- **Speaking** uses the browser's speech recognition (Chrome, Edge, recent Safari; not Firefox). Privacy note: in Chrome and Edge your recording is sent to Google's or Microsoft's servers for recognition. If you'd rather not, use the self-check buttons instead, which work offline.
- Recognition scores pronunciation loosely. It tells you whether a native-trained recogniser understood you, not whether your ع and ح are perfect. Use it as a check, and a teacher or native speaker for fine pronunciation.

## The claude.ai version

The same page is published as a claude.ai artifact so it runs on a phone without setup. There it gains the Tutor tab (it asks Claude for replies). It also loses speech recognition, because published artifacts can't use the microphone. The Speak tab falls back to the self-check buttons.

## Progress and privacy

Progress lives in your browser's localStorage only. Nothing is sent anywhere except speech recognition audio (above) and, in the claude.ai version, the messages you type to the tutor. Clearing site data or switching browser resets progress.

## Tests

```
node --test tests/logic.test.js
```

The tests run the page's own helper functions (Arabic normalisation, match scoring, SM-2 scheduling, letter shapes) and check the data: 28 letters, the six non-joining letters, every example word starts with its letter, no duplicate cards. CI runs them on every push.

## Limitations

- MSA only. Courses like ArabicPod101 often teach Egyptian or Levantine alongside MSA, and everyday words differ (e.g. "how are you" is كيف حالك in MSA but ازيك in Egyptian).
- Gendered phrases use the masculine form unless marked (e.g. آسف, sorry said by a man).
- The vocabulary is a starter set, not a course. Adding a deck means adding rows to `DECKS` in `index.html`; the tests check the format.
- Positional letter shapes are drawn with the tatweel character (ـ), which every Arabic font supports, but a few fonts render the joins slightly differently.
