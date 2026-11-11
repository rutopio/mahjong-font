# Repository structure

These conventions apply to Rutopio UI and the five sites that use it. Create
folders when they have a purpose; do not add empty folders to match a template.

## Source code

| Path | Purpose |
| --- | --- |
| `src/components/` | React components, grouped by feature or role |
| `src/components/ui/` | Local interface primitives |
| `src/components/layout/` | Headers, footers, page shells, and not-found adapters |
| `src/components/navigation/` | Navigation, menus, and page actions |
| `src/components/pages/` | Page composition used by route modules |
| `src/hooks/` | Reusable React hooks, with `use-` filenames |
| `src/lib/` | Utilities, domain logic, stores, parsing, and rendering helpers |
| `src/providers/` | Components that supply application context |
| `src/contexts/` | Shared React context and its closely related state API |
| `src/types/` | Ambient declarations and types shared between modules |
| `src/data/` | Data imported into the application bundle |
| `src/locales/` | Translation dictionaries |
| `src/content/` | Markdown and MDX content |
| `src/styles/` | Runtime CSS; `globals.css` is the entry and `fonts.css` handles fonts |
| `src/routes/` | TanStack Router route modules; preserve its filename conventions |

Components can have feature folders such as `article`, `home`, `calculator`,
`mahjong`, `create`, or `showcase`. Private helpers and context accessors may
stay beside their owner. Extract reusable hooks and utilities when they serve
several components. Keep types with their implementation unless other modules
need them; `types/` is not a required destination for every interface.

## Assets, tooling, and documentation

| Path | Purpose |
| --- | --- |
| `public/` | Files served directly by the site |
| `public/fonts/` | Web fonts and their licenses |
| `public/images/` | Site and article images |
| `public/data/` | Data fetched by URL rather than imported into the bundle |
| `assets/` | Design originals, font sources, archives, and build inputs |
| `scripts/` | Executable maintenance, generation, and validation commands |
| `build/` | Node-only helpers imported by the site's Vite build configuration |
| `functions/` | Cloudflare Pages request handlers and their TypeScript configuration |
| `tests/` | Regression tests; shared test utilities go in `tests/helpers/` |
| `docs/` | Guides and design or review records |

Keep Vite's `index.html`, package/config files, `README.md`, licenses, and active
`TODO.md` files at the repository root. Browser convention files such as
`favicon.ico`, `robots.txt`, manifests, `_headers`, and `_redirects` belong at
the root of `public/`. Generated build output belongs in `dist/`.

Not every public asset needs a generic folder: EmojiSalon keeps Twemoji SVGs
in `public/twemoji/`, matching the dataset's identity and lookup contract.
Downloaded source repositories and font caches remain ignored. Raw design
files and font-editing sources do not belong in `public/` merely because the
Git repository is public.

## Naming

Use lowercase kebab-case for ordinary files and folders. Use plural collection
names such as `components`, `hooks`, `styles`, `types`, `locales`, and `constants`.
Components use PascalCase exports, hooks use `useX`, and utilities use verbs
that describe their result or action. Prefer a specific filename to a growing
`utils.ts`; the small `cn` adapter remains `lib/utils.ts` because the component
registry configuration refers to it.

Keep framework-owned names such as `__root.tsx`, `$slug`, `routeTree.gen.ts`,
`_middleware.ts`, and `[tile].ts`. Preserve supplied asset names where they
identify a font, license, or upstream artwork.

## Library and content exceptions

UI has no site root or public asset directory. Its components use the same
roles, with motion and feedback subfolders where useful. `src/entries/` combines
modules for public package entry points; `src/index.ts` is the main runtime
entry. Build transforms live in `src/lib/build/` and are exported separately.
`playground/` is an independent development app. Its HTML entry and config stay
inside that app. UI commits `dist/` because Git-tag consumers install built files.

Portfolio keeps its LaTeX resume project in `resume/`. Retained article drafts
live in `docs/drafts/`, archived images in `assets/archive/`, and diagram sources
in `assets/diagrams/`. Mahjong's font product sources and downloadable formats
live in `assets/fonts/`; the website consumes the generated tile data instead.

## Moving files

Use `git mv`, then update imports, CSS URLs, script input/output paths, package
exports, tests, and documentation. Regenerate and compare affected data. Asset
moves use the new URL directly: do not add old-path copies or redirects.

Run the affected repository's checks, tests, and production build before
committing. When UI moves, also build its playground and verify the five sites
against the locally built package.
