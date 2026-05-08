# Reflecta

Reflecta is an Expo + NestJS MVP for a calm emotional self-help app: quick
check-ins, structured scenarios, AI-assisted analysis, private chat and an
emotion journal.

## Structure

- `frontend` - Expo React Native app
- `frontend/src/app` - root app composition, routing and overlays
- `frontend/src/components` - shared UI components
- `frontend/src/components/flow` - shared scenario flow shell
- `frontend/src/components/ui` - reusable UI primitives with local `StyleSheet.create`
- `frontend/src/components/journal` - journal-specific cards
- `frontend/src/components/insights` - insight-specific cards
- `frontend/src/screens` - app screens and scenario/practice flow screens
- `frontend/src/data.ts` - scenarios, fallback answers and practice definitions
- `frontend/src/plans.ts` - daily plan and weekly reflection logic
- `frontend/src/hooks` - auth, journal, chat and scenario flow state
- `frontend/src/api` - frontend API client and DTO mapping
- `frontend/src/theme/styles.ts` - app shell container styles
- `frontend/src/lib/supabase.ts` - frontend Supabase/API env client
- `backend` - NestJS API
- `backend/prisma` - Prisma schema
- `docker-compose.yml` - local Redis and optional local Postgres fallback

## Setup

```bash
npm install
cp .env.example .env
docker compose up -d redis
npm run prisma:generate
npm run prisma:migrate
```

Supabase is the primary database and auth provider. Put the hosted project values
into `backend/.env` and `frontend/.env`:

- `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`
- `DIRECT_URL` for Prisma migrations/runtime database access
- `DATABASE_URL` for the pooled Supabase connection when it is configured
- `EXPO_PUBLIC_SUPABASE_URL`, `EXPO_PUBLIC_SUPABASE_ANON_KEY`
- `EXPO_PUBLIC_YANDEX_OAUTH_PROVIDER` for a Supabase custom OAuth/OIDC provider
  identifier, for example `custom:yandex`

`User.id` in the app database mirrors the Supabase Auth UUID. Journal and chat
endpoints require `Authorization: Bearer <Supabase access token>`; the backend no
longer trusts `userId` from the request body.

Auth is passwordless and uses one entry point. The app first restores the
Supabase session from native `AsyncStorage`/web storage; if there is no session,
the user enters an email once or chooses OAuth. Existing users sign in, new users
are created by Supabase Auth and then see the short onboarding only if `/me`
does not already have an onboarding goal. Configure Supabase Auth for email
OTP/magic-link delivery, not password login. The app accepts both the default
email magic link and a numeric OTP code if the Supabase email template exposes
the OTP token. Add both the Expo web URL and the native deep link
`reflecta://auth/callback` to the Supabase Auth redirect allow list. Google and
Apple use built-in Supabase OAuth providers. Yandex should be configured as a
custom OAuth/OIDC provider and referenced by `EXPO_PUBLIC_YANDEX_OAUTH_PROVIDER`.

AI is optional in local development. If no configured provider key is present,
the API uses local deterministic responses. Set `AI_PROVIDER=openai` with
`OPENAI_API_KEY`, or `AI_PROVIDER=deepseek` with `DEEPSEEK_API_KEY`. DeepSeek
uses the OpenAI-compatible Chat Completions API with JSON output; the default
model is `deepseek-v4-flash`.

## Development

```bash
npm run backend:dev
npm run frontend:start
```

Current local ports:

- backend: `http://localhost:3001`
- Expo web: `http://localhost:8087`

The API exposes:

- `GET /health`
- `POST /ai/analyze` - Supabase Auth required, Redis rate limited
- `POST /chat/message` - Supabase Auth required, Redis rate limited
- `GET /chat/history` - Supabase Auth required
- `GET /journal/sessions` - Supabase Auth required
- `GET /journal/summary` - Supabase Auth required
- `POST /journal/sessions` - Supabase Auth required
- `POST /journal/moods` - Supabase Auth required
- `GET /me` - Supabase Auth required
- `GET /me/export` - exports profile, journal, mood and chat data for the current user
- `PATCH /me/preferences` - Supabase Auth required
- `DELETE /me/data` - deletes journal, mood and chat data while keeping the account
- `DELETE /me` - deletes app profile/content and Supabase Auth user

Current MVP screens:

- Onboarding: first-run goal selection and safety boundary before auth
- Today: "Я рядом", daily practice, check-in and quick scenarios
- Auth: one Supabase passwordless entry point, persisted session restore, Google,
  Apple ID, Yandex OAuth and account sheet
- Account/privacy: profile preferences, daily rhythm reminder preference, data
  counts, selectable local daily notifications, data export, content cleanup
  and account/data deletion
- Chat: a soft confidential conversation entry point persisted per user, with crisis
  safety routing before AI replies
- Scenario flow: details, intensity, optional note and structured result
- Practices: guided anxiety, sleep and burnout exercises with journal saving
- Journal: saved emotional sessions with starter actions and practice/analysis labels
- Insights: weekly reflection, simple retention signals and a recommended next practice

## Current Roadmap State

- `0.3` - Supabase Postgres/Auth integration, UUID user identity, protected journal/chat.
- `0.4` - auth UX polish, session loading state, account sheet, Today retention rhythm,
  improved Journal empty state and next-practice CTA in Insights.
- `0.5` - guided practices for anxiety, sleep and burnout, with completion saved
  into the protected journal flow.
- `0.6` - safety layer: crisis keyword detection in backend chat, local safety
  response, Home/Chat urgent-help entry points and a quick help sheet.
- `0.7` - personalized daily plan from mood/journal summary, weekly reflection in
  Insights, and practice vs analysis labels in Journal.
- `0.8` - passwordless auth: email OTP/code login and registration, OAuth buttons
  for Google, Apple ID and Yandex custom provider.
- `0.9` - mobile-safe onboarding before auth: goal selection, safety boundary,
  AsyncStorage persistence and hidden app navigation until sign-in.
- `0.10` - user profile/preferences and privacy baseline: server-side onboarding
  goal, data counts, cascade deletion and user-facing account/data deletion.
- `0.11` - protected AI analysis, Redis rate limiting for expensive AI/chat
  endpoints and user data export from the account sheet.
- `0.12` - device/navigation polish: full-screen auth/onboarding, readable iOS
  status bar, back navigation on secondary screens and content-only deletion.
- `0.13` - retention preference baseline: daily rhythm block on Home and
  server-side daily reminder preference in the account sheet.
- `0.14` - native retention loop: local daily reminder scheduling with
  `expo-notifications`, Android notification channel, permission handling and
  non-sensitive reminder copy.
- `0.15` - rhythm iteration: stronger Today rhythm panel, next-step CTA,
  total-touch/focus metrics and selectable reminder time from the account sheet.
