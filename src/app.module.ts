import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { configOptions } from './common/config/config.config';
import { IssuesModule } from './modules/api/issues/issues.module';
import { UsersModule } from './modules/api/users/users.module';
import { PrismaModule } from './modules/prisma/prisma.module';

@Module({
  imports: [
    PrismaModule,
    IssuesModule,
    UsersModule,
    ConfigModule.forRoot(configOptions),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
