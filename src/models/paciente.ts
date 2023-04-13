import { IUser } from 'src/common/interfaces/interface.user';
import { CatPacienteEstatus } from './cat.paciente.estatus';
import { UserEntity } from 'src/database/entities/user.entity';

export class Paciente implements IUser {
  id?: number;
  name: string;
  firstName: string;
  secondLastName: string;
  email: string;
  password?: string;
  type: number;
  edad: number;
  tipoDeSangre: string;
  peso: number;
  altura: number;
  estado: any;

  constructor(
    id: number = 0,
    name: string,
    firstName: string,
    secondName: string,
    email: string,
    password: string = '',
    type: number,
    edad: number,
    tipoDeSangre: string,
    peso: number,
    altura: number,
    estado: any,
  ) {
    this.id = id;
    this.name = name;
    this.firstName = firstName;
    this.secondLastName = secondName;
    this.email = email;
    this.password = password;
    this.type = type;
    this.edad = edad;
    this.tipoDeSangre = tipoDeSangre;
    this.peso = peso;
    this.altura = altura;
    this.estado = estado;
  }

  static fromUserEntity(object: UserEntity): Paciente {
    return new Paciente(
      object.id,
      object.name,
      object.firstName,
      object.secondLastName,
      object.email,
      '',
      object.idType,
      object.paciente.age,
      object.paciente.bloodType,
      object.paciente.weight,
      object.paciente.height,
      object.paciente.idStatus,
    );
  }
}
