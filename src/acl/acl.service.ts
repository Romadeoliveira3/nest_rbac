import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class AclService {
  constructor(private readonly prisma: PrismaService) {}

  async hasPermission(userId: string, permissionName: string): Promise<boolean> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        role: {
          include: {
            permissions: {
              include: { permission: true },
            },
          },
        },
      },
    });

    return !!user?.role?.permissions.some(
      (rp) => rp.permission.name === permissionName,
    );
  }
}
