import { IUser } from 'src/common/interfaces/interface.user';
import { UserEntity } from 'src/database/entities/user.entity';

export class Doctor implements IUser {
  id?: number;
  name: string;
  firstName: string;
  secondLastName: string;
  email: string;
  password?: string;
  status: boolean;
  type: number;
  token: string;
  cedula: string;

  constructor(
    id: number,
    name: string,
    firstName: string,
    secondName: string,
    email: string,
    password = '',
    status: boolean,
    type: number,
    token: string,
    cedula: string,
  ) {
    this.id = id;
    this.name = name;
    this.firstName = firstName;
    this.secondLastName = secondName;
    this.email = email;
    this.password = password;
    this.status = status;
    this.type = type;
    this.token = token;
    this.cedula = cedula;
  }

  static fromUserEntity(entity: UserEntity): Doctor {
    return new Doctor(
      entity.id,
      entity.name,
      entity.firstName,
      entity.secondLastName,
      entity.email,
      '',
      entity.isActive,
      entity.idType,
      entity.token,
      entity.doctor.idm,
    );
  }
}
