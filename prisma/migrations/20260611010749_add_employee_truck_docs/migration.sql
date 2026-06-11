-- AlterTable
ALTER TABLE "trucks" ADD COLUMN     "blueBookUrl" TEXT,
ADD COLUMN     "numberPlateImageUrl" TEXT,
ADD COLUMN     "numberPlateText" TEXT,
ADD COLUMN     "registeredByEmployeeId" TEXT,
ADD COLUMN     "roadPermitUrl" TEXT,
ADD COLUMN     "taxTokenUrl" TEXT;

-- CreateIndex
CREATE INDEX "trucks_registeredByEmployeeId_idx" ON "trucks"("registeredByEmployeeId");

-- AddForeignKey
ALTER TABLE "trucks" ADD CONSTRAINT "trucks_registeredByEmployeeId_fkey" FOREIGN KEY ("registeredByEmployeeId") REFERENCES "employees"("id") ON DELETE SET NULL ON UPDATE CASCADE;
