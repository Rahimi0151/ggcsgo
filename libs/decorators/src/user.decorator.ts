/**
 * user.decorator.ts
 *
 * This file contains a custom decorator for NestJS that extracts the 'userId'
 * from the JWT present in the 'jwt' cookie of the request. The decorator can
 * be used in controller methods to automatically extract the 'userId' from the
 * request. decorator throws an UnauthorizedException if the JWT verification
 * fails.

 * @example
 * @Get(/items)
 * getItems(@UserID() userId: number) {
 */
import { ExecutionContext, createParamDecorator, UnauthorizedException } from '@nestjs/common';

import * as jwt from 'jsonwebtoken';

const decorator = (data: unknown, context: ExecutionContext): number => {
  const request = context.switchToHttp().getRequest();

  try {
    const decoded = jwt.verify(request.cookies.jwt, 'your-secret-key');
    if (typeof decoded === 'object') return decoded.steamId;
  } catch (err) {
    console.log(err);
    throw new UnauthorizedException('Failed to verify token');
  }
};

export const UserID = createParamDecorator(decorator);
