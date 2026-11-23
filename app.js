(() => {
  'use strict';
  const data = window.BOUNDARY_DATA;
  const cfg = window.BOUNDARY_CONFIG || {};
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const safe = (value = '') => String(value).replace(/[&<>"']/g, ch => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch]));
  const hasBackend = Boolean(cfg.supabaseUrl?.startsWith('https://') && cfg.supabaseAnonKey && !cfg.supabaseAnonKey.includes('service_role') && !cfg.supabaseAnonKey.startsWith('sb_secret_'));
  const paths = {
    'layout': '<rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 9v12"/>',
    'route': '<circle cx="6" cy="19" r="2"/><path d="M9 19h8a4 4 0 0 0 0-8H7a4 4 0 0 1 0-8h8"/><path d="m13 1 3 2-3 2"/>',
    'history': '<path d="M3 12a9 9 0 1 0 3-6.7L3 8"/><path d="M3 3v5h5M12 7v5l3 2"/>',
    'target': '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1"/>',
    'users': '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>',
    'book': '<path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2Z"/>',
    'book-open': '<path d="M12 7v14M3 18V4a1 1 0 0 1 1-1h3c2.5 0 5 1 5 4 0-3 2.5-4 5-4h3a1 1 0 0 1 1 1v14h-4c-3 0-5 1-5 3-0-2-2-3-5-3H3Z"/>',
    'arrow-up-right': '<path d="M7 17 17 7M7 7h10v10"/>',
    'arrow-right': '<path d="M4 12h16m-7-7 7 7-7 7"/>',
    'rss': '<path d="M4 11a9 9 0 0 1 9 9M4 4a16 16 0 0 1 16 16"/><circle cx="5" cy="19" r="1"/>',
    'share': '<circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><path d="m8.8 10.7 6.4-4.4m-6.4 7 6.4 4.4"/>',
    'menu': '<path d="M3 6h18M3 12h18M3 18h18"/>',
    'shield-check': '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z"/><path d="m9 12 2 2 4-4"/>',
    'shield': '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z"/>',
    'refresh': '<path d="M3 12a9 9 0 0 1 15.4-6.4L21 8M21 3v5h-5M21 12a9 9 0 0 1-15.4 6.4L3 16M3 21v-5h5"/>',
    'compass': '<circle cx="12" cy="12" r="10"/><path d="m16.2 7.8-2.6 5.8-5.8 2.6 2.6-5.8z"/>',
    'calendar': '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M16 3v4M8 3v4M3 10h18"/>',
    'grid': '<rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>',
    'hash': '<path d="M4 9h16M4 15h16M11 3 7 21M17 3l-4 18"/>',
    'layers': '<path d="m12 2 9 5-9 5-9-5 9-5ZM3 12l9 5 9-5M3 17l9 5 9-5"/>',
    'circle-help': '<circle cx="12" cy="12" r="10"/><path d="M9.1 9a3 3 0 0 1 5.8 1c0 2-3 2-3 4M12 17h.01"/>',
    'crosshair': '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="3"/><path d="M12 2v4m0 12v4M2 12h4m12 0h4"/>',
    'alert-triangle': '<path d="m10.3 3.9-8.4 14.5A2 2 0 0 0 3.7 21h16.6a2 2 0 0 0 1.8-2.6L13.7 3.9a2 2 0 0 0-3.4 0Z"/><path d="M12 9v4m0 4h.01"/>',
    'search': '<circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/>',
    'chevron-down': '<path d="m6 9 6 6 6-6"/>',
    'check-circle': '<circle cx="12" cy="12" r="10"/><path d="m8 12 3 3 5-6"/>',
    'plus': '<path d="M12 5v14M5 12h14"/>',
    'info': '<circle cx="12" cy="12" r="10"/><path d="M12 11v6M12 7h.01"/>',
    'message-circle': '<path d="M21 11.5a8.4 8.4 0 0 1-.9 3.8A8.5 8.5 0 0 1 12.5 20a8.4 8.4 0 0 1-3.8-.9L3 21l1.9-5.7a8.4 8.4 0 0 1-.9-3.8A8.5 8.5 0 0 1 12.5 3H13a8.5 8.5 0 0 1 8 8.5Z"/>',
    'copy': '<rect x="8" y="8" width="13" height="13" rx="2"/><path d="M16 8V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h3"/>',
    'x': '<path d="M18 6 6 18M6 6l12 12"/>',
    'link': '<path d="M10 13a5 5 0 0 0 7 .5l3-3a5 5 0 0 0-7-7l-1.7 1.7"/><path d="M14 11a5 5 0 0 0-7-.5l-3 3a5 5 0 0 0 7 7l1.7-1.7"/>',
    'flask': '<path d="M9 3h6M10 3v7L4 20a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1l-6-10V3M8 15h8"/>'
  };
  function icon(name) { return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths[name] || paths.info}</svg>`; }
  function hydrateIcons(scope = document) { $$('[data-icon]', scope).forEach(el => { el.innerHTML = icon(el.dataset.icon); }); }
  let mode = 'plain';
  let filter = 'all';
  let search = '';
  let updates = [...data.updates];
  let toastTimeout;
  let lastReplyFocus = null;
  const initialCommunityMarkup = $('#idea-list').innerHTML;
  let communityItems = [];
  let reviewedReplies = [];
  let refreshBusy = false;
  let sessionItems = [];
  let sessionFilter = 'all';
  let sessionOffset = 0;
  let sessionHasMore = false;
  let sessionLoadBusy = false;
  const toast = msg => { const el = $('#toast'); el.textContent = msg; el.classList.add('visible'); clearTimeout(toastTimeout); toastTimeout = setTimeout(() => el.classList.remove('visible'), 3200); };
  const formatDate = value => { const date = new Date(`${String(value).slice(0,10)}T12:00:00Z`); return Number.isNaN(+date) ? 'UNDATED' : date.toLocaleDateString('en-US', { month: 'short', day: '2-digit', timeZone: 'UTC' }).toUpperCase(); };

  function renderSessions() {
    if (!hasBackend) return;
    const entries = sessionItems.filter(item => {
      if (sessionFilter === 'failed') return item.outcome === 'failed';
      if (sessionFilter === 'auto') return item.source === 'boundary-scheduled-openai';
      if (sessionFilter === 'imported') return item.source !== 'boundary-scheduled-openai';
      return true;
    });
    $('#lab-count').textContent = `${sessionItems.length} LOADED · ${entries.length} SHOWN`;
    $('#lab-more').hidden = !sessionHasMore;
    $('#lab-list').innerHTML = entries.length ? entries.map(item => {
      const date = new Date(item.created_at);
      const shownDate = Number.isNaN(+date) ? 'TIME UNKNOWN' : date.toLocaleString('en-US', {dateStyle:'medium',timeStyle:'short'});
      const auto = item.source === 'boundary-scheduled-openai';
      const kind = item.outcome === 'failed' ? 'FAILED RUN' : (auto ? 'AUTOMATED AI' : 'IMPORTED SESSION');
      return `<article class="lab-card"><div class="lab-card-top"><span class="lab-kind ${item.outcome === 'failed' ? 'failed' : ''}">${kind}</span><span class="lab-time">${safe(shownDate)} · ${safe(item.model || 'unknown model')} · UNVERIFIED</span></div><h3>${safe(item.title)}</h3><p class="lab-card-sub">${safe(item.summary || 'Full publicly visible research exchange. No proof is claimed.')}</p><details class="lab-session-details"><summary>READ THE COMPLETE PROMPT</summary><pre>${safe(item.prompt)}</pre></details><details class="lab-session-details"><summary>READ THE COMPLETE MODEL OUTPUT</summary><pre>${safe(item.response)}</pre></details></article>`;
    }).join('') : '<div class="lab-empty"><strong>No sessions in this category yet.</strong><p>Try another filter. Research runs will appear once published.</p></div>';
    const newest = sessionItems[0];
    $('#lab-last-sync').textContent = newest ? `Newest publicly archived session: ${new Date(newest.created_at).toLocaleString('en-US')}. All content labeled unverified.` : 'Connected. Awaiting the first research cycle.';
  }

  async function loadSessions({ reset = true } = {}) {
    if (!hasBackend || sessionLoadBusy) return;
    sessionLoadBusy = true;
    if (reset) { sessionOffset = 0; sessionItems = []; }
    try {
      const page = await api(`research_sessions?select=id,created_at,run_key,source,model,title,prompt,response,summary,outcome,verification&order=created_at.desc&limit=21&offset=${sessionOffset}`);
      if (!Array.isArray(page)) throw new Error('Unexpected response');
      const next = page.slice(0,20);
      const seen = new Set(sessionItems.map(s => s.run_key));
      for (const item of next) if (!seen.has(item.run_key)) sessionItems.push(item);
      sessionOffset += next.length;
      sessionHasMore = page.length > 20;
      renderSessions();
      renderPulse();
    } catch (err) {
      if (!sessionItems.length) $('#lab-list').innerHTML = `<div class="lab-empty"><strong>Could not load research sessions.</strong><p>${safe(err.message)}. Try refreshing later.</p></div>`;
      $('#lab-count').textContent = 'CONNECTION ERROR';
      console.warn('Research session feed unavailable:', err.message);
    } finally { sessionLoadBusy = false; }
  }
  function bindSessions() {
    $$('.lab-filter').forEach(button => button.addEventListener('click', () => {
      sessionFilter = button.dataset.labFilter;
      $$('.lab-filter').forEach(b => { const active = b === button; b.classList.toggle('is-selected',active); b.setAttribute('aria-pressed',String(active)); });
      renderSessions();
    }));
    $('#lab-more').addEventListener('click', () => loadSessions({reset:false}));
  }

  function renderPulse() {
    const merged = [
      ...updates.map(u => ({date: String(u.date),title:u.title,plain:u.plain,tag:u.tag||'EDITORIAL NOTE'})),
      ...sessionItems.map(s => ({date:String(s.created_at),title:s.title,plain:s.summary,tag:s.outcome === 'failed' ? 'FAILED RESEARCH RUN' : 'UNVERIFIED FULL TRANSCRIPT'}))
    ];
    const newest = merged.sort((a,b) => String(b.date).localeCompare(String(a.date))).slice(0,4);
    $('#pulse-items').innerHTML = newest.map(u => `<article class="pulse-entry"><div class="pulse-entry-date">${formatDate(u.date)}</div><div><h3>${safe(u.title)}</h3><p>${safe(u.plain || '')}</p><span class="pulse-entry-tag">${safe(u.tag)}</span></div></article>`).join('');
    if (newest[0]) {
      const latest = new Date(`${String(newest[0].date).slice(0, 10)}T12:00:00Z`);
      if (!Number.isNaN(+latest)) {
        $('#pulse-last-date').textContent = `Last public research note: ${latest.toLocaleDateString('en-US', { dateStyle: 'medium', timeZone: 'UTC' })}`;
        $('#latest-date-label').textContent = latest.toLocaleDateString('en-US', {month: 'short', day: 'numeric', timeZone: 'UTC'});
        $('#latest-year-label').textContent = String(latest.getUTCFullYear());
      }
    }
    $('#pulse-sync-state').textContent = hasBackend ? 'CONNECTED PUBLIC FEED' : 'LOCAL EDITORIAL SNAPSHOT';
    $('#pulse-refresh-note').textContent = hasBackend ? 'Public feed refreshes while this page is open.' : 'Connect the public database to enable automatically appearing updates.';
    const latestIdea = communityItems[0];
    if (latestIdea) {
      const replyCount = reviewedReplies.filter(r => r.suggestion_id === latestIdea.id).length;
      $('#pulse-community-summary').innerHTML = `<strong>${safe(latestIdea.title)}</strong><p>Recent reviewed contribution by ${safe(latestIdea.author || 'Anonymous')}${replyCount ? ` · ${replyCount} reviewed ${replyCount===1?'reply':'replies'}` : ''}.</p>`;
    } else {
      $('#pulse-community-summary').innerHTML = '<strong>No reviewed discussion yet</strong><p>Strong objections and corrections are welcome. Contributions are published after moderation.</p>';
    }
  }
  function openReply(id) {
    const item = communityItems.find(x => x.id === id);
    if (!item) return;
    lastReplyFocus = document.activeElement;
    $('#reply-form [name="suggestion_id"]').value = item.id;
    $('#reply-target').textContent = `Replying to “${item.title}”. Provide a clear question, counterexample, or reference. Replies appear after review.`;
    $('#reply-status').textContent = '';
    $('#reply-modal').hidden = false;
    document.body.style.overflow = 'hidden';
    $('#reply-close').focus();
  }
  function closeReply() {
    $('#reply-modal').hidden = true;
    document.body.style.overflow = '';
    lastReplyFocus?.focus?.();
  }
  function renderCommunity() {
    if (!communityItems.length) return;
    const cats = { counterexample: 'COUNTEREXAMPLE', proof: 'PROOF IDEA', reference: 'REFERENCE', experiment: 'EXPERIMENT', question: 'QUESTION' };
    $('#idea-list').innerHTML = communityItems.map(it => {
      const replies = reviewedReplies.filter(r => r.suggestion_id === it.id);
      const discussion = replies.length ? `<div class="idea-replies"><div class="idea-replies-title">${replies.length} REVIEWED ${replies.length === 1 ? 'REPLY' : 'REPLIES'}</div>${replies.map(r => `<div class="idea-reply"><span class="idea-reply-by">${safe(r.author || 'Anonymous')} · ${formatDate(r.published_at || r.created_at || '')}</span><p>${safe(r.body)}</p></div>`).join('')}</div>` : '';
      return `<article class="idea-card"><div class="idea-top"><span class="idea-category">${safe(cats[it.category] || 'COMMUNITY NOTE')}</span><span class="idea-date">${formatDate(it.published_at || '')}</span></div><h3>${safe(it.title)}</h3><p>${safe(it.body)}</p>${it.reference_url && /^https:\/\//i.test(it.reference_url) ? `<a href="${safe(it.reference_url)}" target="_blank" rel="noopener noreferrer" style="font-size:10px">Open supporting reference ↗</a>` : ''}${discussion}<div class="idea-author">SUBMITTED BY ${safe(it.author || 'Anonymous')}</div><button class="idea-reply-button" data-reply="${safe(it.id)}">Reply or challenge this idea ↗</button></article>`;
    }).join('');
  }
  function renderTracks() {
    $('#track-list').innerHTML = data.tracks.map(t => `<button class="track-card" data-track="${safe(t.id)}" data-status="${safe(t.status)}" aria-label="Read ${safe(t.name)} research log"><div class="track-head"><span class="track-icon">${icon(t.icon)}</span><span class="track-number">${safe(t.number)} / 04</span></div><h3>${safe(t.name)}</h3><p class="track-summary">${safe(t.summary)}</p><span class="track-status">${safe(t.label)}</span></button>`).join('');
    $$('[data-track]').forEach(button => button.addEventListener('click', () => {
      const selected = data.tracks.find(t => t.id === button.dataset.track);
      if (selected) {
        $$('[data-track]').forEach(b => b.classList.toggle('selected', b === button));
        if (selected.id === 'verification') {
          $('#about').scrollIntoView({ behavior: 'smooth', block: 'start' });
          toast('Our verification policy is below');
          return;
        }
        search = '';
        $('#log-search').value = '';
        filter = 'all';
        $$('.filter-pill').forEach(p => { p.classList.toggle('active', p.dataset.filter === 'all'); p.setAttribute('aria-pressed', String(p.dataset.filter === 'all')); });
        renderLogs(selected.id);
        $('#journal').scrollIntoView({ behavior: 'smooth', block: 'start' });
        toast(`Showing notes from ${selected.name}`);
      }
    }));
  }
  function renderLogs(trackId = '') {
    let list = updates.filter(u => (filter === 'all' || u.category === filter) && (!trackId || u.track === trackId));
    const term = search.toLowerCase().trim();
    if (term) list = list.filter(u => [u.title,u.plain,u.technical,u.outcome,u.tag].some(x => String(x || '').toLowerCase().includes(term)));
    $('#log-count').textContent = `${String(list.length).padStart(2, '0')} ${list.length === 1 ? 'ENTRY' : 'ENTRIES'}`;
    $('#log-empty').hidden = list.length > 0;
    $('#log-list').innerHTML = list.map(u => `<article class="log-entry"><div class="log-date">${formatDate(u.date)}<br />${safe(String(u.date).slice(0,4))}</div><div class="log-content"><div class="log-title-line"><h3 class="log-heading">${safe(u.title)}</h3><span class="log-tag ${safe(u.category)}">${safe(u.tag)}</span></div><p class="log-explainer">${safe(u[mode] || u.plain || '')}</p><div class="log-entry-bottom"><span class="outcome">${icon('check-circle')} ${safe(u.outcome || 'Working note')}</span><button class="log-expand" aria-expanded="false" type="button">Context & limitations ${icon('chevron-down')}</button></div><div class="log-detail" hidden><strong>WHAT THIS DOES NOT ESTABLISH</strong>${safe(u.detail || 'This is a working research note, not a validated proof.')}</div></div></article>`).join('');
    $$('.log-expand').forEach(b => b.addEventListener('click', () => {
      const entry = b.closest('.log-entry');
      const panel = $('.log-detail', entry);
      const expanded = b.getAttribute('aria-expanded') === 'true';
      b.setAttribute('aria-expanded', String(!expanded));
      panel.hidden = expanded;
      entry.classList.toggle('expanded', !expanded);
    }));
  }
  function renderChallenges() {
    $('#challenge-list').innerHTML = data.challenges.map(ch => `<article class="challenge-card"><div class="challenge-top"><span class="challenge-letter">${safe(ch.index)}.</span><span class="challenge-difficulty">${safe(ch.difficulty)}</span></div><div class="challenge-field">${safe(ch.field.toUpperCase())}</div><h3>${safe(ch.title)}</h3><p>${safe(ch.question)}</p><div class="challenge-bottom"><span>${safe(ch.need)}</span><button data-challenge="${safe(ch.id)}">Contribute ${icon('arrow-up-right')}</button></div></article>`).join('');
    $$('[data-challenge]').forEach(btn => btn.addEventListener('click', () => {
      const c = data.challenges.find(x => x.id === btn.dataset.challenge);
      openModal();
      $('#suggest-form [name="title"]').value = `Re: ${c.title}`;
      $('#suggest-form [name="body"]').focus();
    }));
  }
  function renderGlossary() {
    $('#glossary-list').innerHTML = data.glossary.map(({ term, definition }) => `<div class="glossary-item"><button type="button" aria-expanded="false">${safe(term)} ${icon('chevron-down')}</button><p hidden>${safe(definition)}</p></div>`).join('');
    $$('.glossary-item button').forEach(b => b.addEventListener('click', () => {
      const panel = b.nextElementSibling;
      const open = b.getAttribute('aria-expanded') === 'true';
      b.setAttribute('aria-expanded', String(!open)); panel.hidden = open;
    }));
  }
  function bindMode() {
    $$('.view-choice').forEach(button => button.addEventListener('click', () => {
      mode = button.dataset.mode;
      $$('.view-choice').forEach(b => { b.classList.toggle('active', b === button); b.setAttribute('aria-pressed', String(b === button)); });
      $('#feature-explainer').textContent = data.tracks.find(t => t.id === 'pairing-slices')[mode];
      search = $('#log-search').value;
      renderLogs();
    }));
    $$('.filter-pill').forEach(button => button.addEventListener('click', () => {
      filter = button.dataset.filter;
      $$('.filter-pill').forEach(b => { b.classList.toggle('active', b === button); b.setAttribute('aria-pressed', String(b === button)); });
      $$('.track-card').forEach(b => b.classList.remove('selected'));
      renderLogs();
    }));
    $('#log-search').addEventListener('input', e => { search = e.target.value; $$('.track-card').forEach(b => b.classList.remove('selected')); renderLogs(); });
    $('#feature-deep-dive').addEventListener('click', () => {
      search = '';
      $('#log-search').value = '';
      filter = 'all';
      $$('.filter-pill').forEach(b => { b.classList.toggle('active', b.dataset.filter === 'all'); b.setAttribute('aria-pressed', String(b.dataset.filter === 'all')); });
      $$('.track-card').forEach(b => b.classList.toggle('selected', b.dataset.track === 'pairing-slices'));
      renderLogs('pairing-slices');
      $('#journal').scrollIntoView({ behavior: 'smooth' });
    });
  }
  let lastFocus;
  function openModal() { lastFocus = document.activeElement; $('#suggest-modal').hidden = false; document.body.style.overflow = 'hidden'; $('#modal-close').focus(); }
  function closeModal() { $('#suggest-modal').hidden = true; document.body.style.overflow = ''; lastFocus?.focus?.(); }
  function bindModal() {
    $$('[data-open-suggest]').forEach(b => b.addEventListener('click', openModal));
    $('#modal-close').addEventListener('click', closeModal);
    $('#suggest-modal').addEventListener('click', e => { if (e.target === $('#suggest-modal')) closeModal(); });
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && !$('#suggest-modal').hidden) closeModal();
      if (e.key === 'Tab' && !$('#suggest-modal').hidden) {
        const focusable = $$('button:not(:disabled),input:not([tabindex="-1"]),select,textarea,a[href]', $('#suggest-modal')).filter(x => x.getClientRects().length);
        if (!focusable.length) return;
        if (e.shiftKey && document.activeElement === focusable[0]) { e.preventDefault(); focusable.at(-1).focus(); }
        else if (!e.shiftKey && document.activeElement === focusable.at(-1)) { e.preventDefault(); focusable[0].focus(); }
      }
    });
    if (!hasBackend) {
      $('#backend-note').textContent = 'Preview mode. Copy your idea for now; the owner must connect the shared inbox to receive submissions.';
      $('#submit-suggestion').disabled = true;
      $('#submit-suggestion').title = 'Public inbox not yet configured';
    } else {
      $('#backend-note').textContent = 'Submissions are private until an editor approves them. Do not include personal information.';
    }
    $('#copy-submission').addEventListener('click', async () => {
      const raw = Object.fromEntries(new FormData($('#suggest-form')).entries());
      const output = `BOUNDARY research suggestion\n\nTitle: ${raw.title || '(untitled)'}\nType: ${raw.category}\nAuthor: ${raw.author || 'Anonymous'}\n\n${raw.body || ''}\n\nReference: ${raw.reference_url || '(none)'}`;
      try { await navigator.clipboard.writeText(output); toast('Research idea copied'); }
      catch { const textArea = document.createElement('textarea'); textArea.value = output; document.body.appendChild(textArea); textArea.select(); document.execCommand('copy'); textArea.remove(); toast('Research idea copied'); }
    });
    $('#suggest-form').addEventListener('submit', submitSuggestion);
  }
  const api = async (table, options = {}) => {
    const url = `${cfg.supabaseUrl.replace(/\/$/, '')}/rest/v1/${table}`;
    const response = await fetch(url, { ...options, headers: { apikey: cfg.supabaseAnonKey, ...(cfg.supabaseAnonKey.startsWith('sb_publishable_') ? {} : { Authorization: `Bearer ${cfg.supabaseAnonKey}` }), 'Content-Type': 'application/json', ...options.headers } });
    if (!response.ok) throw new Error(`The public inbox returned ${response.status}. Check connection and policies.`);
    return response.status === 204 || response.status === 201 && !response.headers.get('content-type')?.includes('json') ? null : response.json();
  };
  async function submitSuggestion(event) {
    event.preventDefault();
    const form = event.currentTarget;
    if (!form.reportValidity()) return;
    const fields = Object.fromEntries(new FormData(form));
    if (fields.website) return;
    if (!hasBackend) { $('#submission-status').textContent = 'The public inbox is not connected. Use “Copy idea” and keep the text for later.'; return; }
    const status = $('#submission-status');
    status.classList.remove('error');
    status.textContent = 'Sending your contribution for review…';
    const button = $('#submit-suggestion'); button.disabled = true;
    try {
      await api('suggestions', { method: 'POST', headers: { Prefer: 'return=minimal' }, body: JSON.stringify({ author: (fields.author || 'Anonymous').trim() || 'Anonymous', title: fields.title.trim(), body: fields.body.trim(), category: fields.category, reference_url: fields.reference_url?.trim() || null, status: 'pending' }) });
      status.textContent = 'Submitted successfully. Thank you. An editor can review it before it becomes public.';
      form.reset();
      toast('Idea submitted for review');
    } catch (err) {
      status.classList.add('error');
      status.textContent = `Submission could not be saved. ${err.message} Use “Copy idea” to keep a copy.`;
    } finally { button.disabled = false; }
  }
  async function loadCommunity() {
    if (!hasBackend) { renderPulse(); return; }
    try {
      const items = await api('suggestions?select=id,author,title,body,category,reference_url,published_at&status=eq.approved&order=published_at.desc&limit=12');
      if (!Array.isArray(items)) return;
      communityItems = items;
      if (items.length) {
        try {
          const ids = items.map(i => i.id).filter(id => /^[0-9a-f-]{36}$/i.test(id));
          reviewedReplies = ids.length ? await api(`suggestion_replies?select=id,suggestion_id,author,body,published_at,created_at&status=eq.approved&suggestion_id=in.(${ids.join(',')})&order=published_at.asc&limit=120`) : [];
          if (!Array.isArray(reviewedReplies)) reviewedReplies = [];
        } catch (error) { console.warn('Approved reply feed unavailable:', error.message); reviewedReplies = []; }
        renderCommunity();
      } else { reviewedReplies = []; $('#idea-list').innerHTML = initialCommunityMarkup; $('#idea-list [data-open-suggest]')?.addEventListener('click', openModal); }
      renderPulse();
    } catch (e) { console.warn('Community feed unavailable:', e.message); }
  }
  async function loadUpdates() {
    if (!hasBackend) return;
    try {
      const remote = await api('research_updates?select=id,date,tag,category,title,plain,technical,outcome,detail,track&status=eq.published&order=date.desc&limit=100');
      if (!Array.isArray(remote) || !remote.length) return;
      const byId = new Map(data.updates.map(u => [u.id, u]));
      for (const u of remote) byId.set(u.id, u);
      updates = [...byId.values()].sort((a, b) => b.date.localeCompare(a.date));
      if (updates[0]?.date) {
        const latest = new Date(`${String(updates[0].date).slice(0, 10)}T12:00:00Z`);
        if (!Number.isNaN(+latest)) {
          $('#latest-date-label').textContent = latest.toLocaleDateString('en-US', { month: 'short', day: 'numeric', timeZone: 'UTC' });
          $('#latest-year-label').textContent = String(latest.getUTCFullYear());
        }
      }
      renderLogs();
      renderPulse();
    } catch (e) { console.warn('Editorial research feed unavailable:', e.message); }
  }
  function bindReplies() {
    $('#idea-list').addEventListener('click', e => {
      const btn = e.target.closest('[data-reply]');
      if (btn) openReply(btn.dataset.reply);
    });
    $('#reply-close').addEventListener('click', closeReply);
    $('#reply-modal').addEventListener('click', e => { if (e.target === $('#reply-modal')) closeReply(); });
    document.addEventListener('keydown', e => { if (e.key === 'Escape' && !$('#reply-modal').hidden) closeReply(); });
    if (!hasBackend) {
      $('#reply-backend-note').textContent = 'Preview mode. Copy the reply for now. The public inbox must be connected.';
      $('#reply-submit').disabled = true;
    } else {
      $('#reply-backend-note').textContent = 'Moderated before public display. Do not include private information.';
    }
    $('#reply-copy').addEventListener('click', async () => {
      const f = Object.fromEntries(new FormData($('#reply-form')));
      const target = communityItems.find(i => i.id === f.suggestion_id);
      const out = `BOUNDARY community reply to ${target?.title || 'a research suggestion'}
By ${f.author || 'Anonymous'}

${f.body || ''}`;
      try { await navigator.clipboard.writeText(out); toast('Reply copied'); }
      catch { window.prompt('Copy your reply:', out); }
    });
    $('#reply-form').addEventListener('submit', async e => {
      e.preventDefault();
      const form = e.currentTarget;
      if (!form.reportValidity()) return;
      const f = Object.fromEntries(new FormData(form));
      if (f.website) return;
      const target = communityItems.find(i => i.id === f.suggestion_id);
      if (!target) { $('#reply-status').textContent = 'This idea is unavailable. Refresh the public feed.'; return; }
      const button = $('#reply-submit'); button.disabled = true;
      const status = $('#reply-status'); status.classList.remove('error'); status.textContent = 'Submitting your reply for moderation…';
      try {
        await api('suggestion_replies', { method: 'POST', headers: { Prefer: 'return=minimal' }, body: JSON.stringify({ suggestion_id: target.id, author: f.author.trim() || 'Anonymous', body: f.body.trim(), status: 'pending' }) });
        status.textContent = 'Reply submitted for review. It will appear here only if approved.';
        form.reset(); toast('Reply sent for review');
      } catch (err) { status.classList.add('error'); status.textContent = `Could not send your reply. ${err.message} Use “Copy reply” to keep your text.`; }
      finally { button.disabled = false; }
    });
  }
  async function refreshPublicActivity({ silent = false } = {}) {
    if (refreshBusy) return;
    const button = $('#pulse-refresh'); refreshBusy = true; button.disabled = true;
    try {
      await Promise.all([loadUpdates(), loadCommunity(), loadSessions()]);
      if (!silent) {
        if (hasBackend) toast('Public feed checked');
        else toast('Showing the latest included editorial snapshot');
      }
    } finally { refreshBusy = false; button.disabled = false; }
  }
  function bindMisc() {
    const share = async () => {
      const link = cfg.projectUrl || window.location.href.split('#')[0];
      try { await navigator.clipboard.writeText(link); toast('Project link copied'); } catch { window.prompt('Copy this project link:', link); }
    };
    $('#share-button').addEventListener('click', share);
    $('#footer-share').addEventListener('click', share);
    $('#pulse-refresh').addEventListener('click', refreshPublicActivity);
    const menu = $('#mobile-menu'), side = $('.sidebar'), overlay = $('#mobile-overlay');
    const toggleMenu = open => { side.classList.toggle('mobile-open', open); overlay.hidden = !open; menu.setAttribute('aria-expanded', String(open)); menu.setAttribute('aria-label', open ? 'Close menu' : 'Open menu'); };
    menu.addEventListener('click', () => toggleMenu(!side.classList.contains('mobile-open')));
    overlay.addEventListener('click', () => toggleMenu(false));
    $$('.sidebar a').forEach(link => link.addEventListener('click', () => toggleMenu(false)));
    const spy = new IntersectionObserver(entries => {
      const visible = entries.filter(e => e.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (visible) $$('.nav-link[data-nav]').forEach(n => n.classList.toggle('active', n.dataset.nav === visible.target.id));
    }, { rootMargin: '-120px 0px -45% 0px', threshold: [0,.1,.4] });
    ['overview','activity','live-lab','research','journal','challenges','community'].forEach(id => { const el = document.getElementById(id); if (el) spy.observe(el); });
  }
  hydrateIcons();
  renderPulse();
  renderTracks();
  renderLogs();
  renderChallenges();
  renderGlossary();
  bindMode();
  bindModal();
  bindReplies();
  bindSessions();
  bindMisc();
  loadCommunity();
  loadUpdates();
  loadSessions();
  if (hasBackend) {
    // Poll only while visitors have the page open. This refreshes published material,
    // not research outcomes, and never changes moderation status.
    window.setInterval(() => { if (!document.hidden) refreshPublicActivity({ silent: true }); }, 120000);
    document.addEventListener('visibilitychange', () => { if (!document.hidden) refreshPublicActivity({ silent: true }); });
  }
})();