# Reflecta

Reflecta is an Expo + NestJS MVP for a calm emotional self-help app: quick
check-ins, structured scenarios, AI-assisted analysis, private chat and an
emotion journal.

## Structure

- `frontend` - Expo React Native app
- `frontend/src/components` - shared UI components
- `frontend/src/components/flow` - shared scenario flow shell
- `frontend/src/components/ui` - reusable UI primitives with local `StyleSheet.create`
- `frontend/src/components/journal` - journal-specific cards
- `frontend/src/components/insights` - insight-specific cards
- `frontend/src/screens` - app screens and scenario/practice flow screens
- `frontend/src/data.ts` - scenarios, fallback answers and practice definitions
- `frontend/src/plans.ts` - daily plan and weekly reflection logic
- `frontend/src/theme/styles.ts` - shared React Native styles
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

Auth is passwordless. Configure Supabase Auth for email OTP/code delivery, not
password login. The email template must expose the OTP token, and the Expo web URL
must be in Supabase Auth redirect allow list. Google and Apple use built-in
Supabase OAuth providers. Yandex should be configured as a custom OAuth/OIDC
provider and referenced by `EXPO_PUBLIC_YANDEX_OAUTH_PROVIDER`.

OpenAI is optional in local development. If `OPENAI_API_KEY` is empty, the API uses
local deterministic scenario responses. Set `OPENAI_API_KEY` and optionally
`OPENAI_MODEL` to enable live structured AI responses.

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
- `POST /ai/analyze` - public MVP analysis endpoint
- `POST /chat/message` - Supabase Auth required
- `GET /chat/history` - Supabase Auth required
- `GET /journal/sessions` - Supabase Auth required
- `GET /journal/summary` - Supabase Auth required
- `POST /journal/sessions` - Supabase Auth required
- `POST /journal/moods` - Supabase Auth required

Current MVP screens:

- Today: "Я рядом", daily practice, check-in and quick scenarios
- Auth: Supabase passwordless email code, Google, Apple ID, Yandex OAuth, session
  restore and account sheet
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
