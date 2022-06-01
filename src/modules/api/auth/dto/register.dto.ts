import {
  IsEnum,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';
import { Role } from '@prisma/client';

export class RegisterDto {
  @MaxLength(100)
  @MinLength(2)
  @IsString()
  @IsNotEmpty()
  readonly username: string;

  @MaxLength(20)
  @MinLength(8)
  @IsNotEmpty()
  readonly password: string;

  @IsEnum(Role)
  @IsNotEmpty()
  @ApiProperty({ enum: Role })
  readonly role: Role;
}
