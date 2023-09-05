import { PatientEntity } from '../database/entities/patient.entity';
import { CatPacienteEstatus } from './cat.paciente.estatus';

export class Paciente {
  id?: number;
  genero: string;
  edad: number;
  bloodType: string;
  height: number;
  weight: number;
  phone: string;
  codigo: string;
  status: CatPacienteEstatus;

  constructor({
    id,
    gender,
    age,
    bloodType,
    height,
    weight,
    idStatus,
    codigo,
  }: PatientEntity) {
    this.id = id;
    this.genero = gender;
    this.edad = age;
    this.bloodType = bloodType;
    this.height = height;
    this.weight = weight;
    this.codigo = codigo;
    this.status = CatPacienteEstatus.FromPatientEntity(idStatus);
  }
}
