import { faker } from '@faker-js/faker';
import { ApiProperty } from '@nestjs/swagger';
import { Role } from '@prisma/client';

faker.setLocale('pt_BR');

export class UserSwagger {
  @ApiProperty({ default: faker.name.firstName().toLowerCase() })
  username: string;

  @ApiProperty({ default: faker.internet.password() })
  password: string;

  @ApiProperty({ enum: Role })
  role: Role;
}
