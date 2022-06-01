import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AppService } from './app.service';
import { configOptions } from './common/config/config.config';
import { AuthModule } from './modules/api/auth/auth.module';
import { IssuesModule } from './modules/api/issues/issues.module';
import { UsersModule } from './modules/api/users/users.module';
import { CaslModule } from './modules/casl/casl.module';
import { PrismaModule } from './modules/prisma/prisma.module';

@Module({
  imports: [
    PrismaModule,
    IssuesModule,
    UsersModule,
    ConfigModule.forRoot(configOptions),
    CaslModule,
    AuthModule,
  ],
  controllers: [],
  providers: [AppService],
})
export class AppModule {}
