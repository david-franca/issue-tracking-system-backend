import * as Joi from 'joi';

import { ConfigModuleOptions } from '@nestjs/config';

export const configOptions: ConfigModuleOptions = {
  cache: true,
  isGlobal: true,
  validationSchema: Joi.object({
    NODE_ENV: Joi.string()
      .valid('development', 'production', 'test', 'provision')
      .default('development'),
    POSTGRES_PASS: Joi.string().required(),
    POSTGRES_USER: Joi.string().required(),
    POSTGRES_PORT: Joi.string().required(),
    POSTGRES_NAME: Joi.string().required(),
    POSTGRES_HOST: Joi.string().required(),
    DATABASE_URL: Joi.string().required(),
    SERVER_PORT: Joi.number().required(),
    SALT_NUMBER: Joi.number().required(),
    JWT_SECRET: Joi.string().required(),
    JWT_EXPIRATION_TIME: Joi.string().required(),
  }),
};
