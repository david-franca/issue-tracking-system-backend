import { faker } from '@faker-js/faker';
import { ApiProperty } from '@nestjs/swagger';
import { Priority, Status } from '@prisma/client';
import * as moment from 'moment';

faker.setLocale('pt_BR');

export class IssueSwagger {
  @ApiProperty({ default: faker.datatype.number({ max: 100 }) })
  id: number;

  @ApiProperty({ default: faker.datatype.number({ max: 100 }).toString() })
  version: string;

  @ApiProperty({ default: faker.lorem.words(3) })
  issue: string;

  @ApiProperty({ default: faker.name.findName() })
  autor: string;

  @ApiProperty({ enum: Priority })
  priority: Priority;

  @ApiProperty({ default: moment(faker.date.recent()).format('DD/MM/YYYY') })
  createdAt: string;

  @ApiProperty({ default: faker.lorem.words(8) })
  description: string;

  @ApiProperty({ enum: Status })
  status: Status;

  @ApiProperty({ default: faker.datatype.number({ max: 100 }) })
  userId: number;
}
