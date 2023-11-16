import { IUser } from '../common/interfaces/interface.user';
import { DoctorEntity } from '../database/entities/doctor.entity';
import { UserEntity } from '../database/entities/user.entity';

export class Doctor {
  id?: number;
  cedula: string;
  especialidad?: string;

  constructor({ id, idm, especialidad }: DoctorEntity) {
    this.id = id;
    this.cedula = idm;
    this.especialidad = especialidad;
  }
}
