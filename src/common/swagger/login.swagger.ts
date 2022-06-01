import { faker } from '@faker-js/faker';
import { ApiProperty } from '@nestjs/swagger';

faker.setLocale('pt_BR');

export class LoginSwagger {
  @ApiProperty({ default: faker.name.firstName().toLowerCase() })
  username: string;

  @ApiProperty({ default: faker.internet.password() })
  password: string;
}
