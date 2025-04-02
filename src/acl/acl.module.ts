import { Module } from '@nestjs/common';
import { AclService } from './acl.service';
import { AclGuard } from './guards/acl.guard';

@Module({
  providers: [AclService, AclGuard],
  exports: [AclService, AclGuard],
})
export class AclModule {}
