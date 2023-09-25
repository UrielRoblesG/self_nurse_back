import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsNotEmpty, IsNumber, isDateString } from 'class-validator';
import { CatPacienteEstatus } from '../../../models/cat.paciente.estatus';

export class CreatePatientDto {
  @ApiProperty()
  @IsNotEmpty()
  tipoSangre: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  peso: number;

  @ApiProperty()
  @IsNumber()
  altura: number;

  @ApiProperty()
  @IsNotEmpty()
  estado: number;

  @IsNumber()
  @IsNotEmpty()
  edad: number;

  @IsNotEmpty()
  genero: string;

  @IsNotEmpty()
  parentesco: number;

  @ApiProperty()
  @IsDateString()
  @IsNotEmpty()
  birthday: string;
}
