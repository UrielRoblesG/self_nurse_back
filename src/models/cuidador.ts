import { IUser } from 'src/common/interfaces/interface.user';
import { UserEntity } from 'src/database/entities/user.entity';
import { CatRelationship } from './cat.relationship';

export class Cuidador implements IUser {
  id?: number;
  name: string;
  firstName: string;
  secondLastName: string;
  email: string;
  password?: string;
  status: boolean;
  type: number;
  token: string;
  relation: CatRelationship;

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
    relation: CatRelationship,
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
    this.relation = relation;
  }

  static fromUserEntity(entity: UserEntity): Cuidador {
    return new Cuidador(
      entity.id,
      entity.name,
      entity.firstName,
      entity.secondLastName,
      entity.email,
      '',
      entity.isActive,
      entity.idType,
      entity.token,
      CatRelationship.fromCatRelationshipEntity(entity.caregiver.relationship),
    );
  }
}
