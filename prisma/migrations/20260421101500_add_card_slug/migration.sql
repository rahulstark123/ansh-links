ALTER TABLE "cards"
ADD COLUMN "cardSlug" TEXT;

UPDATE "cards"
SET "cardSlug" = LOWER(REGEXP_REPLACE(COALESCE("title", 'card'), '[^a-zA-Z0-9]+', '-', 'g'));

UPDATE "cards"
SET "cardSlug" = TRIM(BOTH '-' FROM "cardSlug");

UPDATE "cards"
SET "cardSlug" = 'card-' || SUBSTRING("id" FROM 1 FOR 8)
WHERE "cardSlug" IS NULL OR "cardSlug" = '';

WITH ranked AS (
  SELECT "id", "workspaceId", "cardSlug", ROW_NUMBER() OVER (PARTITION BY "workspaceId", "cardSlug" ORDER BY "createdAt", "id") AS rn
  FROM "cards"
)
UPDATE "cards" c
SET "cardSlug" = CASE WHEN ranked.rn = 1 THEN ranked."cardSlug" ELSE ranked."cardSlug" || '-' || ranked.rn END
FROM ranked
WHERE c."id" = ranked."id";

ALTER TABLE "cards"
ALTER COLUMN "cardSlug" SET NOT NULL;

CREATE UNIQUE INDEX "cards_workspaceId_cardSlug_key" ON "cards"("workspaceId", "cardSlug");
