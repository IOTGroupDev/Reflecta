-- Remove orphaned personal records before making ownership required.
DELETE FROM "Session" WHERE "userId" IS NULL;
DELETE FROM "MoodEntry" WHERE "userId" IS NULL;
DELETE FROM "ChatMessage" WHERE "userId" IS NULL;

-- Create profile table for user preferences. Keep it separate from emotional content.
CREATE TABLE "UserProfile" (
  "id" UUID NOT NULL,
  "userId" UUID NOT NULL,
  "onboardingGoal" TEXT,
  "timezone" TEXT,
  "privacyAcceptedAt" TIMESTAMP(3),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "UserProfile_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "UserProfile_userId_key" ON "UserProfile"("userId");

ALTER TABLE "UserProfile"
  ADD CONSTRAINT "UserProfile_userId_fkey"
  FOREIGN KEY ("userId") REFERENCES "User"("id")
  ON DELETE CASCADE ON UPDATE CASCADE;

-- Personal content must be deleted when a user is deleted.
ALTER TABLE "Session" DROP CONSTRAINT IF EXISTS "Session_userId_fkey";
ALTER TABLE "MoodEntry" DROP CONSTRAINT IF EXISTS "MoodEntry_userId_fkey";
ALTER TABLE "ChatMessage" DROP CONSTRAINT IF EXISTS "ChatMessage_userId_fkey";

ALTER TABLE "Session" ALTER COLUMN "userId" SET NOT NULL;
ALTER TABLE "MoodEntry" ALTER COLUMN "userId" SET NOT NULL;
ALTER TABLE "ChatMessage" ALTER COLUMN "userId" SET NOT NULL;

ALTER TABLE "Session"
  ADD CONSTRAINT "Session_userId_fkey"
  FOREIGN KEY ("userId") REFERENCES "User"("id")
  ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "MoodEntry"
  ADD CONSTRAINT "MoodEntry_userId_fkey"
  FOREIGN KEY ("userId") REFERENCES "User"("id")
  ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "ChatMessage"
  ADD CONSTRAINT "ChatMessage_userId_fkey"
  FOREIGN KEY ("userId") REFERENCES "User"("id")
  ON DELETE CASCADE ON UPDATE CASCADE;
