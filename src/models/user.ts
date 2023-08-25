import { IUser } from 'src/common/interfaces/interface.user';
import { Paciente } from './paciente';
import { Cuidador } from './cuidador';
import { Doctor } from './doctor';
import { UserEntity } from 'src/database/entities/user.entity';

export class User implements IUser {
  id?: number;
  name: string;
  firstName: string;
  secondLastName: string;
  email: string;
  password?: string;
  status?: boolean;
  phone: string;
  type: number;
  token: string;
  img: string;
  paciente?: Paciente;
  cuidador?: Cuidador;
  doctor?: Doctor;

  constructor(user: UserEntity) {
    this.id = user.id;
    this.name = user.name;
    this.firstName = user.firstName;
    this.secondLastName = user.secondLastName;
    this.email = user.email;
    this.password = user.password;
    this.status = user.isActive;
    this.phone = user.phone;
    this.type = user.idType;
    this.token = user.token;
    this.img = user.imgUrl;

    switch (this.type) {
      case 1:
        const paciente = new Paciente(user.paciente);
        this.paciente = paciente;
        break;
      case 2:
        const cuidador = new Cuidador(user.caregiver);
        this.cuidador = cuidador;
        break;
      case 3:
        const doctor = new Doctor(user.doctor);
        this.doctor = doctor;
        break;
      case 4:
        break;

      default:
        break;
    }
  }
}
