import {
  HttpException,
  HttpStatus,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { UserEntity } from 'src/database/entities/user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Encrypt } from 'src/utils/encrypt';
import { LoginAuthDto } from './dto/login-auth.dto';
import { JwtService } from '@nestjs/jwt';
import { IAuthRespose } from 'src/common/interfaces/interface.auth.response';
import { User } from '../../models/user';
import { RegisterAuthDto } from './dto/register-auth.dto';
import { UserService } from '../user/user.service';
import { ConfigService } from '@nestjs/config';
import { getRole } from 'src/common/enums/role.enum';

@Injectable()
export class AuthService {
  private readonly logger = new Logger();
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly configServie: ConfigService,
  ) {}

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

    return {
      msg: 'Operación exitosa',
      user: User.fromUserEntity(findUser),
    };
  }

  async register(registerAuthDto: RegisterAuthDto): Promise<IAuthRespose> {
    const { email, password } = registerAuthDto;
    const userExist = await this.userService.findOneByEmail(email);

    if (userExist !== null) {
      throw new HttpException(
        'El email ya esta registrado.',
        HttpStatus.BAD_REQUEST,
      );
    }

    const passwordHash = await Encrypt.hash(password);

    registerAuthDto = { ...registerAuthDto, password: passwordHash };
    // TODO: Pensar como resolver esto

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

  async getUser(email: any): Promise<User> {
    const userEntity = await this.userService.findOneByEmail(email);

    if (!userEntity) {
      throw new NotFoundException('Usuario no encontrado');
    }

    const user = User.fromUserEntity(userEntity);

    return user;
  }
}
