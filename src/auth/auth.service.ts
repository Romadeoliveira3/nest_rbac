import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../prisma/prisma.service';
import * as bcrypt from 'bcryptjs';
import { User } from '@prisma/client';
import { JwtPayload } from './jwt-payload.interface';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService, private jwt: JwtService) {}

  async register(data: { email: string; password: string; roleId: string }): Promise<User> {
    const existingUser = await this.prisma.user.findUnique({
      where: { email: data.email },
    });

    if (existingUser) {
      throw new ConflictException('Email já está em uso');
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);

    return this.prisma.user.create({
      data: {
        email: data.email,
        password: hashedPassword,
        roleId: data.roleId,
      },
    });
  }

  async login(email: string, password: string) {
    const user = await this.prisma.user.findUnique({
      where: { email },
      include: { role: true },
    });

    if (!user) {
      throw new UnauthorizedException('Usuário não encontrado');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Senha inválida');
    }

    const userWithRole = user as typeof user & { role: { name: string } };

    const payload: JwtPayload = {
      sub: userWithRole.id,
      email: userWithRole.email,
      role: userWithRole.role.name,
    };

    return {
      access_token: this.jwt.sign(payload),
    };
  }

  async findAll() {
    return this.prisma.user.findMany({
      include: {
        role: true,
      },
    });
  }

  async findOne(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: { role: true },
    });

    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }

    return user;
  }

  async update(id: string, data: Partial<{ email: string; password: string; roleId: string }>) {
    const user = await this.findOne(id);

    const updatedData: any = {
      email: data.email || user.email,
      roleId: data.roleId || user.roleId,
    };

    if (data.password) {
      updatedData.password = await bcrypt.hash(data.password, 10);
    }

    return this.prisma.user.update({
      where: { id },
      data: updatedData,
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.user.delete({
      where: { id },
    });
  }
}
