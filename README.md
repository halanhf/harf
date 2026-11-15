# Harf (حرف): Gulf Arabic

I built Harf to teach myself spoken Gulf Arabic (General Khaleeji, leaning Emirati) from zero, with enough fuṣḥā on the side to follow news, signs and formal speech. It's a daily habit app: about 30 minutes a day of reviews, one short lesson and some speaking. Everything you learn keeps coming back on a spaced schedule, and the course doesn't end.

There are two ways to run it, built from the same `index.html`:

| | claude.ai version | Offline app (`docs/`) |
|---|---|---|
| Progress | Saved to my Claude account, so the phone and the PC stay in sync | Stays on that one device; move it with Export / Import backup |
| Works offline | No | Yes, once it's installed |
| Stages 0 and 1, reviews, role-play, drills | Yes | Yes |
| AI lessons (stage 2+), stories, chat partner, sentence practice | Yes | No, they need Claude |
| Speaking feedback | Claude dictation (Chrome or Edge on a computer or Android) | The browser's own recogniser (Chrome, Edge), plus record and compare |

I use the claude.ai version day to day. The offline app is the backup plan, and the one to use if the repo ever goes public.

## What you need

- **claude.ai version:** a Claude account and a browser, or the Claude app. Nothing to install.
- **Offline app:** Chrome or Edge on Windows or Android, or Safari on iPhone. For the phone you also need it hosted somewhere over HTTPS (see below). For the PC on its own, Python 3 is enough.
- **Changing the course or the app:** Python 3 to rebuild `docs/`, and Node 18 or newer to run the tests.

## Install

### The claude.ai version on your phone and PC

1. Open the Harf artifact link on both devices, signed in to the same Claude account. (The link isn't in this repo on purpose. It's in my artifacts list on claude.ai.)
2. **iPhone:** open the link in Safari, tap Share (or the page menu, then Share), tap **Add to Home Screen**, then **Add**. If it offers **Open as Web App**, leave that on. The home screen version doesn't share Safari's sign-in, so expect to sign in to Claude once more inside it.
3. **Android:** open the link in Chrome, tap the ⋮ menu, then **Add to home screen** (newer Chrome calls it **Install and create shortcut**).
4. **Windows:** in Chrome, ⋮ menu, **Cast, save and share**, **Install page as app…**. In Edge, **Settings and more (…)**, **More tools**, **Apps**, **Install this site as an app**. Then right-click its taskbar icon and pin it.

Any web page can go on the home screen this way, so it's a shortcut to the claude.ai page rather than a real install. It needs internet, it needs you signed in, and nothing works offline. If the artifact ever gets a new link, add the icon again. I couldn't check from here whether claude.ai opens it in its own window or in the browser, so that bit is untested.

### The offline app on the PC (no hosting needed)

The app has a service worker, so once Chrome or Edge has installed it from your own PC it keeps working with the server switched off. In PowerShell, from the repo folder:

```powershell
python -m http.server 8000 --bind 127.0.0.1 -d docs
```

1. Open http://127.0.0.1:8000 in Chrome or Edge.
2. Install it: go to Progress and press **Install Harf as an app**, or use the install icon in the address bar.
3. Go back to PowerShell and press Ctrl+C. The installed app still opens, offline.

Always use exactly http://127.0.0.1:8000. The browser keeps progress per address, so `localhost:8000` or a different port would start you from nothing. `--bind 127.0.0.1` keeps the server on this PC only.

### The offline app on your phone (needs hosting)

A phone can't reach your PC's `127.0.0.1`, so `docs/` has to be on the web over HTTPS. The repo is private, and GitHub Pages only works on private repos with GitHub Pro, so the free route is Cloudflare Pages, which can deploy from a private repo:

1. In the Cloudflare dashboard go to **Workers & Pages**, then **Create application**, **Pages**, **Connect to Git**.
2. Pick **GitHub**. When GitHub asks which repos, choose **Only select repositories** and pick `arabic-learn`. Then **Install & Authorize** and **Begin setup**.
3. Production branch: `main`. Leave the framework preset alone. Build command: leave it blank (Cloudflare's docs also suggest `exit 0`, which does the same). Build output directory: `docs`.
4. **Save and Deploy**. You get an address like `https://<project-name>.pages.dev`, and every push to `main` redeploys it.

Anyone with that address can open the app. That's fine: it's only the app, and progress never leaves each person's own browser.

Then put it on the phone:

- **iPhone:** open the address in Safari, Share, **Add to Home Screen**, **Add**. The home screen app keeps its own progress, separate from Safari, so add it before you start, or move your progress across with a backup.
- **Android:** open it in Chrome and go to Progress, **Install Harf as an app** (or ⋮ menu, **Install and create shortcut**, then **Install**).

If the repo goes public, GitHub Pages is free instead: Settings, Pages, Source: **GitHub Actions**, then Actions, **pages**, **Run workflow**. It'll be at https://halanhf.github.io/arabic-learn/. All my Pages sites would share that one address, so another project there could in theory mess with Harf's saved progress. Cloudflare doesn't have that problem.

## First run

Today shows one button, and it's always the next thing to do. On day one that's **Start with the sounds**: the 28 letters, vowel marks, how Gulf pronunciation differs, and a short listening test (about 15 minutes). Pass that and stage 1 opens with greetings.

Worth setting in Progress, Settings straight away:

- **Talk to me as**, so lessons and the chat use -ak or -ich forms for you.
- **Play audio automatically**, off for quiet places.

If there's no sound, your device has no Arabic voice. The app tells you where to add one (Android: Google Speech Services; iPhone: Accessibility, Spoken Content, Voices; Windows: Time & language, Speech).

## Everyday use

Open it, press **Continue** until Today says you're done. A normal day is reviews, one new lesson, then a role-play where you answer as B. On claude.ai there's also a story or chat step.

- **Reviews:** say the answer before you reveal it, then grade yourself honestly. On a PC, Space shows the answer and 1 to 4 grade it.
- **Leaving a lesson:** the ✕, or Android's back gesture. If you're halfway through a lesson the first back asks "Leave?" and a second back leaves.
- **Backups:** Progress, **Export backup**, every week or so, and before you clear browser data. **Import backup** merges, and it tells you what will change before it does anything. It can't undo **Start over**, though: anything older than the reset stays gone.
- **Too many reviews after a break:** Today stops at 60 a day and spreads the rest over the next few days. New lessons pause while more than 40 are waiting.

## Updating

- **After changing `index.html`:** rebuild the offline app and run the tests, then commit both.

  ```powershell
  python build.py
  node --test tests/logic.test.js
  ```

  CI fails if `docs/` doesn't match `index.html`.
- **claude.ai version:** republish the artifact from the new `index.html`. It keeps the same link and your progress. The page needs the `db`, `user`, `sample`, `dictation` and `downloads` capabilities, so keep them when republishing (without `downloads` the backup can only go to the clipboard).
- **Hosted offline app:** Cloudflare redeploys on push. The app loads the new version the next time it's opened online.
- **PC install from 127.0.0.1:** start the server again, open the app once, then stop the server.

Updates never touch progress. It lives in browser storage, not in the files.

## Removing it

Export a backup first if you might want your progress back.

- **Chrome (Windows):** open the app, ⋮ menu, **Uninstall Harf**, **Remove**. Tick **Also delete data from Chrome** to wipe progress too.
- **Edge:** go to `edge://apps`, **Details** on Harf, **Uninstall**.
- **iPhone or Android:** touch and hold the icon and remove it.
- **Just the progress:** Progress, Danger zone, **Reset all progress**. That also clears it on every device synced to the account, and a backup made before it won't bring it back.

## Troubleshooting

| Problem | Fix |
|---|---|
| No audio | No Arabic voice on the device. Add one (steps under First run) |
| No **Say it** button | The browser has no speech recogniser (iPhone, the Claude apps) or the mic is blocked. Say it aloud and compare. If you've unblocked the mic, Progress has **Try the microphone again** |
| "This browser isn't letting Harf save" | Private window, or storage is full. Export a backup straight away |
| Progress gone after adding it to an iPhone home screen | The home screen app has its own storage. Export from Safari, import in the app |
| Progress gone on the PC install | You opened a different address or port. Use exactly http://127.0.0.1:8000 |
| Old version still showing | Open it once while online. The installed app checks for a new version every time it opens |
| Export backup says "Couldn't export here" | claude.ai only lets a page save files through its downloads permission. Open Harf in a web browser on claude.ai and export from there |
| `pages` workflow fails | Pages isn't switched on, or the repo is private without GitHub Pro |

## Security and privacy

- No accounts, keys or passwords anywhere in the app or the repo.
- The offline app has a strict content security policy: it only runs its own scripts and loads nothing from other sites. The fonts are bundled.
- Progress lives in your browser (and in your Claude account for the claude.ai version). The hosted app has nothing private in it.
- Chrome and Edge send speech recognition audio to Google's or Microsoft's servers. On claude.ai, dictation goes to Anthropic's speech-to-text and the page only gets the words back.
- The local server is bound to 127.0.0.1, so nothing else on your network can reach it.

### Your progress is safe

| Risk | What the app does |
|---|---|
| Browser storage full or blocked | A warning tells you to export a backup. Nothing fails silently |
| Saved data can't be read | It's kept aside under another name, not overwritten, and you're told |
| Two tabs or windows open | Each tab merges the other's saves, so neither wipes the other's reviews |
| A damaged or wrong backup file | Damaged cards are skipped, bad settings fall back to defaults, and you see a preview first |
| A backup made after "Start over" on another device | The preview says how many cards here it'll remove |
| A backup made before you chose "Start over" | The preview says its older cards won't come back, rather than pretending to restore them |
| App update | Progress isn't in the files, so updates never touch it |

## How it works

`index.html` is the whole app and is what gets published on claude.ai. `python build.py` turns it into `docs/`: the same page with the fonts bundled, a content security policy, a web app manifest and a small service worker. The service worker fetches the page network-first (so updates show up), falls back to the saved copy when you're offline or the network hasn't answered in 4 seconds, and keeps the fonts and icons cached for offline use. Opening the root `index.html` directly isn't the offline app: it loads Google Fonts and has no service worker, so serve `docs/` instead.

### The method

I based it on the [Palteca method](https://palteca.com/method) (input you can understand, small topic batches, spaced repetition, ear training, short grammar tips) and added a lot more speaking, which input-first methods tend to skip.

- Every lesson starts with a short dialogue. You listen and work it out before the English shows.
- 5 to 9 new phrases per lesson, all on one topic, then a quick check straight away.
- Reviews use FSRS-5, the scheduler Anki uses by default. New and missed phrases come back after 1 and 10 minutes, then at growing gaps. You pick the retention target (85, 90 or 95%).
- Like Anki, a review day runs from 4am to 4am. A card due tomorrow is in tomorrow's session whatever time you study, not only from the minute you graded it.
- A card is recognised while it's new, heard once it's held for a few days, and mostly said from English once it's held for a week. Forget it and it goes back to recognition.
- Reviews mix units, so you never get two from the same lesson in a row.
- You say every new phrase and see word by word what was caught. Each dialogue becomes a role-play where you're B, and the lines come back later as word tiles to put in order.
- Mistakes in chat and sentence practice get a hint first, so you can fix them yourself.
- Listening cards and ear training rotate through every Arabic voice the device has. Ear training uses minimal pairs (قلب/كلب, صيف/سيف and so on) before you have to say them.
- A hands-free audio drill (English prompt, pause, then the Gulf phrase) for walks.
- Cards forgotten 4 or more times show up as tricky cards, with an AI memory hook on claude.ai.
- One streak freeze for every 7-day streak, holding up to 2, so one missed day doesn't end it.

### Stages

| Stage | Level | What's in it |
|---|---|---|
| 0 Foundations | | 28 letters and their shapes, vowel marks, Gulf pronunciation, ear training |
| 1 Survival | A1 | 16 hand-written lessons: greetings, goodbyes and sorry, survival words, polite requests, about me, work and study, questions and directions, can/know, there is / isn't, numbers, prices, café, time, taxi, hospitality |
| 2 Everyday | A2 | 12 planned topics with a grammar point each, written for you by AI at your level |
| 3 Conversations | B1 | 12 planned topics with a grammar point each |
| 4 Fluent | B2 | 10 planned topics with a grammar point each |
| 5 Native-like | C1 | 10 planned topics |
| 6 Open-ended | | Any topic you choose |

You move up when a stage's lessons are done and 80% of its phrases have stuck for at least a week. Fuṣḥā recognition cards start after five lessons, three new words a day. The Course tab also has grammar tables and a numbers drill.

### Research I used

| Source | What I took from it |
|---|---|
| [Anki manual: FSRS](https://docs.ankiweb.net/faqs/what-spaced-repetition-algorithm) | FSRS needs fewer reviews than SM-2 for the same retention and copes better with breaks |
| [Implementing FSRS in 100 lines](https://borretti.me/article/implementing-fsrs-in-100-lines) | The FSRS-5 parameters and formulas |
| [The Pimsleur Method](https://www.pimsleur.com/the_pimsleur_method) | Graduated interval recall, anticipation, words learned inside conversations |
| [Swain's output hypothesis (JALT review)](https://jalt-publications.org/tlt/articles/2198-output-and-beyond-dialogue-review-merrill-swains-current-approach-sla) | Producing language makes you notice the gaps, so input alone isn't enough |
| [Shadowing as a language learning method](https://journal.uia.no/index.php/NJLTL/article/view/1139) | Shadowing helps listening and pronunciation, though the studies are small |
| [Duolingo on streaks](https://blog.duolingo.com/how-duolingo-streak-builds-habit) | Streak freezes kept more people learning daily without encouraging days off |
| [The Palteca Method](https://palteca.com/method) | Understandable input, topic clusters, 7±2 items, minimal pairs, short grammar insights |

Most mainstream apps teach MSA, Egyptian or Levantine ([overview](https://talkinarabic.com/arabic-apps/)), which is why I wrote this one for Khaleeji.

### Known limits

- **The audio is standard Arabic.** Phone voices read قهوة as qahwa where Gulf speakers say gahwa. Cards where this matters show a "Gulf: …" chip, and the transliteration always shows the Gulf pronunciation. For real Gulf audio, use YouTube or a tutor.
- **Nobody native has checked it yet.** Stage 1 was checked by two separate AI reviewers, and the stage 2+ lessons are AI-written and only machine-checked. Every card has a "hide it" button for anything that looks off.
- **Speech scoring checks words, not accent.** A green word means it was understood, not that it sounded Emirati.
- **An app won't get you fluent on its own.** From stage 3, add a weekly session with a native Gulf tutor.
- Gulf varieties differ (Kuwaiti shinu vs Emirati shu, cham vs kam). The notes flag the common ones, not all of them.
- No pictures. Palteca uses images as memory aids, but published pages can't load outside images.
- I've tested the layout in Chromium at phone and desktop sizes. I haven't tried real device voices, real speech recognition, or the backup download inside an iPhone home screen app yet.

### Tests

```powershell
node --test tests/logic.test.js
```

They cover the FSRS scheduler (learning steps, growth, lapses, the stability floor, hard < good < easy, the retention target, older cards), the daily review cap, loading damaged backups safely, card modes, interleaving, the stage gate, the AI-lesson validator, Arabic normalisation (including چ and گ), word-level speech matching, streaks across time zones, review days across a clock change, a time-zone change and the clock going back, the sync merge, the contrast of the main text colours in light and dark mode, and the course data: every hand-written lesson has to pass the same validator AI lessons do. They also check the built app loads nothing from other sites, that its content security policy matches its inline scripts, that the service worker opens the saved copy offline or on a stalled connection, and that Android's back gesture closes a lesson without quitting the app.

## Credits

| What | From | Licence |
|---|---|---|
| Amiri (Arabic font) | [The Amiri Project Authors](https://github.com/aliftype/amiri), subset files from [Fontsource](https://fontsource.org) | SIL Open Font License 1.1, see `pwa/fonts/OFL-Amiri.txt` |
| Readex Pro (Latin font) | [The Readex Pro Project Authors](https://github.com/ThomasJockin/readexpro), subset files from [Fontsource](https://fontsource.org) | SIL Open Font License 1.1, see `pwa/fonts/OFL-ReadexPro.txt` |
| App icons | Made for this app: حرف set in Amiri | |
| FSRS-5 default parameters | [open-spaced-repetition](https://github.com/open-spaced-repetition/fsrs4anki) | MIT |

The teaching ideas I credit to the Palteca method are in my own words. No Palteca text, lessons or images are included.

## Licence

MIT, so do what you like with it (see [LICENSE](LICENSE)). The fonts aren't mine and stay under the SIL Open Font License; their licence files sit next to them in `docs/fonts/` and `pwa/fonts/`.
