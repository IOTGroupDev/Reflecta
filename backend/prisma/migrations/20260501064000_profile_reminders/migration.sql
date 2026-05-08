ALTER TABLE "UserProfile"
  ADD COLUMN "dailyReminderEnabled" BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN "dailyReminderTime" TEXT;
