import { Module } from '@nestjs/common';
import { AclService } from './acl.service';
import { PermissionsGuard } from './guards/acl.guard';

@Module({
  providers: [AclService, PermissionsGuard],
  exports: [AclService, PermissionsGuard],
})
export class AclModule {}
