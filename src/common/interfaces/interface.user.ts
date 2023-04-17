import { CreateCaregiverDto } from 'src/modules/user/dto/create-caregiver.dto';
import { CreatePatientDto } from 'src/modules/user/dto/create-patient.dto';
import { CreateDoctorDto } from 'src/modules/user/dto/crete-doctor.dto';

export interface IUser {
  id?: number;
  name: string;
  firstName: string;
  secondLastName: string;
  email: string;
  password?: string;
  status?: boolean;
  type: number;
  token: string;
}
