import { IUser } from 'src/common/interfaces/interface.user';
import { DoctorEntity } from 'src/database/entities/doctor.entity';
import { UserEntity } from 'src/database/entities/user.entity';

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
