/*
  Warnings:

  - The values [EMPLOYEE] on the enum `Role` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `registeredByEmployeeId` on the `trucks` table. All the data in the column will be lost.
  - You are about to drop the `employees` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "Role_new" AS ENUM ('USER', 'DRIVER', 'AGENT', 'ADMIN');
ALTER TABLE "public"."users" ALTER COLUMN "role" DROP DEFAULT;
ALTER TABLE "users" ALTER COLUMN "role" TYPE "Role_new" USING ("role"::text::"Role_new");
ALTER TYPE "Role" RENAME TO "Role_old";
ALTER TYPE "Role_new" RENAME TO "Role";
DROP TYPE "public"."Role_old";
ALTER TABLE "users" ALTER COLUMN "role" SET DEFAULT 'USER';
COMMIT;

-- DropForeignKey
ALTER TABLE "employees" DROP CONSTRAINT "employees_userId_fkey";

-- DropForeignKey
ALTER TABLE "trucks" DROP CONSTRAINT "trucks_registeredByEmployeeId_fkey";

-- DropIndex
DROP INDEX "trucks_registeredByEmployeeId_idx";

-- AlterTable
ALTER TABLE "trucks" DROP COLUMN "registeredByEmployeeId",
ADD COLUMN     "registeredByAgentId" TEXT;

-- DropTable
DROP TABLE "employees";

-- CreateTable
CREATE TABLE "agents" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "agentId" TEXT,
    "nidNumber" TEXT,
    "dateOfBirth" TIMESTAMP(3),
    "department" TEXT,
    "designation" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "agents_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "agents_userId_key" ON "agents"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "agents_agentId_key" ON "agents"("agentId");

-- CreateIndex
CREATE INDEX "trucks_registeredByAgentId_idx" ON "trucks"("registeredByAgentId");

-- AddForeignKey
ALTER TABLE "agents" ADD CONSTRAINT "agents_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "trucks" ADD CONSTRAINT "trucks_registeredByAgentId_fkey" FOREIGN KEY ("registeredByAgentId") REFERENCES "agents"("id") ON DELETE SET NULL ON UPDATE CASCADE;
