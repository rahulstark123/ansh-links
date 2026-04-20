-- CreateSequence
CREATE SEQUENCE "users_workspaceId_seq";

-- AlterTable users
ALTER TABLE "users" ADD COLUMN "workspaceId" INTEGER;
ALTER TABLE "users" ALTER COLUMN "workspaceId" SET DEFAULT nextval('"users_workspaceId_seq"');
UPDATE "users" SET "workspaceId" = nextval('"users_workspaceId_seq"') WHERE "workspaceId" IS NULL;
ALTER TABLE "users" ALTER COLUMN "workspaceId" SET NOT NULL;
SELECT setval('"users_workspaceId_seq"', COALESCE((SELECT MAX("workspaceId") FROM "users"), 1), true);

-- Add unique index
CREATE UNIQUE INDEX "users_workspaceId_key" ON "users"("workspaceId");

-- AlterTable products
ALTER TABLE "products" ADD COLUMN "workspaceId" INTEGER;
UPDATE "products" p
SET "workspaceId" = u."workspaceId"
FROM "users" u
WHERE p."userId" = u."id";
ALTER TABLE "products" ALTER COLUMN "workspaceId" SET NOT NULL;

-- Add index for workspace scoping
CREATE INDEX "products_workspaceId_createdAt_idx" ON "products"("workspaceId", "createdAt");
