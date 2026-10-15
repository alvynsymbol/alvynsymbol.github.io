# Alvyn Symbol local website

Start from the website root (the parent of this docs folder):

```sh
python3 -m http.server 4173 --bind 127.0.0.1
```

Open http://127.0.0.1:4173. No build or package installation is required.

## Included

Eight HTML pages, responsive styles, animated collage and green glow, accessible flip cards, a two-click illustrative workflow, and the supplied Google Drive Free macOS download. Premium and Business are marked as planned. The research library awaits verified citations. The journal contains an introductory project perspective, not a claim of published research.

## Configure later

`assets/config.js` contains public configuration only:

- `contactEmail`: enables an email-app handoff. Until configured the form only prepares a local message and explicitly does not send it.
- `licenseEndpoint`: a trusted HTTPS API. Leave blank until the real app's license generator is available and the privacy notice has been updated.

License API contract: accept POST JSON `{name,email,code}`; validate the entitlement server-side and return the app-compatible `.lis` bytes with Content-Type `application/octet-stream` or `application/vnd.alvyn.license`. Return a non-2xx response on failure, including 429 for rate limits. Allow only the intended website origins with CORS. Never put signing keys, private repository access, or activation-code verification in the public site. Add rate limiting and replay/entitlement rules to the backend according to the app's requirements. This website does not implement or invent the proprietary license format.

The page uses Google Fonts with system font fallbacks. Its other assets are local. No hosting changes have been made. Confirm legal/operator details, publication references, and paid edition terms before a public commercial launch.

## Folder layout

- `index.html`: generated static landing page, without runtime fetching.
- `sections/<section>/index.html`: editable landing section source, including header and footer.
- `pages/<page>/index.html`: standalone pages, each in its own folder.
- `assets/medias/`: place images, videos, audio, and other media here.
- `assets/style.css`, `assets/app.js`, `assets/config.js`: shared styling, interactions, and public configuration.
- `templates/landing.html`: page shell and ordered section placeholders.
- `scripts/build.py`: assembles the landing page.
- `404.html`, `robots.txt`, `sitemap.xml`: root website files. The standard crawler filename is robots.txt (plural).

After editing a section, run from the site root:

```sh
python3 scripts/build.py
```

Refresh the browser afterward. Standalone page edits need only a refresh. Section links use paths relative to the site root because they are assembled into index.html. Standalone pages use ../../ to reach shared assets and the homepage. Media paths are assets/medias/filename in sections and ../../assets/medias/filename in standalone pages.

The sitemap and robots.txt use the intended public origin https://alvynsymbol.github.io. Update both before deployment if the site will live under /alvynsymbol/ or another domain. Nothing has been published. Python's basic HTTP server serves /404.html directly but uses its own error response for unknown paths; GitHub Pages uses the custom 404.html when deployed.
