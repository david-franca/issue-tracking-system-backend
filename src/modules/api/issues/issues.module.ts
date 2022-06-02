import { Module } from '@nestjs/common';

import { CaslModule } from '../../casl/casl.module';
import { PrismaModule } from '../../prisma/prisma.module';
import { IssuesController } from './issues.controller';
import { IssuesService } from './issues.service';

@Module({
  imports: [PrismaModule, CaslModule],
  controllers: [IssuesController],
  providers: [IssuesService],
})
export class IssuesModule {}
