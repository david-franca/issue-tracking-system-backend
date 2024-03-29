import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';
import { Priority, Status } from '@prisma/client';

export class CreateIssueDto {
  @MaxLength(100)
  @MinLength(2)
  @IsString()
  @IsNotEmpty()
  version: string;

  @MaxLength(200)
  @MinLength(2)
  @IsString()
  @IsNotEmpty()
  issue: string;

  @MaxLength(100)
  @MinLength(2)
  @IsString()
  @IsNotEmpty()
  autor: string;

  @IsEnum(Priority)
  @IsNotEmpty()
  @ApiProperty({ enum: Priority })
  priority: Priority;

  @MaxLength(500)
  @MinLength(2)
  @IsString()
  @IsNotEmpty()
  description: string;

  @IsEnum(Status)
  @IsOptional()
  @ApiProperty({ enum: Status })
  status: Status;
}
