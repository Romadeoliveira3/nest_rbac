import {
  CanActivate,
  ExecutionContext,
  Injectable,
  ForbiddenException,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PrismaService } from '../../../prisma/prisma.service';
import { ROLES_KEY } from '../decorators/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector, private prisma: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }
    const request = context.switchToHttp().getRequest();
    console.log('Request headers:', request.headers);
    console.log('Request user:', request.user);
    
    const user = request?.user;

    console.log('User from request:', user);
    console.log('Required roles:', requiredRoles);

    if (!user || !user.id) {
      throw new UnauthorizedException('Usuário não autenticado');
    }

    const userWithRole = await this.prisma.user.findUnique({
      where: { id: user.id },
      include: { role: true },
    });

    if (!userWithRole) {
      throw new UnauthorizedException('Usuário não encontrado');
    }

    const userRole = userWithRole.role.name;
    if (!requiredRoles.includes(userRole)) {
      throw new ForbiddenException(
        `Acesso negado. Requer um dos papéis: ${requiredRoles.join(', ')}`,
      );
    }
    return true;
  }
}
