import { IUser } from 'src/common/interfaces/interface.user';
import { UserEntity } from 'src/database/entities/user.entity';

export class Paciente implements IUser {
  id?: number;
  name: string;
  firstName: string;
  secondLastName: string;
  email: string;
  password?: string;
  status: boolean;
  type: number;
  token: string;
  genero: string;
  edad: number;
  bloodType: string;
  height: number;
  weight: number;

  constructor(
    id: number,
    name: string,
    firstName: string,
    secondLastName: string,
    email: string,
    password = '',
    status: boolean,
    type: number,
    token: string,
    genero: string,
    edad: number,
    bloodType: string,
    height: number,
    weight: number,
  ) {
    this.id = id;
    this.name = name;
    this.firstName = firstName;
    this.secondLastName = secondLastName;
    this.email = email;
    this.password = password;
    this.status = status;
    this.type = type;
    this.token = token;
    this.genero = genero;
    this.edad = edad;
    this.bloodType = bloodType;
    this.height = height;
    this.weight = weight;
  }

  static fromUserEntity(entity: UserEntity): Paciente {
    return new Paciente(
      entity.id,
      entity.name,
      entity.firstName,
      entity.secondLastName,
      entity.email,
      '',
      entity.isActive,
      entity.idType,
      entity.token,
      entity.paciente.gender,
      entity.paciente.age,
      entity.paciente.bloodType,
      entity.paciente.height,
      entity.paciente.weight,
    );
  }
}
