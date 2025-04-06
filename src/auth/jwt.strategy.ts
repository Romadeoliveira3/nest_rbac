import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PrismaService } from '../../prisma/prisma.service';
import { JwtPayload } from './jwt-payload.interface';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private prisma: PrismaService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET,
    });
    console.log('JwtStrategy initialized');
  }

  async validate(payload: JwtPayload): Promise<any> {
    console.log('Validating payload:', payload);
    const user = await this.prisma.user.findUnique({
      where: { id: payload.sub },
      include: { role: true },
    });
    console.log('User fetched from database:', user);
    if (!user) {
      console.error('User not found for payload:', payload);
      throw new UnauthorizedException('Usuário não encontrado');
    }
    const result = {
      id: user.id,
      email: user.email,
      role: user.role.name,
    };
    console.log('Validation result:', result);
    return result;
  }
}
