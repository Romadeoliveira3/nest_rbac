import { Module } from '@nestjs/common';
import { AclService } from './acl.service';
import { RolesGuard } from './guards/roles.guard';

@Module({
  providers: [AclService, RolesGuard],
  exports: [AclService, RolesGuard],
})
export class AclModule {}
