#!/usr/bin/env python3
"""Build RSS from BOUNDARY's public research session archive and published notes."""
import email.utils
import json
import os
import urllib.parse
import urllib.request
import xml.etree.ElementTree as ET
from datetime import datetime, timezone
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
URL = os.environ.get('BOUNDARY_SUPABASE_URL', '').rstrip('/')
KEY = os.environ.get('BOUNDARY_SUPABASE_PUBLISHABLE_KEY', '')
SITE = os.environ.get('BOUNDARY_PUBLIC_URL', '').rstrip('/')
if not SITE:
    owner_repo = os.environ.get('GITHUB_REPOSITORY', '')
    if '/' in owner_repo:
        owner, repo = owner_repo.split('/', 1)
        SITE = f'https://{owner}.github.io/{repo}'

if not all((URL, KEY, SITE)):
    print('Skipping RSS sync: public Supabase URL, public key, or site URL not configured.')
    raise SystemExit(0)
if not URL.startswith('https://') or not SITE.startswith('https://'):
    raise SystemExit('Both URLs must be HTTPS')
if KEY.startswith('sb_secret_') or 'service_role' in KEY.lower():
    raise SystemExit('Never use privileged Supabase credentials for public RSS sync.')

def fetch(table, query):
    endpoint = URL + '/rest/v1/' + table + '?' + urllib.parse.urlencode(query)
    headers = {'apikey': KEY}
    if not KEY.startswith('sb_publishable_'):
        headers['Authorization'] = 'Bearer ' + KEY
    req = urllib.request.Request(endpoint, headers=headers)
    with urllib.request.urlopen(req, timeout=20) as response:
        return json.load(response)

try:
    editor = fetch('research_updates', {'select':'id,date,title,plain,outcome','status':'eq.published','order':'date.desc','limit':'40'})
    raw = fetch('research_sessions', {'select':'run_key,created_at,title,summary,outcome','order':'created_at.desc','limit':'40'})
except Exception as exc:
    raise SystemExit(f'Could not refresh RSS; keeping existing version: {exc}') from exc

entries = []
for n in editor:
    if all(n.get(k) for k in ('id','date','title','plain')):
        entries.append({'id':'edit-'+n['id'], 'date':n['date'], 'title':n['title'],
                        'description':n['plain'] + '\n' + str(n.get('outcome','')),
                        'anchor':'journal'})
for s in raw:
    if all(s.get(k) for k in ('run_key','created_at','title')):
        entries.append({'id':s['run_key'], 'date':s['created_at'], 'title':s['title'],
                        'description':(s.get('summary') or 'Complete public AI research run.')+'\nUnverified research; open the session archive for the complete visible prompt and answer.',
                        'anchor':'live-lab'})
entries.sort(key=lambda n:n['date'], reverse=True)
entries = entries[:60]
if not entries:
    print('No new public content found. Keeping the original feed.')
    raise SystemExit(0)

rss=ET.Element('rss', {'version':'2.0'})
channel=ET.SubElement(rss,'channel')
for tag, value in (
    ('title','BOUNDARY | Public P vs NP research activity'),
    ('link',SITE),
    ('description','Complete public AI research runs and reviewed notes. P vs NP remains unsolved.'),
    ('language','en-us')):
    ET.SubElement(channel, tag).text=value

def date_for(text):
    parsed=datetime.fromisoformat(text[:19].replace('Z','+00:00'))
    return parsed.replace(tzinfo=timezone.utc) if parsed.tzinfo is None else parsed.astimezone(timezone.utc)

ET.SubElement(channel,'lastBuildDate').text=email.utils.format_datetime(date_for(entries[0]['date']))
for e in entries:
    it=ET.SubElement(channel,'item')
    for tag,value in (
        ('title',e['title']),
        ('link',SITE+'/#'+e['anchor']),
        ('guid','tag:boundary.public,2026:'+e['id']),
        ('description',e['description']+'\nNot an independently accepted P vs NP result.'),
        ('pubDate',email.utils.format_datetime(date_for(e['date'])))):
        node=ET.SubElement(it,tag)
        if tag=='guid':node.set('isPermaLink','false')
        node.text=value
ET.indent(rss,space='  ')
new='<?xml version="1.0" encoding="UTF-8"?>\n'+ET.tostring(rss,encoding='unicode')+'\n'
p=ROOT/'feed.xml'
if not p.exists() or p.read_text()!=new:
    p.write_text(new)
    print('RSS refreshed from',len(entries),'public entries')
else:
    print('RSS unchanged')