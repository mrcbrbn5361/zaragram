import base64
import json
from pathlib import Path

root = Path('/home/ubuntu/zaragram')
include = [
    root / 'client', root / 'server', root / 'api', root / 'patches', root / 'package.json',
    root / 'pnpm-lock.yaml', root / 'tsconfig.json', root / 'tsconfig.node.json',
    root / 'vite.config.ts', root / 'vercel.json', root / 'design.md', root / 'dist' / 'index.js',
]
files = []
paths = []
for item in include:
    if item.is_dir():
        paths.extend(p for p in item.rglob('*') if p.is_file())
    elif item.is_file():
        paths.append(item)
for path in sorted(set(paths)):
    rel = path.relative_to(root).as_posix()
    if rel.endswith('.env') or rel.startswith('dist/') or 'node_modules' in path.parts:
        continue
    data = path.read_bytes()
    try:
        text = data.decode('utf-8')
        files.append({'file': rel, 'data': text, 'encoding': 'utf-8'})
    except UnicodeDecodeError:
        files.append({'file': rel, 'data': base64.b64encode(data).decode('ascii'), 'encoding': 'base64'})
payload = {
    'name': 'zaragram',
    'target': 'production',
    'files': files,
    'projectSettings': {
        'framework': 'vite',
        'buildCommand': 'pnpm build',
        'outputDirectory': 'dist/public',
    },
}
Path('/home/ubuntu/zaragram/.vercel-deploy.json').write_text(json.dumps(payload, ensure_ascii=False), encoding='utf-8')
print(f'prepared {len(files)} files')
