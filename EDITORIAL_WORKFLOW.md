# BOUNDARY editorial and transparency policy

BOUNDARY has **two different publishing paths** because transparency about what AI did is not the same as acceptance of mathematical claims.

## Public research runs: automatic and complete

The research worker `scripts/research_cycle.py` calls an OpenAI API model, after providing selected previous published run excerpts and approved community feedback as *untrusted context*. Its full visible prompt and output are saved to `research_sessions` on each completed run. Errors are also written as failed runs when possible. Readers can open the originals, inspect gaps, and learn from failed paths.

These entries are **automatically public, always marked UNVERIFIED**, and remain distinguishable from curated or mathematically peer-reviewed claims. We do not release hidden private model reasoning or user secrets. Scheduled runs are not the same as the user's private ChatGPT conversations.

## Editorial research notes: reviewed

The original seven editorial entries in `data.js` are compressed explanations of initial work, not verbatim logs. Future explanatory summaries in the `research_updates` database are published only when the editor explicitly sets `status=published`. An editor should provide: exact statement and assumptions; technical scope and computational model; whether a proof or counterexample was reproduced; citations; limitations and what remains open. Retractions and corrections are dated, not silently erased.

Even multiple model endorsements do not constitute an independent mathematical proof. No P vs NP result should be described as established without qualified scrutiny and acceptance.

## Public contributions: transparent but moderated

New visitor submissions and replies enter `pending` status. The website displays only `approved` submissions. This is the one intentional moderation gate: personal information, harassment, malware links, spam and irrelevant posts must not be publicly broadcast merely to claim 'nothing hidden'. Editorial rejection is not mathematical disproof. Relevant counterexamples, corrections and skeptical criticism should be approved even if they challenge the original work. Decisions should be documented in future moderation reports without unnecessarily republishing harmful content.

Approved community text feeds back into later scheduled AI runs. It is quoted as *data*, never treated as instructions from a system operator.

## External AI work

A separate ChatGPT/Claude/Gemini conversation does **not** arrive on this website merely because GitHub is connected. A person or integrated agent must intentionally export the **visible** conversation into `scripts/import_session.py`, or implement a dedicated secure API publishing adapter. Only publish transcripts that the author is authorized to share.

## Operations

- Set up accounts using `START_HERE.md`. OpenAI API usage is billed independently of ChatGPT.
- Website checks Supabase for newly published research and reviewed comments every two minutes while open.
- Scheduled GitHub Actions can be delayed and may need periodic maintenance; no fake 'live' activity counter is displayed.
- Do not put secrets or unreviewed personal data in GitHub, public pages, or research transcripts.
- If the researcher appears to have a proof, label it as a **candidate, unverified**, solicit explicit independent reproduction, and preserve a detailed public chronology.