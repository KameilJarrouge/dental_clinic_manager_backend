/*
  Warnings:

  - A unique constraint covering the columns `[coursePatientId,toothId]` on the table `CoursePatientTooth` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "CoursePatientTooth_coursePatientId_toothId_key" ON "CoursePatientTooth"("coursePatientId", "toothId");
