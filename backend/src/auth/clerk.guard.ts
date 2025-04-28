// src/auth/clerk.guard.ts
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import * as jwksClient from 'jwks-rsa';
import { Request } from 'express';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ClerkGuard implements CanActivate {
  constructor(private configService: ConfigService) {}

  private client = jwksClient({
    jwksUri: this.configService.get('CLERK_JWKS_URI'),
  });

  private getKey = (header, callback) => {
    this.client.getSigningKey(header.kid, (err, key: any) => {
      const signingKey = key.getPublicKey();
      callback(null, signingKey);
    });
  };

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest<Request>();

    // Skip guard for webhook route
    if (req.path.startsWith('/webhooks/clerk')) {
      return true;
    }
    
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('Missing or invalid token');
    }

    const token = authHeader.split(' ')[1];
    console.log('Token:', token);

    try {
      const payload: any = await new Promise((resolve, reject) => {
        jwt.verify(token, this.getKey, {}, (err, decodedToken) => {
          if (err) {
            console.log('Token verification error:', err); // Log any errors
            return reject(err);
          }
          resolve(decodedToken);
        });
      });

      req['user'] = { id: payload.sub };
      return true;
    } catch (error) {
      console.log('Token validation error:', error); // Log any errors
      throw new UnauthorizedException('Invalid token');
    }
  }
}
