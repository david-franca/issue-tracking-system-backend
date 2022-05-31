import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './modules/prisma/prisma.module';
import { IssuesModule } from './modules/api/issues/issues.module';
import { UsersModule } from './modules/api/users/users.module';

@Module({
  imports: [PrismaModule, IssuesModule, UsersModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
