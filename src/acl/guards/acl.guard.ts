import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PrismaService } from '../../../prisma/prisma.service';
import { PERMISSION_KEY } from '../decorators/permission.decorator';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(private reflector: Reflector, private prisma: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredPermission = this.reflector.getAllAndOverride<string>(
      PERMISSION_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredPermission) return true;

    const request = context.switchToHttp().getRequest();
    const user = request?.user;

    console.log('User from request:', user); // Debug log

    if (!user || !user.id) {
      throw new UnauthorizedException('Usuário não autenticado');
    }

    const userWithPermissions = await this.prisma.user.findUnique({
      where: { id: user.id },
      include: {
        role: {
          include: {
            permissions: {
              include: {
                permission: true,
              },
            },
          },
        },
      },
    });

    console.log('User with permissions:', userWithPermissions); // Debug log

    const permissions = userWithPermissions?.role?.permissions?.map(
      (rp) => rp.permission.name,
    );

    console.log('Permissions:', permissions); // Debug log

    if (!permissions?.includes(requiredPermission)) {
      throw new ForbiddenException(
        `Permissão '${requiredPermission}' não concedida ao seu perfil.`,
      );
    }

    return true;
  }
}
