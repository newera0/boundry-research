# BOUNDARY

**Public website:** https://newera0.github.io/boundry-research/  
**Repository:** https://github.com/newera0/boundry-research/

An independent, public research notebook documenting explorations around the open **P versus NP** problem.

**You can follow research without pretending that an AI has solved P vs NP.** The website explicitly distinguishes complete AI research transcripts, condensed editorial notes, and community contributions. All unreviewed/AI claims are labeled **unverified**.

## Nontechnical owner? Start here.

Open [START_HERE.md](START_HERE.md). It explains the four one-time account connections. The full GitHub Pages site, GitHub Actions worker, Supabase schema, and frontend are already coded.

## What is included

- Mobile-first responsive editorial site (static HTML, CSS, JS, no build step).
- Project overview, research paths, challenges, searchable seven-note editorial seed log.
- **Full Session Archive** with prompts, model outputs, failed runs, pagination, source filters, and unverified labels.
- Public activity stream that updates when new remote sessions or editorial notes are received.
- Community suggestions, moderated replies, and contribution UI.
- SQL schema for Supabase database with row-level security.
- GitHub Pages deployment workflow (deploys public config from GitHub Secrets).
- Daily GitHub Action calling the OpenAI Responses API, using recent public runs and approved community comments as context, then posting its full visible prompt and response to Supabase.
- RSS workflow that can include published notes and public research sessions.
- Programmatic manual import of full user-visible session transcripts from other models.
- Tests for key pipeline logic and HTML/JS event behavior.

## How the two research feeds differ

| Record | Where it comes from | Visible to public | Mathematical verification |
| --- | --- | --- | --- |
| **Raw research session** | GitHub scheduled OpenAI API call or deliberate manual import | Immediately, including unsuccessful attempts | Always `unverified` |
| **Editorial research note** | Curated explanation of a mathematical issue | After an editor publishes it | Explicitly stated in note; never inferred from model confidence |
| **Reader suggestion/reply** | Visitor form | After moderation | Public does not imply correct |

**The initial seven notebook summaries are not the verbatim source chats.** They summarize preliminary investigation and must not be mistaken for formal proofs. A historical ChatGPT conversation is not imported without someone explicitly providing it. No site can read private model chain-of-thought.

## Local development

```bash
python3 -m http.server 8080
# http://localhost:8080
```

The included `config.js` is deliberately blank, so this is preview mode until a deployment environment writes the public Supabase URL and publishable key. A standalone preview is included separately with the download.

Run tests:

```bash
python3 -m unittest -v tests
node --check app.js
```

## Automation details

- `.github/workflows/deploy-pages.yml`: automatic GitHub Pages deployment when main changes. Generates browser-safe `config.js` using `scripts/write_public_config.py`. Never exposes Supabase secrets or OpenAI credentials.
- `.github/workflows/run-research.yml`: runs once daily (UTC scheduling), and on-demand via **Actions > Run workflow**. Calls OpenAI Responses API, writes a complete visible transcript to `research_sessions` with `verification=unverified`. Requires `OPENAI_API_KEY`, `BOUNDARY_SUPABASE_URL`, `BOUNDARY_SUPABASE_SECRET_KEY`. Optional variable `BOUNDARY_OPENAI_MODEL` defaults to `gpt-5-mini`.
- `.github/workflows/sync-rss.yml`: refreshes public RSS feed every six hours, then redeploys it on Pages.
- `scripts/import_session.py`: owner-controlled import of an external model's user-visible conversation from a JSON file. The import process does not happen automatically for random ChatGPT sessions.

## Security and operational boundaries

- The website can read publicly archived sessions, published notes, and **approved** community submissions only. Visitors cannot approve their own content or insert AI sessions through the anonymous frontend. This is enforced by SQL RLS and grants.
- The Supabase **Secret** key and OpenAI API key go only in GitHub Actions Secrets; never in public JavaScript or chat.
- An anonymous form protected solely by RLS can still receive spam. Before promoting widely, add server-verified CAPTCHA and rate limiting. Moderation remains required for public reader text.
- Only visible model output is stored, never private chain-of-thought. Full visible public runs can include errors, contradictions, and unresolved steps.
- These are exploratory AI-generated materials, not scholarly verification. Any apparent breakthrough requires an exact formal proof, reproducibility, and outside scrutiny.
- OpenAI API use incurs separate charges. Github scheduled jobs may be delayed, and workflow schedules in inactive public repositories can be disabled by GitHub.

## Files

`index.html` UI; `styles.css` design; `app.js` interactions and API; `data.js` seed notebook; `config.js` safe local defaults; `supabase.sql` database; `scripts/research_cycle.py` AI worker; `scripts/import_session.py` manual transcript importer; `scripts/sync_feed.py` RSS; `.github/workflows/` deployment and schedules; `START_HERE.md` setup; `EDITORIAL_WORKFLOW.md` source and verification policies; `tests.py` unit tests.

© 2026 BOUNDARY. Independent exploratory research. No proof of P = NP or P ≠ NP is claimed.