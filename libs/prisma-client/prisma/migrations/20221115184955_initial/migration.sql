-- CreateEnum
CREATE TYPE "EventRole" AS ENUM ('USER', 'ADMIN');

-- CreateEnum
CREATE TYPE "GroupRole" AS ENUM ('USER', 'ADMIN');

-- CreateEnum
CREATE TYPE "EventVisibilityStatus" AS ENUM ('PRIVATE', 'PUBLIC');

-- CreateEnum
CREATE TYPE "EventLocationStatus" AS ENUM ('STATIONARY', 'ONLINE');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "hashPassword" TEXT NOT NULL,
    "image" TEXT,
    "joinedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserFavouriteCategories" (
    "userId" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,

    CONSTRAINT "UserFavouriteCategories_pkey" PRIMARY KEY ("userId","categoryId")
);

-- CreateTable
CREATE TABLE "Event" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "street" TEXT,
    "city" TEXT,
    "normalizedCityId" TEXT,
    "country" TEXT,
    "postCode" TEXT,
    "startDate" TIMESTAMP(3),
    "latitude" DECIMAL(65,30),
    "longitude" DECIMAL(65,30),
    "bannerImage" TEXT,
    "eventVisibilityStatus" "EventVisibilityStatus" NOT NULL,
    "eventLocationStatus" "EventLocationStatus" NOT NULL,
    "categoryId" TEXT NOT NULL,

    CONSTRAINT "Event_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Group" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,

    CONSTRAINT "Group_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UsersInGroup" (
    "groupId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "role" "GroupRole" NOT NULL DEFAULT 'USER',
    "joinedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UsersInGroup_pkey" PRIMARY KEY ("groupId","userId")
);

-- CreateTable
CREATE TABLE "EventParticipant" (
    "role" "EventRole" NOT NULL DEFAULT 'USER',
    "userId" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,

    CONSTRAINT "EventParticipant_pkey" PRIMARY KEY ("userId","eventId")
);

-- CreateTable
CREATE TABLE "NormalizedCity" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "NormalizedCity_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Category" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EventInvitaion" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,
    "isUserAccepted" BOOLEAN NOT NULL,
    "isAdminAccepted" BOOLEAN NOT NULL,

    CONSTRAINT "EventInvitaion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EventTag" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "EventTag_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_EventToEventTag" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "NormalizedCity_name_key" ON "NormalizedCity"("name");

-- CreateIndex
CREATE UNIQUE INDEX "EventInvitaion_userId_eventId_key" ON "EventInvitaion"("userId", "eventId");

-- CreateIndex
CREATE UNIQUE INDEX "EventTag_name_key" ON "EventTag"("name");

-- CreateIndex
CREATE UNIQUE INDEX "_EventToEventTag_AB_unique" ON "_EventToEventTag"("A", "B");

-- CreateIndex
CREATE INDEX "_EventToEventTag_B_index" ON "_EventToEventTag"("B");

-- AddForeignKey
ALTER TABLE "UserFavouriteCategories" ADD CONSTRAINT "UserFavouriteCategories_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserFavouriteCategories" ADD CONSTRAINT "UserFavouriteCategories_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_normalizedCityId_fkey" FOREIGN KEY ("normalizedCityId") REFERENCES "NormalizedCity"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Group" ADD CONSTRAINT "Group_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UsersInGroup" ADD CONSTRAINT "UsersInGroup_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UsersInGroup" ADD CONSTRAINT "UsersInGroup_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "Group"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EventParticipant" ADD CONSTRAINT "EventParticipant_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EventParticipant" ADD CONSTRAINT "EventParticipant_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EventInvitaion" ADD CONSTRAINT "EventInvitaion_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EventInvitaion" ADD CONSTRAINT "EventInvitaion_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_EventToEventTag" ADD CONSTRAINT "_EventToEventTag_A_fkey" FOREIGN KEY ("A") REFERENCES "Event"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_EventToEventTag" ADD CONSTRAINT "_EventToEventTag_B_fkey" FOREIGN KEY ("B") REFERENCES "EventTag"("id") ON DELETE CASCADE ON UPDATE CASCADE;
