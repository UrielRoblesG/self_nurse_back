import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsInt,
  IsNotEmpty,
  IsNumber,
  MinLength,
} from 'class-validator';
import { IUser } from 'src/common/interfaces/interface.user';
import { CreatePatientDto } from './create-patient.dto';
import { CreateDoctorDto } from './crete-doctor.dto';
import { CreateCaregiverDto } from './create-caregiver.dto';

export class CreateUserDto implements IUser {
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
  @IsInt()
  type: number;

  @IsNotEmpty()
  @IsNumber()
  edad: number;

  @ApiProperty()
  patient?: CreatePatientDto;

  @ApiProperty()
  caregiver?: CreateCaregiverDto;

  @ApiProperty()
  doctor?: CreateDoctorDto;
}
