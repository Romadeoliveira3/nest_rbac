import { CanActivate, ExecutionContext, Injectable, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AclService } from '../acl.service';

@Injectable()
export class AclGuard implements CanActivate {
  constructor(private reflector: Reflector, private aclService: AclService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredPermission = this.reflector.get<string>(
      'permission',
      context.getHandler(),
    );
    if (!requiredPermission) return true;

    const request = context.switchToHttp().getRequest();
    const userId = request.user?.id;
    if (!userId) throw new ForbiddenException('Usuário não autenticado');

    const hasPermission = await this.aclService.hasPermission(userId, requiredPermission);
    if (!hasPermission) throw new ForbiddenException('Permissão negada');

    return true;
  }
}
