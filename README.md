# KuzaHealth Frontend

KuzaHealth is a React and TypeScript frontend for maternal and child healthcare workflows. It includes a public website, authentication screens, and separate workspaces for health workers, super administrators, and data analysts.

This repository contains the browser application only. Authentication, patient records, and other API-backed operations require a separately running compatible backend.

## Contents

- [Application areas](#application-areas)
- [Technology stack](#technology-stack)
- [Getting started](#getting-started)
- [Environment configuration](#environment-configuration)
- [Available commands](#available-commands)
- [Project structure](#project-structure)
- [Routing and authentication](#routing-and-authentication)
- [Translations](#translations)
- [Development workflow](#development-workflow)
- [Production build and deployment](#production-build-and-deployment)
- [Troubleshooting](#troubleshooting)
- [Documentation and license](#documentation-and-license)

## Application areas

| Area | Screens and workflows |
| --- | --- |
| Public website | Healthcare information, services, and contact content |
| Authentication | Sign-up, sign-in, OTP verification, and password recovery/reset |
| Health worker | Dashboard, analytics, maternal patient records, infant records, vaccination, nutrition, appointments, schedules, reports, and settings |
| Super administrator | Dashboard, health worker and parent management, data analyst creation, facilities, users, audit information, admin logs, reports, and settings |
| Data analyst | Dashboard, health workers, parents, schedules, facilities, reports, and settings |

These describe the screens wired into the router; individual workflows depend on their implementation and backend availability.

## Technology stack

| Purpose | Technologies |
| --- | --- |
| Application | React 18, TypeScript 5, Vite 5 |
| Navigation | React Router 6 with nested routes |
| API and server state | Axios, TanStack React Query 5 |
| Styling and UI | Tailwind CSS 3, Mantine, Material UI, Radix UI components |
| Forms and validation | React Hook Form, Zod, Mantine Form |
| Charts and maps | Recharts, ApexCharts, Chart.js, MUI X Charts, Leaflet / React Leaflet |
| Localization | i18next, react-i18next, browser language detection |
| Export utilities | jsPDF, Papa Parse, export-to-csv, file-saver |
| Code quality | ESLint 9 and TypeScript |

See [package.json](package.json) for dependency ranges and [package-lock.json](package-lock.json) for the locked dependency tree.

## Getting started

### Prerequisites

- Node.js compatible with the installed Vite 5 toolchain (`^18.0.0 || >=20.0.0`). Node 22 is a suitable baseline; this repository does not pin a Node version.
- npm, using the committed `package-lock.json`.
- A compatible KuzaHealth API URL and backend-provisioned accounts for authenticated workflows.

### Local setup

1. Clone this repository using its Git remote URL, then enter the checkout:

   ```bash
   cd kuzahealth_frontend
   ```

2. Install the locked dependencies:

   ```bash
   npm ci
   ```

3. Create or edit `.env.local` in the project root:

   ```dotenv
   VITE_API_BASE_URL_DEV=http://localhost:8080
   ```

   The address above is an example. Replace it with your backend's origin, including any required deployment prefix. Do not append `/api/v1` when the backend exposes the paths used by this application: request code already supplies that prefix.

4. Start Vite:

   ```bash
   npm run dev
   ```

5. Open the URL printed by Vite, normally `http://localhost:5173`. Vite may select another port if it is occupied.

The frontend can serve its public page without the API, but API-backed screens require the backend to be reachable and configured to accept requests from the frontend origin. No backend service or seeded demo account is supplied here.

## Environment configuration

| Variable | Used by | Purpose |
| --- | --- | --- |
| `VITE_API_BASE_URL_DEV` | `src/utils/axiosInstance.ts` and `src/pages/auth/SignIn.tsx` | Base URL for backend requests in both development and production |

Despite the `_DEV` suffix, this is the variable the current application reads for production builds too. Setting only `VITE_BASE_URL` or a differently named production variable will not configure these requests.

- Use `.env.local` for local overrides; `*.local` is ignored by Git.
- Restart the development server after changing environment variables.
- Vite embeds frontend environment values at build time. Set the API URL before building, and rebuild when it changes.
- `VITE_` values are visible in the browser bundle. They must not contain private keys or backend secrets.
- There is no API fallback URL or Vite development proxy configured. An unset base URL can cause requests to reach the frontend host instead of the API.

## Available commands

| Command | Behavior |
| --- | --- |
| `npm ci` | Install dependencies from the lockfile |
| `npm run dev` | Start the Vite development server |
| `npm run build` | Run `tsc -b`, then generate the production bundle in `dist/` |
| `npm run preview` | Serve an existing production build locally, normally on port `4173` |
| `npm run lint` | Run ESLint across the repository |
| `npm run docs` | Invoke TypeDoc with `typedoc.json`; currently incomplete because that configuration file is absent |

There is no `npm start` or automated test script configured. TypeScript checking and linting are the available code checks; they do not replace browser verification.

## Project structure

```text
kuzahealth_frontend/
├── public/
│   └── locales/                 # English, Kinyarwanda, and French translations
├── src/
│   ├── assets/                  # Imported images and video assets
│   ├── components/              # Shared, public-site, and role-specific UI
│   │   ├── HealthWorker/
│   │   ├── data-analyst/
│   │   ├── superadmin/
│   │   ├── layout/
│   │   └── ui/
│   ├── hooks/                   # Media-query and section-highlighting hooks
│   ├── layouts/                 # Role-specific navigation and page shells
│   ├── lib/                     # Shared utilities, including class-name helpers
│   ├── pages/
│   │   ├── auth/
│   │   ├── HealthWorker/
│   │   ├── data-analyst/
│   │   ├── superadmin/
│   │   └── Home.tsx
│   ├── routes/                  # Root router and role/auth route definitions
│   ├── utils/                   # Axios client, JWT decoding, and other helpers
│   ├── i18n.ts                  # Translation loading and language detection
│   ├── index.css                # Global styles and Tailwind directives
│   └── main.tsx                 # React root, QueryClientProvider, RouterProvider
├── index.html                   # Vite HTML entry
├── vite.config.ts               # React plugin and @ import alias
├── tailwind.config.js
├── eslint.config.js
├── tsconfig.json
├── netlify.toml                 # SPA fallback redirect
├── docker-compose.yml           # Incomplete container setup; see deployment notes
└── package.json
```

The application starts in `src/main.tsx`, which initializes localization and mounts the router inside React Query's provider. `src/App.tsx` is currently an empty component and is not the mounted application entry point.

The `@/` alias points to `src/` and is configured in both Vite and TypeScript.

## Routing and authentication

The root router lives in [src/routes/route.tsx](src/routes/route.tsx). Each role has its own nested route configuration and layout, with child pages rendered through React Router's `Outlet`.

| Entry route | Purpose |
| --- | --- |
| `/` | Public home page |
| `/auth/signin` | Sign-in |
| `/auth/signup` | Account registration |
| `/auth/otp-verification` | OTP verification |
| `/auth/forgot-password` | Request a password reset |
| `/auth/reset-password` | Set a new password |
| `/healthworker/dashboard` | Health worker dashboard |
| `/superadmin/dashboard` | Super administrator dashboard |
| `/data-analyst/dashboard` | Data analyst dashboard |

Use the explicit dashboard paths: the role roots currently have no index route. For the full route list, consult the files under `src/routes/`. Patient and infant detail routes include an `:id` parameter.

### API request flow

1. Sign-in requests an OTP through `/api/v1/auth/send-otp`.
2. OTP verification submits credentials to `/api/v1/auth/login?otp=...`.
3. A successful response stores the token as a JSON-encoded value under the `token` key in `localStorage` and uses the decoded role to choose a destination.
4. The shared Axios client reads that token and adds `Authorization: Bearer <token>` to outgoing requests.

Reuse [src/utils/axiosInstance.ts](src/utils/axiosInstance.ts) for API requests that need this configuration. React Query is available through the root provider for queries and mutations.

The route definitions do not currently wrap role areas in an authentication guard. Backend endpoints must enforce authentication and authorization; a role-specific URL or client-side redirect is not an access-control boundary.

## Translations

Localization is configured in [src/i18n.ts](src/i18n.ts). The configured languages are:

| Code | Language | Translation file |
| --- | --- | --- |
| `en` | English, also the fallback | `public/locales/en/translation.json` |
| `rw` | Kinyarwanda | `public/locales/rw/translation.json` |
| `fr` | French | `public/locales/fr/translation.json` |

Translations load over HTTP from `/locales/{{lng}}/{{ns}}.json`, and the browser language detector helps select the language. Keep corresponding keys aligned across all three files when adding translated content. Adding another language also requires updating `supportedLngs` in `src/i18n.ts` and any language-selection UI.

## Development workflow

1. Add page components under the relevant role directory in `src/pages/`.
2. Register new routes in the matching file under `src/routes/`, and update the relevant sidebar or navigation when needed.
3. Reuse the role's layout and existing shared components; match the UI conventions of the surrounding feature.
4. Use the shared API client and handle loading, empty, and failure states for API-backed screens.
5. Update translation keys for localized text.
6. Run the existing checks:

   ```bash
   npm run lint
   npm run build
   ```

7. Verify the affected workflow in the browser, including navigation, form validation, API failures, and narrow-screen layouts. For routing changes, also test a direct visit and refresh on the nested URL.

Include a description of the change, relevant screenshots for UI work, and check results in pull requests. Report existing failures separately from regressions introduced by the change.

## Production build and deployment

Set `VITE_API_BASE_URL_DEV` to the intended API URL in the build environment, then run:

```bash
npm ci
npm run build
npm run preview
```

Deploy the generated `dist/` directory to a static host. The preview command is for inspecting the build locally. Configure the host to serve existing assets normally and return `index.html` for application routes so that direct links and browser refreshes work with `createBrowserRouter`.

### Netlify

The repository includes a fallback rewrite in [netlify.toml](netlify.toml). Configure the site with:

| Setting | Value |
| --- | --- |
| Build command | `npm run build` |
| Publish directory | `dist` |
| Build environment variable | `VITE_API_BASE_URL_DEV` set to the deployed API URL |

The current routing and translation paths assume hosting at the domain root. Hosting under a subpath requires corresponding changes to the Vite base, router configuration, and asset/translation paths.

### Existing deployment configuration gaps

- **Docker:** `docker-compose.yml` references a build context, but no Dockerfile is included. It also uses `VITE_BASE_URL`, which differs from the variable consumed by the application. Add a Dockerfile and pass the correct variable during the frontend build before relying on this setup; runtime container variables alone do not rewrite an already built bundle.
- **GitHub Actions:** the workflow-like file is at `.github/main.yml`, outside the required `.github/workflows/` directory. It specifies Node 16 and uploads `build/`, while this project uses Vite 5 and outputs `dist/`. Correct its location, Node version, artifact path, action versions, and build environment before using it for CI.

## Troubleshooting

| Symptom | What to check |
| --- | --- |
| `npm start` fails | Use `npm run dev`; no start script exists. |
| API requests target the frontend host | Set `VITE_API_BASE_URL_DEV` and restart Vite or rebuild the deployment. |
| Requests fail with CORS or connection errors | Confirm the API is reachable and allows the actual frontend origin. No local proxy is configured. |
| Authentication returns `401` or `403` | Check account permissions, token validity, and backend responses; sign in again if the token has expired. |
| Token parsing fails before a request | The Axios interceptor expects JSON-encoded token storage. Clear a stale or manually edited `token` entry and sign in again. |
| A role root shows only its layout | Navigate to its explicit `/dashboard` child route. |
| Refreshing a nested URL returns `404` | Configure the static host's SPA fallback to `index.html`. |
| Translations fail to load | Confirm `/locales/<language>/translation.json` is served and contains valid JSON. |
| `npm run docs` fails | The referenced `typedoc.json` is missing; supply a configuration before using the command. |
| Container startup fails | The Compose setup needs the missing Dockerfile and corrected build-time API variable. |

## Documentation and license

[documentation.md](documentation.md) contains earlier architecture notes under the HealVirtue name. Some descriptions there, including testing tools and planned features, do not match the current repository. Use the source code and package scripts as the reference for implemented behavior.

No license file is included in this repository. Confirm licensing terms with the project owner before redistributing the code.
