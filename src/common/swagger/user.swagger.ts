import { faker } from '@faker-js/faker';
import { ApiProperty } from '@nestjs/swagger';
import { Issue, Priority, Role, Status } from '@prisma/client';

faker.setLocale('pt_BR');

export class UserSwagger {
  @ApiProperty({ default: faker.datatype.number({ max: 100 }) })
  id: number;

  @ApiProperty({ default: faker.name.firstName().toLowerCase() })
  username: string;

  @ApiProperty({ enum: Role })
  role: Role;

  @ApiProperty({
    isArray: true,
    default: [
      {
        id: faker.datatype.number({ max: 100 }),
        version: faker.datatype.number({ max: 100 }).toString(),
        issue: faker.lorem.words(3),
        autor: faker.name.findName(),
        priority: Priority.ALTA,
        createdAt: faker.date.recent().toLocaleString(),
        description: faker.lorem.words(8),
        status: Status.RESOLVIDO,
        userId: faker.datatype.number({ max: 100 }),
      },
    ],
  })
  issues: Issue[];
}
