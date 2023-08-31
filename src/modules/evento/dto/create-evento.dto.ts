import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsDate, IsNotEmpty, IsNumber } from 'class-validator';

export class CreateEventoDto {
  @ApiProperty()
  @IsNotEmpty()
  alerta: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsDate()
  fecha: Date;

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

  @ApiProperty()
  @IsNumber()
  tipo: number;
}
