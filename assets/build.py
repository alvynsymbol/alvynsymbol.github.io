"""Assemble landing-page sections into a static, directly servable index.html."""
from pathlib import Path
import re
ROOT = Path(__file__).resolve().parents[1]
TEMPLATE = ROOT / 'assets' / 'landing.html'

def section(match):
    name = match.group(1)
    path = ROOT / 'sections' / 'header-footer' / (name + '.html') if name in ('header', 'footer') else ROOT / 'sections' / name / 'index.html'
    return path.read_text(encoding='utf-8').strip()

source = TEMPLATE.read_text(encoding='utf-8')
result = re.sub(r'\{\{section:([a-z-]+)\}\}', section, source)
if '{{section:' in result:
    raise ValueError('Unresolved section placeholder')
(ROOT / 'index.html').write_text(result, encoding='utf-8')
print('Built index.html from sections/')

for page in (ROOT / 'pages').glob('*/*.html'):
    content = page.read_text(encoding='utf-8')
    for name in ('header', 'footer'):
        fragment = (ROOT / 'sections' / 'header-footer' / (name + '.html')).read_text().strip()
        fragment = re.sub(r'((?:href|src)=")((?!https?:|#)[^"]+)', lambda m: m[1] + '../../' + m[2], fragment)
        content = re.sub(r'<' + name + r'>.*?</' + name + r'>', lambda m: fragment, content, flags=re.S)
    page.write_text(content, encoding='utf-8')
