#!/usr/bin/env python3
"""Generate ONLY safe public settings during GitHub Pages deployment."""
import json
import os
from pathlib import Path

owner_repo = os.environ.get('GITHUB_REPOSITORY', '')
owner, repo = owner_repo.split('/', 1) if '/' in owner_repo else ('', '')
url = os.environ.get('BOUNDARY_PUBLIC_URL', '').strip()
if not url and owner and repo:
    url = f'https://{owner}.github.io/{repo}/'
settings = {
    'supabaseUrl': os.environ.get('BOUNDARY_SUPABASE_URL', '').strip(),
    'supabaseAnonKey': os.environ.get('BOUNDARY_SUPABASE_PUBLISHABLE_KEY', '').strip(),
    'projectUrl': url,
    'contactEmail': ''
}
# Only publishable keys belong in client JS.
if settings['supabaseAnonKey'].startswith('sb_secret_'):
    raise SystemExit('Refusing to publish a Supabase secret key to public site.')
Path('config.js').write_text('window.BOUNDARY_CONFIG = ' + json.dumps(settings, ensure_ascii=False) + ';\n', encoding='utf8')
print('Public config generated. Backend ' + ('enabled' if settings['supabaseUrl'] and settings['supabaseAnonKey'] else 'in preview mode') + '.')