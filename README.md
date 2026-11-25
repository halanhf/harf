# Harf (حرف): Gulf Arabic

I built Harf to teach myself spoken Gulf Arabic (General Khaleeji, leaning Emirati) from zero, with enough fuṣḥā on the side to follow news, signs and formal speech. It's a daily habit app: about 30 minutes a day of reviews, one short lesson and some speaking. Everything you learn keeps coming back on a spaced schedule, and the course doesn't end.

There are two ways to run it, built from the same `index.html`:

| | claude.ai version | Offline app (`docs/`) |
|---|---|---|
| Progress | Saved to my Claude account, so the phone and the PC stay in sync | Stays on that device, or syncs through your own private GitHub repo once you set it up (see "Sync the offline app") |
| Works offline | No | Yes, once it's installed |
| Stages 0 to 5 (all 466 written lessons), reviews, role-play, drills | Yes | Yes |
| AI lessons after stage 5, stories, chat partner, sentence practice | Yes | No, they need Claude |
| Speaking feedback | Claude dictation (Chrome or Edge on a computer or Android) | The browser's own recogniser (Chrome, Edge), plus record and compare |

I use the claude.ai version day to day. The offline app is the backup plan.

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

### The offline app on your phone

It's live at **https://halanhf.github.io/harf/** (GitHub Pages, deployed from `docs/` on `main`; every push to `main` redeploys it).

- **iPhone:** open it in Safari, Share, **Add to Home Screen**.
- **Android:** open it in Chrome, ⋮, **Install app**.

Open it once online; after that it works offline. Progress stays on that device unless you set up sync (see "Sync the offline app"). The backup download still works either way, so use it now and then.

Anyone with the address can open the app. That's fine: it's only the app. Progress never leaves a person's own browser unless they set up their own sync, and that goes to their own private repo.

Then put it on the phone:

- **iPhone:** open the address in Safari, Share, **Add to Home Screen**, **Add**. The home screen app keeps its own progress, separate from Safari, so add it before you start, or move your progress across with a backup.
- **Android:** open it in Chrome and go to Progress, **Install Harf as an app** (or ⋮ menu, **Install and create shortcut**, then **Install**).

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

## Sync the offline app

The offline app can keep your phone and your PC in step through a private GitHub repo (a private folder on GitHub) called `harf-progress`, which only you can read. It syncs when it opens, shortly after you study (never more than once a minute), when you leave it, when the connection comes back and when you return to it. With no connection it carries on and catches up later. If you never set this up, nothing changes: progress stays on that device.

It does not sync with the claude.ai version. **Export backup** and **Import backup** are still the bridge between the two.

### 1. Make the private repo (once)

On github.com: **+** at the top right, **New repository**. Repository name `harf-progress`, choose **Private**, tick **Add a README file**, then **Create repository**.

### 2. Make the token (once; the same token can be pasted on each device)

1. On GitHub, click your picture, then **Settings**, then **Developer settings**, **Personal access tokens**, **Fine-grained tokens**, **Generate new token**.
2. Resource owner: your own account.
3. Repository access: **Only select repositories**, then pick `harf-progress`.
4. Permissions, Repository permissions: set **Contents** to **Read and write**. (Metadata: Read-only is added by itself.)
5. Pick an expiry, press **Generate token**, and copy the token. GitHub shows it once, so keep it somewhere safe until you have pasted it on each device.

### 3. Paste it into the app

In the app: **Progress**, find **Sync**, paste the token into **Access token**, leave **Repo** as `harf-progress` (just the name), and press **Connect**. The line should read `Synced just now`. Do the same on the other device. On an iPhone, the home screen app and Safari keep separate storage, so connect in the one you use.

### What a leaked token could do

Read and write that one repo, nothing else. To cut it off, delete the token on GitHub; the app then says `Sync problem: the token was refused`. On a device, **Disconnect** removes the token from that browser at once and stops any sync in progress. Your progress stays where it is.

### Check that it works (once, with two devices)

1. On the PC, connect. On github.com, `harf-progress` now has `progress.json` and one or more `cards_….json` files.
2. On the phone, connect. Lessons done, streak and review counts match the PC.
3. Review a few cards on the phone, then switch to another app. Bring the PC app to the front: within a moment its counts match.
4. Put the phone in flight mode and review a few cards. Progress shows `Offline, will sync later`. Turn flight mode off: it shows `Synced just now`, and the PC has the reviews after you return to it.
5. With both devices in flight mode, review different cards on each. Turn both back on. Each device ends with both sets of reviews.
6. Press **Disconnect** on the phone. The line reads `Not set up`, progress is still there, and reviews on the phone no longer reach the PC. Connect again to carry on.
7. Optional, and it erases everything: **Reset all progress** (then **Tap again to erase everything**) on one device; open the other and it is empty too.

## Updating

- **After changing `index.html`:** rebuild the offline app and run the tests, then commit both.

  ```powershell
  python build.py
  node --test tests/logic.test.js
  ```

  CI fails if `docs/` doesn't match `index.html`.
- **claude.ai version:** republish the artifact from the new `index.html`. It keeps the same link and your progress. The page needs the `db`, `user`, `sample`, `dictation` and `downloads` capabilities, so keep them when republishing (without `downloads` the backup can only go to the clipboard).
- **Hosted offline app:** GitHub Pages redeploys on every push to `main`. The app loads the new version the next time it's opened online.
- **PC install from 127.0.0.1:** start the server again, open the app once, then stop the server.

Updates never touch progress. It lives in browser storage, not in the files.

## Removing it

Export a backup first if you might want your progress back.

- **Chrome (Windows):** open the app, ⋮ menu, **Uninstall Harf**, **Remove**. Tick **Also delete data from Chrome** to wipe progress too.
- **Edge:** go to `edge://apps`, **Details** on Harf, **Uninstall**.
- **iPhone or Android:** touch and hold the icon and remove it.
- **Just the progress:** Progress, Danger zone, **Reset all progress**. That also clears it on every device synced to the account or through GitHub, and a backup made before it won't bring it back.

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
| Sync problem: the token was refused | The token expired, was revoked, or doesn't have Contents: Read and write on the repo. Pasting it can also fail if a space or odd character got into the middle of it. Make a new one, press **Disconnect**, then **Connect** with it |
| Sync problem: the progress repo was not found | The repo name is wrong (type just `harf-progress`, not your name before it), or the token wasn't given access to it |
| Sync problem: the saved progress could not be read | A file in `harf-progress` was edited by hand or damaged. Delete that file on GitHub and press **Sync now**: the app writes it again from this device. Nothing is overwritten until you do |
| Sync problem: GitHub is not responding | GitHub or the connection is down. Progress stays on the device and the app tries again by itself |
| Sync problem: another device was saving at the same time | Wait a moment and press **Sync now**. It also tries again the next time you study or open the app |
| "You're offline" when pressing **Connect** | Connecting needs the internet once. Get online and press **Connect** again |
| `pages` workflow fails | Pages isn't switched on yet: Settings, Pages, Source: **GitHub Actions** |

## Security and privacy

- No accounts, keys or passwords in the repo or the page. If you set up sync, your access token is kept only in that browser's storage: it is never in a backup, in the synced files or in an error message, and **Disconnect** removes it.
- The offline app has a strict content security policy: it only runs its own scripts and loads nothing from other sites. The fonts are bundled. The only other site the page may talk to is api.github.com, and only once you have set up sync.
- Progress lives in your browser, in your Claude account for the claude.ai version, and in your private `harf-progress` repo if you set up sync. The hosted app has nothing private in it.
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
| No connection | Study carries on. Changes wait and are sent when the connection is back |
| Two devices studied before they synced | Each card keeps its most recent review, so neither loses work |
| The access token expired or was revoked | Sync stops and says so. Progress stays on the device; paste a new token to carry on |

## How it works

`index.html` is the whole app and is what gets published on claude.ai. `python build.py` turns it into `docs/`: the same page with the fonts bundled, a content security policy, a web app manifest and a small service worker. The service worker fetches the page network-first (so updates show up), falls back to the saved copy when you're offline or the network hasn't answered in 4 seconds, and keeps the fonts and icons cached for offline use. Opening the root `index.html` directly isn't the offline app: it loads Google Fonts and has no service worker, so serve `docs/` instead.

### The method

I based it on the [Palteca method](https://palteca.com/method) (input you can understand, small topic batches, spaced repetition, ear training, short grammar tips) and added a lot more speaking, which input-first methods tend to skip.

- Every lesson starts with a short dialogue. You listen and work it out before the English shows.
- 5 to 9 new phrases per lesson, all on one topic, then a quick check straight away.
- Reviews use FSRS-5, the scheduler Anki uses by default. New and missed phrases come back after 1 and 10 minutes, then at growing gaps. You pick the retention target (85, 90 or 95%).
- Like Anki, a review day runs from 4am to 4am. A card due tomorrow is in tomorrow's session whatever time you study, not only from the minute you graded it. The streak and the daily limits on new lessons and reviews still turn over at midnight.
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
| 1 Survival | A1 | 66 written lessons: greetings, survival words, requests, about me, directions, numbers, prices, café, time, taxi, hospitality |
| 2 Everyday | A2 | 90 written lessons: daily life, past and future, plans, shopping, health, family |
| 3 Conversations | B1 | 110 written lessons: telling stories, opinions, work and study, problems and complaints |
| 4 Fluent | B2 | 110 written lessons: hypotheticals, debate, media, other Gulf voices, proverbs, the workplace |
| 5 Native-like | C1 | 90 written lessons: hedging, emphasis, politeness and register, irony, negotiation, conflict, heritage, religion, presentations |
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
- **Nobody native has checked it yet.** Every lesson was checked by at least two separate AI reviewers (one for form, one for meaning), against a corpus of Emirati and Kuwaiti writing and published sources, and every stage had a whole-stage review. A few hundred thin or uncertain forms are on a list for a native speaker to confirm, and most of those are taught for recognising only. Every card has a "hide it" button for anything that looks off.
- **Speech scoring checks words, not accent.** A green word means it was understood, not that it sounded Emirati.
- **An app won't get you fluent on its own.** From stage 3, add a weekly session with a native Gulf tutor.
- Gulf varieties differ (Kuwaiti shinu vs Emirati shu, cham vs kam). The notes flag the common ones, not all of them.
- No pictures. Palteca uses images as memory aids, but published pages can't load outside images.
- The 82 graded fuṣḥā readings (signs and receipts at level 1 up to editorials at level 5) were each checked by two to four rounds of separate AI reviewers for grammar, vowel marks, translation and level. A native check would still catch things they can't, especially how natural the wording is.
- I've tested the layout in Chromium at phone and desktop sizes. I haven't tried real device voices, real speech recognition, or the backup download inside an iPhone home screen app yet.

### Tests

```powershell
node --test tests/logic.test.js
```

They cover the FSRS scheduler (learning steps, growth, lapses, the stability floor, hard < good < easy, the retention target, older cards), the daily review cap, loading damaged backups safely, card modes, interleaving, the stage gate, the AI-lesson validator, Arabic normalisation (including چ and گ), word-level speech matching, streaks across time zones, review days across a clock change, a time-zone change and the clock going back, the sync merge, the contrast of the main text colours in light and dark mode, and the course data: every hand-written lesson has to pass the same validator AI lessons do. They also check the built app loads nothing from other sites, that its content security policy matches its inline scripts, that the service worker opens the saved copy offline or on a stalled connection, and that Android's back gesture closes a lesson without quitting the app. The sync tests run the whole cycle against a stand-in for GitHub (first sync, two devices, a refused write, a failed read, start over). They also check that the token only ever travels in the request header to api.github.com, and that the claude.ai build never calls GitHub.

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
