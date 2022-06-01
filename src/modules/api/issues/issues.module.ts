import { Module } from '@nestjs/common';

import { PrismaModule } from '../../prisma/prisma.module';
import { IssuesController } from './issues.controller';
import { IssuesService } from './issues.service';

@Module({
  imports: [PrismaModule],
  controllers: [IssuesController],
  providers: [IssuesService],
})
export class IssuesModule {}
