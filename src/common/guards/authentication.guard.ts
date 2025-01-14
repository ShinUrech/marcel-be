/* eslint-disable prettier/prettier */
import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Observable } from 'rxjs';
import { MSG_EXCEPTION } from '../constants/messages';

@Injectable()
export class AuthenticationGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private config: ConfigService,
  ) {}

  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    try {
      const request = context.switchToHttp().getRequest();
      const token = request.headers.authorization.split(' ')[1];
      if (!token) {
        throw new UnauthorizedException(MSG_EXCEPTION.UNAUTHORIZED_TOKEN_NOT_FOUND);
      }
      const { user } = this.jwtService.verify(token, {
        secret: this.config.get<string>('auth.accessToken'),
      });
      request.user = user;
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      throw new UnauthorizedException(MSG_EXCEPTION.UNAUTHORIZED_TOKEN, MSG_EXCEPTION.UNAUTHORIZED_TOKEN_EXPIRED);
    }
    return true;
  }
}
