import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsInt,
  IsNotEmpty,
  IsNumber,
  MinLength,
} from 'class-validator';
import { IUser } from 'src/common/interfaces/interface.user';
import { CreateCaregiverDto } from 'src/modules/user/dto/create-caregiver.dto';
import { CreatePatientDto } from 'src/modules/user/dto/create-patient.dto';
import { CreateDoctorDto } from 'src/modules/user/dto/create-doctor.dto';

export class RegisterAuthDto implements IUser {
  id?: number;

  @ApiProperty()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsNotEmpty()
  firstName: string;

  @ApiProperty()
  @IsNotEmpty()
  secondLastName: string;

  @ApiProperty()
  @IsEmail({}, { message: 'Please enter correct email' })
  email: string;

  @ApiProperty()
  @MinLength(8)
  password: string;

  @ApiProperty()
  @MinLength(10)
  phone: string;

  @ApiProperty()
  status?: boolean;

  @ApiProperty()
  @IsInt()
  type: number;

  @ApiProperty()
  paciente?: CreatePatientDto;

  @ApiProperty()
  cuidador?: CreateCaregiverDto;

  @ApiProperty()
  doctor?: CreateDoctorDto;

  token: string;
}
