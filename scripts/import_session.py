#!/usr/bin/env python3
"""Import a user-visible research transcript from ANY model, after intentionally exporting it.

Usage: python3 scripts/import_session.py path/to/session.json
Required JSON fields: source, model, title, prompt, response.
GitHub Action workflow_dispatch can also run this after adding a safe JSON file.
"""
import datetime as dt
import json
import os
import sys
import uuid
from research_cycle import db_post


def import_record(content):
    for key in ('source', 'model', 'title', 'prompt', 'response'):
        if not isinstance(content.get(key), str) or not content[key].strip():
            raise ValueError('Missing nonempty string field: ' + key)
    return {
        'run_key': 'import-' + uuid.uuid4().hex,
        'source': content['source'][:80], 'model': content['model'][:120],
        'title': content['title'][:180], 'prompt': content['prompt'], 'response': content['response'],
        'summary': (content.get('summary') or 'Manually imported public research transcript, not independently verified.')[:700],
        'outcome': 'unverified', 'verification': 'unverified',
        'metadata': {'original_timestamp': content.get('original_timestamp'),
                     'imported_at': dt.datetime.now(dt.timezone.utc).isoformat(),
                     'imported_from_public_visible_transcript': True}
    }


def main():
    if len(sys.argv) != 2:
        print('Usage: python scripts/import_session.py session.json', file=sys.stderr); return 2
    with open(sys.argv[1], encoding='utf8') as f:
        record = import_record(json.load(f))
    base = os.environ.get('BOUNDARY_SUPABASE_URL', '')
    secret = (os.environ.get('BOUNDARY_SUPABASE_SECRET_KEY') or
              os.environ.get('BOUNDARY_SUPABASE_SERVICE_ROLE_KEY') or '')
    if not (base.startswith('https://') and secret):
        print('Supabase URL and secret are required.', file=sys.stderr); return 2
    db_post(base, secret, 'research_sessions', record)
    print('Imported external session with visible transcript:', record['run_key'])
    return 0


if __name__ == '__main__':
    raise SystemExit(main())