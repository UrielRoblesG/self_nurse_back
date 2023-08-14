import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsNumber } from 'class-validator';

export class CreateEventoDto {
  @ApiProperty()
  @IsNotEmpty()
  alerta: string;
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

  @ApiProperty()
  @IsBoolean()
  recordar: boolean;
}
