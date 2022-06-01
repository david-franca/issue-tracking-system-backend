import { HttpStatus } from '@nestjs/common';
import { ApiProperty, ApiResponseOptions } from '@nestjs/swagger';

class NotFoundSwagger {
  @ApiProperty({ default: HttpStatus.NOT_FOUND })
  statusCode: number;

  @ApiProperty({ default: 'Not Found' })
  message: string;
}

export const notFoundOptions: ApiResponseOptions = {
  type: NotFoundSwagger,
  description: 'ID not found in database.',
};
