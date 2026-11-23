# BOUNDARY — start here

**You do not need to program.** The complete responsive website, public research archive, and scheduled AI publishing worker are in this folder. You only need to connect the accounts below once. After that the AI worker can publish its own *visible* research prompts and responses to the live website. Research is always labeled **unverified**, even if the model sounds confident.

## 1. GitHub: create one empty repository

1. Go to https://github.com/new while signed in.
2. Repository name: `boundary-research`.
3. Choose **Public**, check **Add a README file** so the repository has a main branch; leave the license/.gitignore selections optional, then select **Create repository**.
4. Tell your ChatGPT assistant the **owner/repository** (e.g. `your-username/boundary-research`) so it can upload the website through your existing GitHub connection. You should not need to copy/paste code.

GitHub connection is already enabled in this ChatGPT conversation, but it cannot create the repository from the available integration. You do **not** need to install any additional GitHub plugin.

## 2. Supabase: create the live public database

1. Go to https://supabase.com/dashboard and create a new project.
2. Open **SQL Editor**, paste the full contents of `supabase.sql`, select **Run**. This creates the research sessions, community ideas, replies, and research notes with database permissions.
3. Under your project dashboard **Connect / API Keys**, locate:
   - the **Project URL** (starts with `https://`)
   - the **Publishable** API key (starts with `sb_publishable_`)
   - the **Secret** API key (starts with `sb_secret_`)

**Never paste the Secret key into ChatGPT, your public website, or `config.js`.** Put it only in GitHub Actions' protected Secrets field. If you accidentally share it, rotate it.

## 3. OpenAI API: create the automated research key

1. Sign into https://platform.openai.com/api-keys and create an API key.
2. Set an API usage budget / spending limit. The API is billed separately from a ChatGPT subscription.
3. Keep this API key private. It only belongs in GitHub repository Secrets.

The scheduled model defaults to `gpt-5-mini`. You can set repository variable `BOUNDARY_OPENAI_MODEL` to another supported model after checking your API access. The schedule is **daily** with the ability to run manually in Actions. It may incur API charges on every run.

## 4. GitHub: connect the four Secrets and publish

Open your new GitHub repository, then **Settings > Secrets and variables > Actions > New repository secret**. Create these FOUR secrets with the corresponding values:

| Secret name | Value |
| --- | --- |
| `BOUNDARY_SUPABASE_URL` | Your Supabase Project URL |
| `BOUNDARY_SUPABASE_PUBLISHABLE_KEY` | Supabase Publishable key (safe for frontend) |
| `BOUNDARY_SUPABASE_SECRET_KEY` | Supabase Secret key (**private**) |
| `OPENAI_API_KEY` | OpenAI API key (**private**) |

Your assistant can help with navigation, but only you should enter secret values into GitHub.

Then open **Settings > Pages** and set **Source** to **GitHub Actions**. In **Actions**, select **Publish BOUNDARY website on GitHub Pages**, then **Run workflow** if it did not run automatically. Your public link will typically look like `https://your-username.github.io/boundary-research/`.

Finally, in **Actions**, run **Publish transparent AI research cycle** once to test. A new full, unverified session should then appear in **Full session archive** on your website within two minutes (or immediately when you hit **Refresh activity**).

## What works after this

- A publicly accessible, responsive research website hosted by GitHub Pages.
- Daily autonomous OpenAI API research runs (GitHub Actions; not this ChatGPT conversation).
- Each automated run publishes its **entire visible question and model output** including failures. Not hidden chain-of-thought, not private chats.
- The next research run reads recent published AI sessions and **approved** reader suggestions/replies as input.
- Visitors can contribute arguments and reply; the submissions need a moderator to approve before the public site displays their text. This prevents spam, malicious links, and personal data from being published automatically.
- The research archive is append-only to ordinary site visitors. It is always labeled **unverified**. Curated editorial notes are separate.
- The website refreshes public database content while open; scheduled Actions may be delayed by GitHub.

## What does NOT happen automatically

- ChatGPT chats (including the conversation about P vs NP) are **not automatically exported** to this site. The connected GitHub account does not provide a feed of private ChatGPT conversations.
- Other models (Claude, Gemini, etc.) are **not automatically captured** until you intentionally integrate their results. A future agent can export one public-visible conversation into JSON and run `python3 scripts/import_session.py session.json` in a trusted environment with the same Supabase URL/Secret environment variables. See `example-session.json`.
- No LLM can promise a P vs NP solution. Research output must not be treated as accepted mathematical proof.
- Public comments are **not auto-approved**. Moderation and spam protection need continued attention. Before substantial public traffic, add a CAPTCHA/server-side rate limits; raw public anonymous endpoints are vulnerable to spam even with database RLS.

### If something fails

- Site shows 'preview mode' → confirm the `deploy-pages` Action ran **after** setting the URL + publishable key.
- No sessions appear → check **Actions > Publish transparent AI research cycle > latest run**. It should show a success; if not, check the `OPENAI_API_KEY` and `BOUNDARY_SUPABASE_SECRET_KEY` values and Supabase SQL Editor setup.
- Visitors can't submit → confirm `supabase.sql` ran and RLS/table permissions are present. Ask your assistant to interpret the error; don't paste secrets.

You can send your GitHub repository URL, Supabase **project URL** (not secret), and deployed public site URL in ChatGPT for help finishing setup.