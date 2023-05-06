-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Attachement" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "fileName" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "notes" TEXT,
    "patientId" INTEGER,
    CONSTRAINT "Attachement_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "Patient" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Attachement" ("fileName", "id", "notes", "patientId") SELECT "fileName", "id", "notes", "patientId" FROM "Attachement";
DROP TABLE "Attachement";
ALTER TABLE "new_Attachement" RENAME TO "Attachement";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
