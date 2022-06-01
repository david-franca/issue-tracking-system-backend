import { Request } from 'express';

import { User } from '@prisma/client';

export type Environments =
  | 'SALT_NUMBER'
  | 'SERVER_PORT'
  | 'JWT_SECRET'
  | 'JWT_EXPIRATION_TIME';

export interface RequestWithUser extends Request {
  user?: User;
}

export interface TokenPayload {
  userId: number;
}
