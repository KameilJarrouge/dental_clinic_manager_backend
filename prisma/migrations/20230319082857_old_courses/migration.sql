-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_CoursePatient" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "isFinished" BOOLEAN NOT NULL DEFAULT false,
    "isOld" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "details" TEXT,
    "patientId" INTEGER,
    "courseId" INTEGER,
    CONSTRAINT "CoursePatient_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "Patient" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "CoursePatient_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_CoursePatient" ("courseId", "createdAt", "details", "id", "isFinished", "patientId") SELECT "courseId", "createdAt", "details", "id", "isFinished", "patientId" FROM "CoursePatient";
DROP TABLE "CoursePatient";
ALTER TABLE "new_CoursePatient" RENAME TO "CoursePatient";
CREATE TABLE "new_Attachement" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "fileName" TEXT NOT NULL,
    "notes" TEXT,
    "patientId" INTEGER,
    CONSTRAINT "Attachement_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "Patient" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Attachement" ("fileName", "id", "notes", "patientId") SELECT "fileName", "id", "notes", "patientId" FROM "Attachement";
DROP TABLE "Attachement";
ALTER TABLE "new_Attachement" RENAME TO "Attachement";
CREATE TABLE "new_Checkups" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "notes" TEXT,
    "patientId" INTEGER,
    CONSTRAINT "Checkups_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "Patient" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Checkups" ("createdAt", "id", "notes", "patientId") SELECT "createdAt", "id", "notes", "patientId" FROM "Checkups";
DROP TABLE "Checkups";
ALTER TABLE "new_Checkups" RENAME TO "Checkups";
CREATE TABLE "new_Tooth" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "number" INTEGER NOT NULL,
    "notes" TEXT,
    "patientId" INTEGER,
    CONSTRAINT "Tooth_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "Patient" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Tooth" ("id", "notes", "number", "patientId") SELECT "id", "notes", "number", "patientId" FROM "Tooth";
DROP TABLE "Tooth";
ALTER TABLE "new_Tooth" RENAME TO "Tooth";
CREATE TABLE "new_CoursePatientTooth" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "coursePatientId" INTEGER,
    "toothId" INTEGER,
    CONSTRAINT "CoursePatientTooth_coursePatientId_fkey" FOREIGN KEY ("coursePatientId") REFERENCES "CoursePatient" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "CoursePatientTooth_toothId_fkey" FOREIGN KEY ("toothId") REFERENCES "Tooth" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_CoursePatientTooth" ("coursePatientId", "id", "toothId") SELECT "coursePatientId", "id", "toothId" FROM "CoursePatientTooth";
DROP TABLE "CoursePatientTooth";
ALTER TABLE "new_CoursePatientTooth" RENAME TO "CoursePatientTooth";
CREATE TABLE "new_Session" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "details" TEXT,
    "coursePatientId" INTEGER,
    CONSTRAINT "Session_coursePatientId_fkey" FOREIGN KEY ("coursePatientId") REFERENCES "CoursePatient" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Session" ("coursePatientId", "createdAt", "details", "id") SELECT "coursePatientId", "createdAt", "details", "id" FROM "Session";
DROP TABLE "Session";
ALTER TABLE "new_Session" RENAME TO "Session";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
