import * as cookieParser from 'cookie-parser';

import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { AppModule } from './app.module';
import { PrismaService } from './modules/prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
import { Environments } from './@types';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // Validations
  app.useGlobalPipes(
    new ValidationPipe({
      errorHttpStatusCode: 422,
      transform: true,
    }),
  );

  const prismaService = app.get(PrismaService);
  await prismaService.enableShutdownHooks(app);

  const configService: ConfigService<Record<Environments, any>> =
    app.get(ConfigService);

  const config = new DocumentBuilder()
    .setTitle('Issue Tracker')
    .setDescription('System of a issue tracking')
    .setVersion('1.0')
    .addTag('issues')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document, {
    customSiteTitle: 'Issues Tracking System',
    swaggerOptions: { supportedSubmitMethods: [], persistAuthorization: true },
  });

  app.use(cookieParser());
  app.enableCors({
    origin: ['https://tracking-system-ten.vercel.app'],
  });
  await app.listen(configService.get('SERVER_PORT'));
}
bootstrap();
