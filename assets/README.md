# Alvyn Symbol website

## Run locally

From the website root:

```sh
python3 -m http.server 4173 --bind 127.0.0.1
```

Open http://127.0.0.1:4173.

## Edit and build

Edit landing content in `sections/`, then run from the root:

```sh
python3 assets/build.py
```

`assets/landing.html` defines the section order. The build writes `index.html` and refreshes shared header/footer markup in every standalone page. Standalone page content is edited directly in `pages/`. The About workflow is a separate copy; keep it consistent with landing workflow changes.

## Structure

- Root: index.html, 404.html, robots.txt, sitemap.xml, .nojekyll.
- sections/: hero, feature-tiles, how-it-works, editions, contact, header-footer.
- pages/: about, blog, publications. The blog article is inside blog/.
- assets/: shared CSS/JavaScript, build.py, landing.html, this README, fonts/, medias/.

Media files are referenced as `assets/medias/filename` from landing sections and `../../assets/medias/filename` from pages. The locally hosted Hemi Head font is used by the hero; DM Sans and Manrope are loaded through Google Fonts with system fallbacks.

## Contact and licensing

Contact buttons open WhatsApp at +989126633870; the form adds the visitor's details to a prefilled message for review and sending inside WhatsApp.

`assets/config.js` contains the public licenseEndpoint setting. Leave it empty until the actual license service exists. Never store signing keys or private repository credentials in this public site. The API accepts POST JSON {name,email,code} and returns app-compatible .lis bytes with Content-Type application/octet-stream or application/vnd.alvyn.license. It must validate entitlements, control allowed origins, and rate-limit attempts. Update the privacy notice before enabling activation.

The workflow uses synthetic observations and reveals their known generating formula; it does not execute the Alvyn engine. Reset cancels pending animations.

The sitemap uses https://alvynsymbol.github.io/. Changes remain local until uploaded. GitHub Pages uses 404.html for missing pages; Python's basic local server serves that file directly but uses its own default error page for unknown URLs.
