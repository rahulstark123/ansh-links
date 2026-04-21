-- CreateTable
CREATE TABLE "cards" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "workspaceId" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "bio" TEXT,
    "profileImageUrl" TEXT,
    "coverImageUrl" TEXT,
    "designId" TEXT NOT NULL DEFAULT 'default',
    "defaultThemeId" TEXT NOT NULL DEFAULT 'aurora',
    "status" TEXT NOT NULL DEFAULT 'Draft',
    "showProfilePhoto" BOOLEAN NOT NULL DEFAULT true,
    "showAvatarBadge" BOOLEAN NOT NULL DEFAULT true,
    "showBio" BOOLEAN NOT NULL DEFAULT true,
    "showSocialChips" BOOLEAN NOT NULL DEFAULT true,
    "aboutWhatIDo" TEXT,
    "aboutInterests" JSONB,
    "aboutEducation" TEXT,
    "aboutLocation" TEXT,
    "links" JSONB,
    "selectedProductIds" JSONB,
    "productVisibility" JSONB,
    "selectedSocialIds" JSONB,
    "socialVisibility" JSONB,
    "settings" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "cards_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "cards_userId_createdAt_idx" ON "cards"("userId", "createdAt");

-- CreateIndex
CREATE INDEX "cards_workspaceId_createdAt_idx" ON "cards"("workspaceId", "createdAt");

-- AddForeignKey
ALTER TABLE "cards" ADD CONSTRAINT "cards_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
