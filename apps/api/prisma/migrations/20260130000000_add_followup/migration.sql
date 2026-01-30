-- Add follow-up fields to user_states
ALTER TABLE "user_states" ADD COLUMN "last_offer_shown_at" TIMESTAMP;
ALTER TABLE "user_states" ADD COLUMN "followup_count" INTEGER DEFAULT 0;
ALTER TABLE "user_states" ADD COLUMN "last_followup_sent_at" TIMESTAMP;
