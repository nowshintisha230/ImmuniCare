-- CreateTable
CREATE TABLE "VaccinationRecord" (
    "id" TEXT NOT NULL,
    "childId" TEXT NOT NULL,
    "doseCode" TEXT NOT NULL,
    "givenAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "VaccinationRecord_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "VaccinationRecord_childId_idx" ON "VaccinationRecord"("childId");

-- CreateIndex
CREATE UNIQUE INDEX "VaccinationRecord_childId_doseCode_key" ON "VaccinationRecord"("childId", "doseCode");

-- AddForeignKey
ALTER TABLE "VaccinationRecord" ADD CONSTRAINT "VaccinationRecord_childId_fkey" FOREIGN KEY ("childId") REFERENCES "Child"("id") ON DELETE CASCADE ON UPDATE CASCADE;
