// src/acl/decorators/permission.decorator.ts
import { SetMetadata } from '@nestjs/common';

export const PERMISSION_KEY = 'permission';

export const Permission = (permission: string) => SetMetadata(PERMISSION_KEY, permission);
