/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    console.log('AuthGuard executed');

    const request = context.switchToHttp().getRequest<Request>();
    const bearer = request.headers['authorization'];

    if (!bearer) {
      return false;
    }

    const token = bearer.split(' ')[1];

    try {
      const payload = await this.jwtService.verify(token, {
        secret: process.env.JWT_SECRETKEY,
      });

      request['email'] = payload.email;
      console.log(payload);
    } catch (error) {
      console.log('Token verification failed');
      return false;
    }

    return true;
  }
}
