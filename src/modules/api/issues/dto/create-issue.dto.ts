import {
  IsDate,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

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
  priority: Priority;

  @IsDate()
  @IsNotEmpty()
  createdAt: Date;

  @MaxLength(500)
  @MinLength(2)
  @IsString()
  @IsNotEmpty()
  description: string;

  @IsEnum(Status)
  @IsNotEmpty()
  status: Status;

  @IsNumber()
  @IsNotEmpty()
  userId: number;
}
