# Puzzles

Puzzles, mini-games, and analyzers.

Live site: [https://puzzles.eleventheye.com/](https://puzzles.eleventheye.com/)

This app used to be a Create React App project. It now runs on **Vite 8**, **React 19**, **Redux Toolkit 2**, **React Router 6**, **Firebase 12**, **TypeScript 5.9**, and **Vitest**.

## Stack

| Area              | Package                                           |
| ----------------- | ------------------------------------------------- |
| App               | React 19, React DOM 19                            |
| State             | Redux Toolkit 2, react-redux 9                    |
| Routing           | react-router-dom 6                                |
| UI                | Bootstrap 5.3, react-bootstrap 2.10, react-select |
| Backend / hosting | Firebase JS SDK 12, Firebase Hosting              |
| Tooling           | Vite 8, TypeScript 5.9, ESLint 9, Sass            |
| Tests             | Vitest 4, Testing Library, jsdom                  |

Upgrade notes and remaining work live in [docs/milestones/Project-Revival-Milestone.md](docs/milestones/Project-Revival-Milestone.md).

## Prerequisites

- Node.js 22 LTS is the safest target. Node 26 works for Vite, but `firebase-tools` still prefers 20 / 22 / 24.
- npm 10+
- A local Firebase web-app config (see below)

## First-time setup

```bash
npm install
```

Copy the example Firebase config and fill in your project values:

```bash
cp src/config/FirebaseConfig.example.ts src/config/FirebaseConfig.ts
```

`src/config/FirebaseConfig.ts` must export `firebaseConfig` and is gitignored. Do not commit it.

## Scripts

| Command                      | What it does                                                             |
| ---------------------------- | ------------------------------------------------------------------------ |
| `npm start` or `npm run dev` | Vite dev server (default [http://localhost:5173](http://localhost:5173)) |
| `npm test`                   | Vitest in watch mode                                                     |
| `npm run test:run`           | Vitest once (CI / pre-deploy)                                            |
| `npm run typescript:check`   | `tsc --noEmit`                                                           |
| `npm run lint`               | ESLint flat config                                                       |
| `npm run build`              | Typecheck, then production build to `dist/`                              |
| `npm run preview`            | Serve the production `dist/` locally                                     |

There is no `eject`. Vite config is in [vite.config.ts](vite.config.ts).

## App routes

- `/` — puzzle picker
- `/wordle/solver` — Wordle solver
- `/wordle/versus` — Wordle versus

## Path aliases

TypeScript and Vite both resolve these from `src/`:

- `app/*`
- `features/*`
- `components/*`
- `config/*`
- `helpers/*`

Example: `import { useAppSelector } from 'app/hooks/hooks'`.

## Firebase hosting

Hosting serves **`dist/`**, not `public/`.

Vite copies everything in [public](public) into `dist/` during `npm run build` (`favicon.ico`, `images/`, logos, `manifest.json`, `robots.txt`). [firebase.json](firebase.json) already points Hosting at `dist/` and rewrites unknown paths to `/index.html` for the SPA.

Deploy:

```bash
npm run build
npx firebase deploy --only hosting
```

Preview the production bundle first with `npm run preview` if you want a local check.

## Project layout

```
index.html          Vite HTML entry (loads /src/index.tsx)
vite.config.ts      Vite + Vitest + SCSS load paths
eslint.config.mjs   ESLint 9 flat config
firebase.json       Hosting public = dist
public/             Static assets copied into dist/
src/
  app/              Redux store and shared hooks
  components/       Header, keyboard, cards, loaders
  config/           FirebaseConfig (local) + example
  features/         Puzzle picker, Wordle solver / versus
  firebase/         Firebase app + analytics init
  scss/             Shared mixins and Bootstrap import
```

## Notes

- Analytics is initialized only in the browser so Vitest does not call `getAnalytics` in Node.
- Sass still emits `@import` deprecation warnings (Bootstrap). They do not fail the build.
- Do not commit `src/config/FirebaseConfig.ts`.
