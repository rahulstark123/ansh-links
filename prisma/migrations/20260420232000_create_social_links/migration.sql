-- CreateTable
CREATE TABLE "social_links" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "workspaceId" INTEGER NOT NULL,
    "platform" TEXT NOT NULL,
    "customPlatform" TEXT,
    "url" TEXT NOT NULL,
    "useInCardBuilder" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "social_links_pkey" PRIMARY KEY ("id")
);

-- Indexes
CREATE INDEX "social_links_userId_createdAt_idx" ON "social_links"("userId", "createdAt");
CREATE INDEX "social_links_workspaceId_createdAt_idx" ON "social_links"("workspaceId", "createdAt");

-- Foreign key
ALTER TABLE "social_links"
ADD CONSTRAINT "social_links_userId_fkey"
FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
