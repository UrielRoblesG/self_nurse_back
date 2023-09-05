import { CreateCaregiverDto } from '../../modules/user/dto/create-caregiver.dto';
import { CreatePatientDto } from '../../modules/user/dto/create-patient.dto';
import { CreateDoctorDto } from '../../modules/user/dto/create-doctor.dto';

export interface IUser {
  id?: number;
  name: string;
  firstName: string;
  secondLastName: string;
  email: string;
  password?: string;
  status?: boolean;
  phone: string;
  type: number;
  token: string;
  img: string;
}
