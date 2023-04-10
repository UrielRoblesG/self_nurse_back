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
import { JwtConstant } from './jwt.constant';
import { ConfigService } from '@nestjs/config';
import { Public } from 'src/common/decorators/public.decorator';
import { getRole } from 'src/common/enums/role.enum';
import { IJwtPayload } from 'src/common/interfaces/interface.jwt.payload';

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

    const role = getRole(findUser.idType);

    const payload = {
      id: findUser.id,
      email: findUser.email,
      role: role,
    };

    const token = await this.jwtService.sign(payload, {
      secret: this.configServie.get<string>('JWT_SECRET_KEY'),
      expiresIn: '99y',
    });

    return {
      msg: 'Operación exitosa',
      token,
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

    const user = await this.userService.create(registerAuthDto);

    const role = getRole(user.idType);

    const payload = {
      id: user.id,
      email: user.email,
      role: role,
    };

    const token = await this.jwtService.sign(payload, {
      secret: this.configServie.get<string>('JWT_SECRET_KEY'),
      expiresIn: '99y',
    });
    const u = User.fromUserEntity(user);
    return {
      msg: 'Operación exitosa',
      token: token,
      user: u,
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
}
