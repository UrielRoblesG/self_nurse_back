import { IUser } from 'src/common/interfaces/interface.user';
import { UserEntity } from 'src/database/entities/user.entity';

export class User implements IUser {
  id?: number;
  name: string;
  firstName: string;
  secondLastName: string;
  email: string;
  password: string;
  type: number;

  constructor(
    id: number = 0,
    name: string,
    firstName: string,
    secondName: string,
    email: string,
    password: string = '',
    type: number,
  ) {
    this.id = id;
    this.name = name;
    this.firstName = firstName;
    this.secondLastName = secondName;
    this.email = email;
    this.password = password;
    this.type = type;
  }
  static fromUserEntity(object: UserEntity): User {
    return new User(
      object.id,
      object.name,
      object.firstName,
      object.secondLastName,
      object.email,
      '',
      object.idType,
    );
  }
}
