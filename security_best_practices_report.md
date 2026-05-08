# Reflecta Security And Personal Data Review

Date: 2026-04-30

## Executive Summary

Reflecta stores sensitive self-reflection data: mood check-ins, journal sessions,
chat messages, onboarding preferences and Supabase Auth identity. This review
focused on secure ownership boundaries, data minimization, deletion, and frontend
storage for the current Expo + NestJS + Supabase MVP.

Implemented in this pass:

- Added authenticated `/me` profile/preferences endpoints.
- Added user-facing account/data deletion.
- Added user-facing profile/journal/mood/chat export.
- Added user-facing content-only deletion without deleting the account.
- Added reminder preferences as profile metadata, separate from emotional content.
- Added local daily reminder scheduling with non-sensitive notification text.
- Changed personal content relations from `onDelete: SetNull` to `onDelete: Cascade`.
- Made personal content ownership required instead of nullable.
- Persisted onboarding preferences server-side after auth.
- Kept local onboarding storage limited to non-secret preference data.
- Protected AI analysis with Supabase Auth and bounded incoming payloads.
- Added Redis-backed rate limiting to expensive AI/chat endpoints.

## Data Inventory

- Supabase Auth: email, provider identity, auth UUID.
- `User`: app mirror of Supabase Auth UUID and optional email/name.
- `UserProfile`: onboarding goal, timezone, privacy acceptance timestamp.
- `Session`: scenario, detail labels, optional user note, AI/local result.
- `MoodEntry`: mood label, numeric rating, optional note.
- `ChatMessage`: user and assistant chat content, source marker.
- AsyncStorage: onboarding completion flag and onboarding goal only.

## Fixed Findings

### F-1: Personal records could remain orphaned after user deletion

Severity: High

Impact: Journal, mood, and chat rows could remain in the database with no owning
user after account deletion.

Evidence:

- Previous schema used nullable `userId` with `onDelete: SetNull`.
- Current schema requires `userId` and cascades deletes:
  - `Session.userId`: `backend/prisma/schema.prisma:32`
  - `MoodEntry.userId`: `backend/prisma/schema.prisma:44`
  - `ChatMessage.userId`: `backend/prisma/schema.prisma:54`

Fix:

- Migration `backend/prisma/migrations/20260430202000_user_profile_privacy/migration.sql`
  deletes orphan rows, makes ownership required, and adds cascade constraints.

### F-2: No user-facing deletion path

Severity: High

Impact: A user had no in-app way to remove profile, journal, mood, and chat data.

Evidence:

- Added `DELETE /me`: `backend/src/me/me.controller.ts:23`
- App data deletion plus Supabase Auth deletion: `backend/src/me/me.service.ts:60`
- Frontend delete control: `frontend/src/components/AccountSheet.tsx:45`
- Destructive confirmation: `frontend/src/app/ReflectaApp.tsx:61`

Fix:

- Added authenticated deletion flow guarded by Supabase bearer auth.
- Account sheet now includes "Удалить аккаунт и данные".

### F-3: Onboarding preferences were local-only

Severity: Medium

Impact: Preferences could not follow the user across iOS/Android devices and
were not visible in account/data controls.

Evidence:

- Server profile stores onboarding goal and privacy timestamp:
  `backend/prisma/schema.prisma:21`
- Frontend sync after auth: `frontend/src/app/ReflectaApp.tsx:42`
- Account data summary: `frontend/src/components/AccountSheet.tsx:32`

Fix:

- Added `UserProfile` and `PATCH /me/preferences`.

### F-4: AI analysis endpoint accepted unauthenticated sensitive text

Severity: Medium

Impact: `POST /ai/analyze` could receive personal text without a verified user
session and could be abused as a public endpoint.

Evidence:

- Backend guard on the AI controller: `backend/src/ai/ai.controller.ts:8`
- Frontend calls analysis through bearer-token `apiFetch`:
  `frontend/src/api/reflectaApi.ts:30`
- Frontend blocks analysis without an auth session:
  `frontend/src/hooks/useReflectaFlow.ts:95`
- Backend validates scenario/level and bounds details/text length:
  `backend/src/ai/ai.service.ts:53`

Fix:

- Added Supabase Auth guard to `/ai/analyze`.
- Attached the authenticated user id server-side.
- Added MVP payload validation and length limits before local/OpenAI analysis.

### F-5: Expensive AI endpoints had no per-user abuse control

Severity: Medium

Impact: A valid account could repeatedly call AI-backed endpoints and increase
OpenAI cost or degrade service.

Evidence:

- Redis-backed rate-limit guard: `backend/src/rate-limit/rate-limit.guard.ts:1`
- AI analysis limit: `backend/src/ai/ai.controller.ts:16`
- Chat message limit: `backend/src/chat/chat.controller.ts:21`

Fix:

- Added decorator-based rate limits using Redis counters and expiring windows.
- Applied 20/hour to `/ai/analyze` and 30/hour to `/chat/message`.

### F-6: Users could delete data but not export it

Severity: Low

Impact: Users had a deletion path, but no way to retrieve their own journal,
mood, profile and chat records.

Evidence:

- Backend export endpoint: `backend/src/me/me.controller.ts:14`
- Export query: `backend/src/me/me.service.ts:40`
- Account-sheet export action: `frontend/src/components/AccountSheet.tsx:42`

Fix:

- Added authenticated `GET /me/export`.
- Added account-sheet data export through the platform share sheet.

### F-7: Data deletion was account-only

Severity: Low

Impact: Users could delete the whole account, but could not clear journal,
check-in and chat data while keeping access to their account.

Evidence:

- Backend content deletion endpoint: `backend/src/me/me.controller.ts:28`
- Content deletion transaction: `backend/src/me/me.service.ts:88`
- Account-sheet cleanup action: `frontend/src/components/AccountSheet.tsx:45`

Fix:

- Added authenticated `DELETE /me/data`.
- Added account-sheet action to clear sessions, moods and chat history while
  preserving Supabase Auth and profile preferences.

### F-8: Reminder preference needed server-side ownership

Severity: Low

Impact: Daily rhythm/reminder settings should follow the account across devices
without storing sensitive content locally.

Evidence:

- Profile reminder fields: `backend/prisma/schema.prisma:24`
- Preference validation: `backend/src/me/me.service.ts:127`
- Account-sheet reminder control: `frontend/src/components/AccountSheet.tsx:43`

Fix:

- Added `dailyReminderEnabled` and `dailyReminderTime` to `UserProfile`.
- Added validation for `HH:mm` reminder time.
- Added user-facing reminder time presets without storing emotional content.
- Kept reminder settings as non-content profile metadata.

### F-9: Reminder notifications could expose sensitive context

Severity: Low

Impact: Push/local notifications are visible on lock screens, so emotional state,
journal text, crisis content, or therapy-like analysis should not be included in
notification bodies.

Evidence:

- Local reminder hook: `frontend/src/hooks/useDailyReminder.ts:1`
- Account-sheet reminder control: `frontend/src/components/AccountSheet.tsx:43`

Fix:

- Added native local daily reminders through `expo-notifications`.
- Notification body uses generic check-in copy and does not include mood,
  scenario, journal text, chat content, or AI analysis.
- Reminder scheduling is disabled on web and guarded by platform permissions.

## Remaining Risks

### R-1: Automatic retention policy is not yet explicit

Severity: Medium

The app can delete all account data or clear journal/chat/check-in data on
request, but it does not yet define automatic retention or archival rules for old
chat/journal data. Before production, decide whether old chat messages should
expire automatically or remain fully user-controlled.

### R-2: Rate limiting policy is still MVP-level

Severity: Medium

`POST /ai/analyze` and `POST /chat/message` now have Redis-backed per-window
limits. Before production, tune the limits by subscription tier, add alerting,
and consider separate IP-based throttles for auth failures.

### R-3: Export format is JSON-only

Severity: Low

Users can export their own data, but the MVP export is a JSON payload shared by
the platform sheet. Before launch, consider a clearer downloadable file flow and
human-readable archive format.

### R-4: No audit/admin separation model

Severity: Low

The MVP has no admin UI, which is good for attack surface, but also no formal
operator access model. Before any support/admin tooling, define strict access
rules and avoid reading emotional content unless explicitly user-authorized.

## Notes

This is an engineering review, not legal advice. For launch, privacy policy,
terms, regional legal requirements, age gates, and clinical/medical disclaimers
should be reviewed separately.
