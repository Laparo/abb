-- CreateTable
CREATE TABLE "User" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "Course" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "capacity" INTEGER,
    "priceCents" INTEGER,
    "startAt" DATETIME,
    "endAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Booking" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" INTEGER NOT NULL,
    "courseId" INTEGER NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'BOOKED',
    "bookedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "cancelledAt" DATETIME,
    CONSTRAINT "Booking_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Booking_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Material" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "courseId" INTEGER NOT NULL,
    "type" TEXT NOT NULL DEFAULT 'TEXT',
    "title" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    CONSTRAINT "Material_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "Booking_userId_idx" ON "Booking"("userId");

-- CreateIndex
CREATE INDEX "Booking_courseId_idx" ON "Booking"("courseId");

-- CreateIndex
CREATE INDEX "Material_courseId_idx" ON "Material"("courseId");
