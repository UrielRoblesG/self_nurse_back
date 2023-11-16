import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreateRelationshipDto {
  @ApiProperty()
  @IsNotEmpty()
  relacion: string;
}
