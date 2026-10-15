"""Assemble landing-page sections into a static, directly servable index.html."""
from pathlib import Path
import re
ROOT = Path(__file__).resolve().parents[1]
TEMPLATE = ROOT / 'templates' / 'landing.html'

def section(match):
    path = ROOT / 'sections' / match.group(1) / 'index.html'
    return path.read_text(encoding='utf-8').strip()

source = TEMPLATE.read_text(encoding='utf-8')
result = re.sub(r'\{\{section:([a-z-]+)\}\}', section, source)
if '{{section:' in result:
    raise ValueError('Unresolved section placeholder')
(ROOT / 'index.html').write_text(result, encoding='utf-8')
print('Built index.html from sections/')
