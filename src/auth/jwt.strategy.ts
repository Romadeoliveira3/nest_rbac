import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JwtPayload } from './jwt-payload.interface';
import { AuthService } from './auth.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET,
    });
    console.log('JwtStrategy initialized');
  }

  async validate(payload: JwtPayload) {
    console.debug('Validating payload:', payload); 
    const user = await this.authService.findOne(payload.id);
    console.debug('User returned from AuthService:', user);
    if (!user) {
      console.warn('User not found for payload id:', payload.id); 
      throw new UnauthorizedException('User not found');
    }
    console.info('User found:', user); 
    return {
      id: payload.id,
    };
  }
}