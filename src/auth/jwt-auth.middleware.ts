import { Injectable, NestMiddleware, UnauthorizedException, Logger } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { JwtService } from '@nestjs/jwt';

const PUBLIC_ROUTES = ['/auth/login', '/auth/register'];

@Injectable()
export class JwtAuthMiddleware implements NestMiddleware {
  private readonly logger = new Logger(JwtAuthMiddleware.name);

  constructor(private readonly jwtService: JwtService) {}

  use = (req: Request, res: Response, next: NextFunction): void => {
    if (PUBLIC_ROUTES.some(route => req.path.startsWith(route))) {
      return next();
    }

    const authHeader = req.headers.authorization;
    if (!authHeader) {
      throw new UnauthorizedException('No token provided');
    }
    const token = authHeader.split('Bearer ')[1];
    if (!token) {
      throw new UnauthorizedException('Invalid token format');
    }
    try {
      const payload = this.jwtService.verify(token, { secret: process.env.JWT_SECRET });
      req['user'] = {
        id: payload.sub,
        email: payload.email,
        role: payload.role,
      };
      this.logger.debug(`User from token: ${JSON.stringify(req['user'])}`);
      next();
    } catch (error) {
      this.logger.error('Invalid token', error.stack);
      throw new UnauthorizedException('Invalid token');
    }
  }
}
