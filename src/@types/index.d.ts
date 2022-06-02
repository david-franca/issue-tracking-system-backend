import { Request } from 'express';

import { User } from '@prisma/client';

export type Environments =
  | 'SALT_NUMBER'
  | 'SERVER_PORT'
  | 'JWT_SECRET'
  | 'JWT_EXPIRATION_TIME'
  | 'POSTGRES_PASS'
  | 'POSTGRES_USER'
  | 'POSTGRES_PORT'
  | 'POSTGRES_NAME'
  | 'POSTGRES_HOST;';

export interface RequestWithUser extends Request {
  user?: User;
}

export interface TokenPayload {
  userId: number;
}
