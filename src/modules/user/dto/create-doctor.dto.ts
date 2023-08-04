import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, Length, MinLength } from 'class-validator';

export class CreateDoctorDto {
  @ApiProperty()
  @IsNotEmpty()
  @Length(10, 10)
  cedula: string;

  @ApiProperty()
  @IsNotEmpty()
  especialidad: string;
}
