-- CreateTable
CREATE TABLE "product_categories" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "workspaceId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "product_categories_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "product_categories_userId_createdAt_idx" ON "product_categories"("userId", "createdAt");
CREATE INDEX "product_categories_workspaceId_createdAt_idx" ON "product_categories"("workspaceId", "createdAt");
CREATE UNIQUE INDEX "product_categories_workspaceId_name_key" ON "product_categories"("workspaceId", "name");

-- Foreign key
ALTER TABLE "product_categories"
ADD CONSTRAINT "product_categories_userId_fkey"
FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Add categoryId to products (backfill safe)
ALTER TABLE "products" ADD COLUMN "categoryId" TEXT;

-- Create one default category per user/workspace
INSERT INTO "product_categories" ("id", "userId", "workspaceId", "name", "createdAt", "updatedAt")
SELECT
  gen_random_uuid()::text,
  u."id",
  u."workspaceId",
  'General',
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP
FROM "users" u;

-- Backfill existing products into General category by workspace
UPDATE "products" p
SET "categoryId" = pc."id"
FROM "product_categories" pc
WHERE p."workspaceId" = pc."workspaceId"
  AND pc."name" = 'General';

-- Make required + add relation
ALTER TABLE "products" ALTER COLUMN "categoryId" SET NOT NULL;
ALTER TABLE "products"
ADD CONSTRAINT "products_categoryId_fkey"
FOREIGN KEY ("categoryId") REFERENCES "product_categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

CREATE INDEX "products_categoryId_idx" ON "products"("categoryId");
