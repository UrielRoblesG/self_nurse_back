import { Injectable, Logger } from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../../database/entities/user.entity';
import { Like, Repository } from 'typeorm';

import { PatientEntity } from '../../database/entities/patient.entity';
import { IUser } from '../../common/interfaces/interface.user';
import { NurseEntity } from '../../database/entities/nurse.entity';
import { DoctorEntity } from '../../database/entities/doctor.entity';
import { PatientStatusService } from '../admin/patient.status/patient.status.service';
import { getRole } from '../../common/enums/role.enum';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Encrypt } from '../../utils/encrypt';
import { CreateUserDto } from './dto/create-user.dto';
import { RegisterAuthDto } from '../auth/dto/register-auth.dto';
import { User } from '../../models/user';
import { CloudinaryService } from './cloudinary/cloudinary.service';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);

  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,

    @InjectRepository(PatientEntity)
    private readonly patientRepository: Repository<PatientEntity>,

    @InjectRepository(NurseEntity)
    private readonly nurseRepository: Repository<NurseEntity>,

    @InjectRepository(DoctorEntity)
    private readonly doctorRepository: Repository<DoctorEntity>,

    private readonly PatientStatusService: PatientStatusService,

    private readonly jwtService: JwtService,

    private readonly configService: ConfigService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  async create(createUserDto: CreateUserDto | RegisterAuthDto): Promise<IUser> {
    try {
      const { password } = createUserDto;
      const passwordHash = await Encrypt.hash(password);

      createUserDto = { ...createUserDto, password: passwordHash };
      let resp: UserEntity;

      switch (createUserDto.type) {
        case 1:
          const { paciente } = createUserDto;
          const patientStatus =
            await this.PatientStatusService.getPatientStatus(paciente.estado);
          const pat = this.patientRepository.create({
            age: paciente.edad,
            bloodType: paciente.tipoSangre,
            gender: paciente.genero,
            height: paciente.altura,
            idStatus: patientStatus,
            weight: paciente.peso,
            birthday: paciente.birthday,
          });

          resp = await this.createUserPaciente(createUserDto, pat);
          break;

        case 2:
          const care = this.nurseRepository.create({});
          resp = await this.createUserCaregiver(createUserDto, care);
          break;

        case 3:
          const { doctor } = createUserDto;
          const docEntity = this.doctorRepository.create({
            idm: doctor.cedula,
            especialidad: doctor.especialidad,
          });
          resp = await this.createUserDoctor(createUserDto, docEntity);
          break;
        case 4:
          break;
        default:
          break;
      }

      const role = getRole(resp.idType);

      const payload = {
        id: resp.id,
        email: resp.email,
        role: role,
      };

      const token = await this.jwtService.sign(payload, {
        secret: this.configService.get<string>('JWT_SECRET_KEY'),
        expiresIn: '99y',
      });

      resp.token = token;

      if (resp.idType == 1) {
        resp.paciente.codigo = token.substring(token.length - 10, token.length);
      }

      this.userRepository.save(resp);

      const user = new User(resp);

      return user;
    } catch (error) {
      console.log(error);
    }
  }

  async findAll(): Promise<UserEntity[]> {
    try {
      const users = await this.userRepository.find({});
      if (users.length <= 0) {
        throw new Error('Sin registros');
      }
      return users;
    } catch (error) {
      this.logger.error(`Error FindAll: ${error}`);
    }
  }

  async findByAppToken(token : string) : Promise<UserEntity> {
    try {
      const exist = await this.userRepository.findOneBy({
        deletedAt: null,
        deviceToken: token
      });


      return exist;
    } catch (error) {
      this.logger.error(error);
    }  
  }


  async findOneById(id: number): Promise<UserEntity> {
    try {
      const user = await this.userRepository.findOne({
        where: { id: id, deletedAt: null },
        relations: { doctor: true, caregiver: true, paciente: true },
      });

      if (user === null) {
        throw new Error('No se encontro el registro');
      }

      return user;
    } catch (error) {
      this.logger.error(`Error on findOneById: ${error}`);
    }
  }
  async findOneByEmail(email: string): Promise<UserEntity> {
    const user = await this.userRepository.findOne({
      where: {
        email: email,
        deletedAt: null,
      },
      relations: {
        doctor: true,
        caregiver: true,
        paciente: true,
      },
    });

    return user;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  async save(user: UserEntity): Promise<boolean> {
    try {
      const resp = await this.userRepository.save(user);

      return resp !== null ? true : false;
    } catch (error) {
      this.logger.error(error);
      return false;
    }
  }

  async remove(id: number): Promise<boolean> {
    const success = await this.userRepository.softDelete({ id: id });

    if (success === null) {
      return false;
    }

    return true;
  }

  private async createUserPaciente(
    object: IUser,
    paciente: PatientEntity,
  ): Promise<UserEntity> {
    const user = this.userRepository.create({
      name: object.name,
      firstName: object.firstName,
      secondLastName: object.secondLastName,
      idType: object.type,
      email: object.email,
      password: object.password,
      phone: object.phone,
      deviceToken: object.deviceToken,
      paciente,
    });
    return await this.userRepository.save(user);
  }

  private async createUserCaregiver(
    user: IUser,
    caregiver: NurseEntity,
  ): Promise<UserEntity> {
    const u = this.userRepository.create({
      name: user.name,
      firstName: user.firstName,
      secondLastName: user.secondLastName,
      idType: user.type,
      email: user.email,
      password: user.password,
      phone: user.phone,
      caregiver: caregiver,
      deviceToken: user.deviceToken
    });
    return await this.userRepository.save(u);
  }

  private async createUserDoctor(
    user: IUser,
    doctor: DoctorEntity,
  ): Promise<UserEntity> {
    const u = this.userRepository.create({
      name: user.name,
      firstName: user.firstName,
      secondLastName: user.secondLastName,
      idType: user.type,
      email: user.email,
      password: user.password,
      phone: user.phone,
      doctor: doctor,
      deviceToken: user.deviceToken
    });

    return await this.userRepository.save(u);
  }

  public async updateProfilePhoto(
    oUserId: number,
    file: Express.Multer.File,
  ): Promise<string> {
    const user = await this.userRepository.findOne({
      where: {
        deletedAt: null,
        id: oUserId,
      },
    });

    if (user == null) return null;

    try {
      const { secure_url } = await this.cloudinaryService.uploadFile(file);

      user.imgUrl = secure_url;
      const updatedUser = await this.userRepository.save(user);

      this.logger.log(updatedUser);

      return updatedUser.imgUrl;
    } catch (error) {
      this.logger.error(error);
      return null;
    }
  }

  public async getPatientByCode(code: string): Promise<UserEntity> {
    const paciente = await this.userRepository.findOne({
      where: {
        deletedAt: null,
        paciente: {
          codigo: code,
          doctor: null,
        },
      },
      relations: {
        paciente: true,
      },
    });

    return paciente;
  }
  public async getUserByToken(token: string): Promise<UserEntity> {
    const user = await this.userRepository.findOne({
      where: {
        deletedAt: null,
        token: token,
      },
      relations: {
        paciente: true,
        doctor: true,
        caregiver: true,
      },
    });

    return user;
  }

  async updatePatientStatus(id: number) {
    const user = await this.userRepository.findOne({
      where: {
        deletedAt: null,
        id: id,
      },
      relations: {
        paciente: true,
      },
    });

    user.isActive = !user.isActive;

    await this.userRepository.save(user);
  }
}
