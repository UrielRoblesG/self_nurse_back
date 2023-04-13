import { IUser } from 'src/common/interfaces/interface.user';
import { IsNotEmpty, IsEmail, MinLength, IsNumber } from 'class-validator';
import { Doctor } from 'src/models/doctor';
import { Cuidador } from 'src/models/cuidador';
import { Paciente } from '../../../models/paciente';
import { CreatePatientDto } from 'src/modules/user/dto/create-patient.dto';
import { CreateCaregiverDto } from 'src/modules/user/dto/create-caregiver.dto';
import { CreateDoctorDto } from 'src/modules/user/dto/crete-doctor.dto';

export class RegisterAuthDto implements IUser {
  id?: number;

  @IsNotEmpty()
  name: string;
  @IsNotEmpty()
  firstName: string;
  @IsNotEmpty()
  secondLastName: string;
  @IsEmail()
  email: string;
  @MinLength(8)
  password: string;
  @IsNotEmpty()
  type: number;
  @IsNumber()
  @IsNotEmpty()
  edad: number;

  paciente?: CreatePatientDto;
  cuidador?: CreateCaregiverDto;
  doctor?: CreateDoctorDto;
}
