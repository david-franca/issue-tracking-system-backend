import { faker } from '@faker-js/faker';
import { ApiProperty } from '@nestjs/swagger';
import { Issue, Role } from '@prisma/client';

faker.setLocale('pt_BR');

export class UserWithoutIssueSwagger {
  @ApiProperty({ default: faker.datatype.number({ max: 100 }) })
  id: number;

  @ApiProperty({ default: faker.name.firstName().toLowerCase() })
  username: string;

  @ApiProperty({ enum: Role })
  role: Role;

  @ApiProperty({ isArray: true, default: [] })
  issues: Issue[];
}
