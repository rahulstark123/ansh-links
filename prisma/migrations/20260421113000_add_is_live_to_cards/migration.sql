ALTER TABLE "cards"
ADD COLUMN "isLive" BOOLEAN NOT NULL DEFAULT false;

UPDATE "cards"
SET "isLive" = true
WHERE "status" = 'Live';
