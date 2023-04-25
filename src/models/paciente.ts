import { IUser } from 'src/common/interfaces/interface.user';
import { PatientEntity } from 'src/database/entities/patient.entity';
import { UserEntity } from 'src/database/entities/user.entity';
import { CatPacienteEstatus } from './cat.paciente.estatus';

export class Paciente {
  id?: number;
  genero: string;
  edad: number;
  bloodType: string;
  height: number;
  weight: number;
  phone: string;
  status: CatPacienteEstatus;

  constructor({
    id,
    gender,
    age,
    bloodType,
    height,
    weight,
    idStatus,
  }: PatientEntity) {
    this.id = id;
    this.genero = gender;
    this.edad = age;
    this.bloodType = bloodType;
    this.height = height;
    this.weight = weight;
    this.status = CatPacienteEstatus.FromPatientEntity(idStatus);
  }
}
