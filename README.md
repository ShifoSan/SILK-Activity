> AI context file: read this first at the start of any conversation about this repository.
*Humans: the “Project essence” and “Build / Run / Test” sections are written to stand alone; the rest is depth you can skim.*

## 1) Project essence
This repository is a small web activity with a cinematic, single-page frontend and one server-side search endpoint. The frontend renders a welcome screen, then a menu, then an “Asset Valuation Registry” page that queries a vector-search backend (`index.html`, `pages/welcome.js:WelcomePage`, `pages/menu.js:MenuPage`, `pages/values.js:ValuesPage`). The backend route generates embeddings with Gemini, runs MongoDB Atlas vector search, and returns item metadata (`api/search.js:handler`). Binary media (audio/video/images/font) provides most of the UX presentation and is directly loaded by the frontend (`assets/`, `fonts/`). Current maturity appears prototype/early integration: no scripts/tests/CI are defined in-repo, and Discord client ID is a placeholder (`package.json`, `index.html`).

## 2) Quick facts
| Item | Value |
|---|---|
| Primary languages | JavaScript (ES modules), HTML, inline CSS (`package.json`, `index.html`, `pages/*.js`, `api/search.js`) |
| Frameworks/platforms | Vanilla browser SPA + serverless-style API route layout (`index.html`, `api/search.js`) |
| Key external APIs/libs | MongoDB Node driver `^6.5.0` (`package.json`), Gemini embeddings HTTP API (`api/search.js`), Discord Embedded App SDK script include (`index.html`) |
| Package manager | npm (implied by `package.json`) |
| Runtime assumptions | Browser for UI; Node runtime with `fetch` and env vars for `/api/search` (`index.html`, `api/search.js`) |
| License | not determined from code (no license file present) |
| Status | Prototype/feature slice (no scripts/tests/lint/deploy manifests found) (`package.json`, repository tree) |
| Code vs assets (approx) | Asset-heavy: 10 binary files (`assets/` 9 + `fonts/` 1) vs 6 primary text code/config files (`index.html`, `package.json`, `api/search.js`, `pages/*.js`) |

## 3) Repository map
```text
.
├── api/
│   └── search.js [entry]  # POST API for Gemini embedding + MongoDB vector search
├── assets/                # 9 binary UI/media assets (5 webp, 2 mp4, 2 ogg)
├── fonts/
│   └── ViaodaLibre-Regular.ttf  # local font loaded by index.html
├── pages/
│   ├── welcome.js [entry via index boot]  # welcome scene, rain animation, transition to menu
│   ├── menu.js                         # menu scene, transitions to values scene
│   └── values.js                       # search UI, calls /api/search, displays result card
├── index.html [entry]      # SPA shell, global audio/preloader systems, boot logic
├── package.json            # dependency manifest (mongodb only)
└── README.md               # this file
```

## 4) Binary assets (opaque manifest)
These assets were mapped by path/reference only and were **not read/decoded**.

| Directory | Types / count | Naming convention | Git LFS? | Code references | Used by code? |
|---|---|---|---|---|---|
| `assets/` | 9 files: `5x .webp`, `2x .mp4`, `2x .ogg` | descriptive scene/role names (`welcome_bg.webp`, `menu_bg_video.mp4`, `bg-music.ogg`, etc.) | No LFS tracking found (`.gitattributes` absent; `git lfs ls-files` empty) | `index.html` (`./assets/bg-music.ogg`, `click-sfx.ogg`, `value.webp`, `compare.webp`, `trade.webp`, `menu_bg_video.mp4`), `pages/welcome.js:WelcomePage.render` (`welcome_bg.webp`, `server_icon.webp`), `pages/menu.js:MenuPage.render` (`menu_bg_video.mp4`, `value.webp`, `trade.webp`, `compare.webp`), `pages/values.js:ValuesPage.render` (`vtc_bg.mp4`) | Yes |
| `fonts/` | 1 file: `1x .ttf` | font family file name | No LFS tracking found | `index.html` `@font-face src: ./fonts/ViaodaLibre-Regular.ttf` | Yes |

## 5) Architecture & data flow
- UI boot:
  - `index.html` loads Discord SDK script, defines global systems `window.silkAudio` and `window.silkPreloader`, initializes both, and renders `WelcomePage` (`index.html`).
- Scene flow:
  - `WelcomePage` click starts music fade-in and transitions to `MenuPage` (`pages/welcome.js:WelcomePage.init`).
  - `MenuPage` currently wires values card to `ValuesPage`; compare/trading log placeholders only (`pages/menu.js:MenuPage.init`).
- Search flow:
  - `ValuesPage` captures query, POSTs `/api/search`, then updates image/title/description UI (`pages/values.js:ValuesPage.init`).
  - `api/search` validates POST + query, gets Gemini embedding, runs MongoDB `$vectorSearch`, returns top document fields (`api/search.js:handler`).
- Asset flow:
  - Images/video/audio are loaded directly from `./assets/*` in render markup and preload/audio systems (`index.html`, `pages/*.js`).
  - Remote result images can be rewritten to `/cloudinary` when inside Discord hosts (`pages/values.js:ValuesPage.init`).

## 6) Domain model / key abstractions
| Symbol | Role |
|---|---|
| `window.silkAudio` (`index.html`) | Global audio manager: background loop, click SFX, filter-node graph, fade-in behavior. |
| `window.silkPreloader` (`index.html`) | Background preload of menu images/video into browser memory. |
| `WelcomePage` (`pages/welcome.js:WelcomePage`) | Intro scene renderer + canvas rain animation + transition trigger. |
| `MenuPage` (`pages/menu.js:MenuPage`) | Main navigation scene renderer + card click routing. |
| `ValuesPage` (`pages/values.js:ValuesPage`) | Search panel renderer + async `/api/search` client + result display lifecycle. |
| `connectToDatabase` (`api/search.js:connectToDatabase`) | Lazy singleton Mongo client cache for API invocations. |
| `handler` (`api/search.js:handler`) | API controller for vector-query request/response lifecycle. |

## 7) Build / Run / Test / Lint / Deploy
No build/run/test/lint/deploy scripts or workflow commands are defined in repository manifests/CI files (`package.json`, `.github/` tree).

```text
not determined from code: no npm scripts, Makefile targets, or CI workflow commands exist in this repository
```

Prerequisites inferred from imports/usage:
- Node runtime for API route and dependency install (`package.json`, `api/search.js`).
- Browser runtime for frontend (`index.html`, `pages/*.js`).

## 8) Configuration & environment variables
| Variable | Purpose | Required? | Default | Read location |
|---|---|---|---|---|
| `MONGO_URI` | MongoDB connection URI for vector-search backend | Yes for `/api/search` | none | `api/search.js` (`process.env.MONGO_URI`) |
| `GEMINI_API_KEY` | API key for Gemini embedding request | Yes for `/api/search` | none | `api/search.js` (`process.env.GEMINI_API_KEY`) |

Non-env runtime constant:
- Discord SDK client ID placeholder is hardcoded as `"YOUR_DISCORD_CLIENT_ID"` (`index.html`).

## 9) Conventions & recipes
- File/module pattern:
  - Each UI scene module exports a page object with `render()` + `init()` (`pages/welcome.js`, `pages/menu.js`, `pages/values.js`).
  - Scene transitions are DOM replacement into `#app-viewport` (`index.html`, `pages/*.js`).
- Asset referencing:
  - Use relative `./assets/<name>` paths directly in template markup or JS object initializers.
- API convention:
  - Frontend calls same-origin `/api/search` with POST JSON `{ query }` (`pages/values.js`).
  - API returns `{ item_name, image_link, content }` (`api/search.js`).

Recipes:
- Add a new scene/page:
  - Create `pages/<new>.js` exporting `{ render, init }`.
  - Import and wire transition from an existing scene (typically `pages/menu.js`).
- Add a new backend endpoint:
  - Create `api/<route>.js` with default exported handler `(req, res)`.
  - Call it from frontend via `fetch('/api/<route>')`.
- Add a new local asset:
  - Place binary file in `assets/` with descriptive lowercase underscore naming.
  - Reference it with relative `./assets/<file>` from `index.html` or `pages/*.js`.

## 10) Invariants & gotchas
- Audio graph init is deferred until user click path to satisfy autoplay behavior; removing this interaction gate may break playback (`index.html`, `pages/welcome.js`).
- `api/search` enforces POST-only; GET returns 405 (`api/search.js:handler`).
- Vector search assumes:
  - embedding model endpoint `gemini-embedding-2`,
  - output dimensionality `3072`,
  - Atlas index name `vector_index`,
  - collection path `silk_bot.aotr_knowledge` (`api/search.js`).
- Result image proxy rewrite logic assumes Cloudinary source URLs when in Discord host contexts (`pages/values.js`).
- `compare` and `trading` menu cards are placeholders (logs only), so feature expectations should treat them as unimplemented (`pages/menu.js`).

## 11) Task-oriented reading guide
- UI boot or startup issues: start at `index.html`, then `pages/welcome.js`.
- Scene navigation changes: start at `pages/menu.js`, then target page module.
- Search UX behavior: start at `pages/values.js`.
- Vector backend/data issues: start at `api/search.js`.
- Asset path/loading bugs: inspect `index.html` + `pages/*.js` references and filenames under `assets/` / `fonts/`.
- Discord embed behavior: inspect SDK initialization in `index.html` and host-based proxying in `pages/values.js`.

## 12) Glossary
- **S.I.L.K. Trading Center**: Product UI title shown in document title/welcome text (`index.html`, `pages/welcome.js`).
- **Values page / Asset Valuation Registry**: Scene providing neural query input and result display (`pages/values.js`).
- **Vector search**: Backend retrieval strategy using Gemini embeddings + MongoDB `$vectorSearch` (`api/search.js`).
- **Scene/page layer**: Full-screen DOM section swapped in/out via `#app-viewport` (`index.html`, `pages/*.js`).

## 13) References
- In-repo:
  - `index.html`
  - `pages/welcome.js`
  - `pages/menu.js`
  - `pages/values.js`
  - `api/search.js`
  - `package.json`
- External architecture-defining dependencies:
  - Discord Embedded App SDK script URL in `index.html`
  - Gemini embeddings REST endpoint in `api/search.js`
  - MongoDB Node.js driver dependency in `package.json`