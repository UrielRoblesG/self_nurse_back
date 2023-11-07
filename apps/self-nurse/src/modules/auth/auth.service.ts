import {
  HttpException,
  HttpStatus,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { Encrypt } from '../../utils/encrypt';
import { LoginAuthDto } from './dto/login-auth.dto';
import { IAuthRespose } from '../../common/interfaces/interface.auth.response';
import { RegisterAuthDto } from './dto/register-auth.dto';
import { UserService } from '../user/user.service';
import { User } from '../../models/user';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  constructor(private readonly userService: UserService) {}

  async login(user: LoginAuthDto): Promise<IAuthRespose> {
    const { password } = user;

    const findUser = await this.userService.findOneByEmail(user.email);

    if (!findUser) {
      throw new HttpException(
        'El email no esta registrado.',
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

    const userWithTokenDevice = await this.userService.findByAppToken(user.deviceToken);

    if (userWithTokenDevice) {
      userWithTokenDevice.deviceToken = '';
      this.userService.save(userWithTokenDevice);
    }
    findUser.deviceToken = user.deviceToken;
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

  async register(registerAuthDto: RegisterAuthDto): Promise<User> {
    const { email } = registerAuthDto;
    const userExist = await this.userService.findOneByEmail(email);

    if (userExist !== null) {
      throw new HttpException(
        'El email ya esta registrado.',
        HttpStatus.BAD_REQUEST,
      );
    }
    const userWithTokenDevice = await this.userService.findByAppToken(registerAuthDto.deviceToken);

    if (userWithTokenDevice) {
      userWithTokenDevice.deviceToken = '';
      this.userService.save(userWithTokenDevice);
    }
    const user = await this.userService.create(registerAuthDto);

    return user;
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
