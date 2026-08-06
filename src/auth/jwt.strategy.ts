import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { Strategy } from 'passport-jwt';

// Matches the original Express middleware/token.js: the raw token is sent as the
// entire Authorization header (no "Bearer " scheme), with any stray quotes stripped.
function fromRawAuthorizationHeader(req: Request): string | null {
  const header = req.headers.authorization;
  if (!header) {
    return null;
  }
  return header.replace(/['"]+/g, '');
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(config: ConfigService) {
    super({
      jwtFromRequest: fromRawAuthorizationHeader,
      ignoreExpiration: false,
      secretOrKey: config.getOrThrow<string>('TOKEN_KEY'),
    });
  }

  validate(payload: unknown) {
    return payload;
  }
}
