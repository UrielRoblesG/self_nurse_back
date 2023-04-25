import {
  HttpException,
  HttpStatus,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { Encrypt } from 'src/utils/encrypt';
import { LoginAuthDto } from './dto/login-auth.dto';
import { JwtService } from '@nestjs/jwt';
import { IAuthRespose } from 'src/common/interfaces/interface.auth.response';
import { RegisterAuthDto } from './dto/register-auth.dto';
import { UserService } from '../user/user.service';
import { ConfigService } from '@nestjs/config';
import { Paciente } from 'src/models/paciente';
import { Cuidador } from 'src/models/cuidador';
import { Doctor } from 'src/models/doctor';
import { User } from 'src/models/user';

@Injectable()
export class AuthService {
  private readonly logger = new Logger();
  constructor(private readonly userService: UserService) {}

  async login(user: LoginAuthDto): Promise<IAuthRespose> {
    const { password } = user;

    const findUser = await this.userService.findOneByEmail(user.email);

    if (!findUser) {
      throw new HttpException(
        'El email ya esta registrado.',
        HttpStatus.NOT_FOUND,
      );
    }

    const passwordMatch = await Encrypt.compare(password, findUser.password);

    if (!passwordMatch) {
      throw new HttpException(
        'Las constraseñas no coinciden',
        HttpStatus.BAD_REQUEST,
      );
    }

    findUser.isActive = true;
    await this.userService.save(findUser);

    var usuario: any;

    switch (findUser.idType) {
      case 1:
        usuario = new User(findUser);
        break;
      case 2:
        usuario = new User(findUser);
        break;
      case 3:
        usuario = new User(findUser);
        break;
      case 4:
        //TODO: Not implemented yet
        break;
      default:
        break;
    }

    return {
      msg: 'Operación exitosa',
      user: usuario,
    };
  }

  async register(registerAuthDto: RegisterAuthDto): Promise<IAuthRespose> {
    const { email } = registerAuthDto;
    const userExist = await this.userService.findOneByEmail(email);

    if (userExist !== null) {
      throw new HttpException(
        'El email ya esta registrado.',
        HttpStatus.BAD_REQUEST,
      );
    }

    const user = await this.userService.create(registerAuthDto);

    return {
      msg: 'Operación exitosa',
      user,
    };
  }

  async logout(user: any): Promise<boolean> {
    const exist = await this.userService.findOneByEmail(user.email);

    if (!exist) {
      throw new NotFoundException('No existe una cuenta asociada a este email');
    }

    exist.isActive = false;
    const resp = await this.userService.save(exist);

    return resp;
  }

  async getUser(email: any): Promise<any> {
    const userEntity = await this.userService.findOneByEmail(email);

    if (!userEntity) {
      throw new NotFoundException('Usuario no encontrado');
    }

    // const user = User.fromUserEntity(userEntity);

    // return user;
  }
}
