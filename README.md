# Nihar Majukar — Graphic Designer Portfolio

A responsive, motion-led portfolio built as a **zero-build static website** using vanilla HTML, CSS, and JavaScript. The project includes the portfolio homepage, About Me page, full work archive, image lightboxes, project modals, filtering, responsive layouts, cursor particles, optional interaction audio, and the supplied design assets.

## Technology

- HTML5
- CSS3 with responsive media queries and custom properties
- Vanilla JavaScript (ES6+)
- No framework, bundler, or package installation required
- Google Fonts are loaded remotely by the HTML pages when the site has internet access

## Run locally

### Option 1: Python (recommended)

From the project folder:

```powershell
py -m http.server 3000 --bind 127.0.0.1
```

Open [http://127.0.0.1:3000](http://127.0.0.1:3000) in a browser.

If `py` is unavailable, use:

```powershell
python -m http.server 3000 --bind 127.0.0.1
```

### Option 2: Node.js

If Node.js is installed, you can serve the folder without installing project dependencies:

```powershell
npx serve . -l 3000
```

Then open [http://localhost:3000](http://localhost:3000).

> Opening `index.html` directly may prevent some browser features from working correctly. Use a local HTTP server instead.

## Main pages

- `index.html` — Homepage, selected work, services, motion section, and contact
- `about.html` — About Me, creative process, gear, skills, and proficiency timeline
- `archive.html` — Full archive of the supplied image and PDF work

## Project structure

```text
/
├── index.html, about.html, archive.html  # Site pages
├── *.css                                 # Shared and page-specific styles
├── *.js                                  # Interactions and archive data
├── media/                                # Website-ready images, PDFs, and video
├── banner/, brand work/, ...             # Original supplied work folders
├── manus-routes.json                     # Managed preview route manifest
└── README.md                             # This guide
```

## Updating the portfolio

1. Add optimized images, PDFs, or videos to `media/`.
2. Update the relevant project markup in `index.html` or the asset manifest in `archive-data.js`.
3. Keep image `alt` text descriptive and use web-friendly filenames where possible.
4. Run the local server again and check the homepage, About page, archive, mobile layout, light mode, and interactive controls.

## Contact details

The contact form and social links are configured in the HTML/JavaScript source. Update them directly in the relevant page if your contact details change.
