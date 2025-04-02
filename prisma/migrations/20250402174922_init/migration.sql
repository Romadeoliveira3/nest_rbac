/*
  Warnings:

  - A unique constraint covering the columns `[roleId,permissionId]` on the table `RolePermission` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "roleId_permissionId" ON "RolePermission"("roleId", "permissionId");
