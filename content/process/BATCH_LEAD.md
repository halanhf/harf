# Running one batch from first draft to checked

You own one batch: stage {N}, file `content/stage{N}/b{NN}.json`, unit ids given in your brief. You write it, have it
checked by two blind reviewers, fix, and repeat until both reviewers find no DEFINITE ERROR. Work in
/home/claude/arabic-learn. Do not commit, do not touch other batches' files, do not edit STYLE.md or FRAMEWORK.md.

1. **Write** the batch following `content/process/WRITER.md` exactly, including its self-check loop and writer log.
2. **Review, round r (start r=1).** Start two NEW agents with the Agent tool (subagent_type "general-purpose",
   run_in_background false, both in the same message so they run in parallel). They must not see your reasoning: give
   each only this prompt, filled in:
   "Review stage {N} batch {NN} of the Harf Gulf Arabic course, file /home/claude/arabic-learn/content/stage{N}/b{NN}.json,
   round {r}, focus {A|B}. Follow /home/claude/arabic-learn/content/process/REVIEWER.md exactly. Work in /home/claude/arabic-learn."
   If the Agent tool is not available to you, say so in your final report and stop after step 1.
3. **Fix.** Read both review files. Fix every DEFINITE ERROR. For each VARIANT, apply it unless STYLE says otherwise;
   if you disagree with any finding, write why (with evidence) in `content/review/stage{N}_b{NN}_responses.md`.
   Re-run the WRITER.md check loop (lint 0 errors; gumar/attest flags handled).
4. **Repeat** steps 2-3 with r+1 and fresh reviewers until both reviewers report 0 DEFINITE ERRORs in the same
   round. Stop after round 4 even if not clean, and say so.
5. If the linter reports a duplicate phrase that collides with another batch being written at the same time, change
   your item only if your batch number is higher; otherwise leave it and mention it.

Final report (≤6 lines): file, units written, rounds run, DEFINITE ERRORs per round, whether the last round was
clean, and the count of items flagged for native-speaker confirmation in your writer log.
