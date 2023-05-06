-- CreateTable
CREATE TABLE "User" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "username" TEXT NOT NULL DEFAULT 'admin',
    "password" TEXT NOT NULL DEFAULT 'admin'
);

-- CreateTable
CREATE TABLE "Patient" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "sex" BOOLEAN NOT NULL,
    "age" INTEGER NOT NULL,
    "occupation" TEXT,
    "details" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Tooth" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "number" INTEGER NOT NULL,
    "notes" TEXT,
    "patientId" INTEGER,
    CONSTRAINT "Tooth_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "Patient" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Checkups" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "notes" TEXT,
    "patientId" INTEGER,
    CONSTRAINT "Checkups_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "Patient" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Attachement" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "fileName" TEXT NOT NULL,
    "notes" TEXT,
    "patientId" INTEGER,
    CONSTRAINT "Attachement_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "Patient" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Course" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "effectName" TEXT NOT NULL,
    "colorIndex" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "CoursePatient" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "isFinished" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "details" TEXT,
    "patientId" INTEGER,
    "courseId" INTEGER,
    CONSTRAINT "CoursePatient_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "Patient" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "CoursePatient_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "CoursePatientTooth" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "coursePatientId" INTEGER,
    "toothId" INTEGER,
    CONSTRAINT "CoursePatientTooth_coursePatientId_fkey" FOREIGN KEY ("coursePatientId") REFERENCES "CoursePatient" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "CoursePatientTooth_toothId_fkey" FOREIGN KEY ("toothId") REFERENCES "Tooth" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Session" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "details" TEXT,
    "coursePatientId" INTEGER,
    CONSTRAINT "Session_coursePatientId_fkey" FOREIGN KEY ("coursePatientId") REFERENCES "CoursePatient" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "_CoursePatientToothToSession" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,
    CONSTRAINT "_CoursePatientToothToSession_A_fkey" FOREIGN KEY ("A") REFERENCES "CoursePatientTooth" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_CoursePatientToothToSession_B_fkey" FOREIGN KEY ("B") REFERENCES "Session" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "_CoursePatientToothToSession_AB_unique" ON "_CoursePatientToothToSession"("A", "B");

-- CreateIndex
CREATE INDEX "_CoursePatientToothToSession_B_index" ON "_CoursePatientToothToSession"("B");
