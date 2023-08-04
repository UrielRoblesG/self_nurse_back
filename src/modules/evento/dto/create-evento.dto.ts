import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class CreateEventoDto {
  @ApiProperty()
  @IsNotEmpty()
  alerta: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  valor: number;
  @ApiProperty()
  @IsNotEmpty()
  signoVital: string;
  @ApiProperty()
  @IsNotEmpty()
  fecha: string;
  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  pacienteId: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  nurseId: number;
}
