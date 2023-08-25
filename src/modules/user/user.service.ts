import { Injectable, Logger } from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from 'src/database/entities/user.entity';
import { Repository } from 'typeorm';

import { PatientEntity } from 'src/database/entities/patient.entity';
import { IUser } from 'src/common/interfaces/interface.user';
import { NurseEntity } from 'src/database/entities/nurse.entity';
import { DoctorEntity } from 'src/database/entities/doctor.entity';
import { RelationshipService } from '../admin/relationship/relationship.service';
import { PatientStatusService } from '../admin/patient.status/patient.status.service';
import { getRole } from 'src/common/enums/role.enum';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Encrypt } from 'src/utils/encrypt';
import { CreateUserDto } from './dto/create-user.dto';
import { RegisterAuthDto } from '../auth/dto/register-auth.dto';
import { Doctor } from 'src/models/doctor';
import { Cuidador } from 'src/models/cuidador';
import { Paciente } from 'src/models/paciente';
import { User } from 'src/models/user';

@Injectable()
export class UserService {
  private readonly logger = new Logger();

  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,

    @InjectRepository(PatientEntity)
    private readonly patientRepository: Repository<PatientEntity>,

    @InjectRepository(NurseEntity)
    private readonly nurseRepository: Repository<NurseEntity>,

    @InjectRepository(DoctorEntity)
    private readonly doctorRepository: Repository<DoctorEntity>,

    private readonly relationshipService: RelationshipService,

    private readonly PatientStatusService: PatientStatusService,

    private readonly jwtService: JwtService,

    private readonly configService: ConfigService,
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
    });

    return await this.userRepository.save(u);
  }
}
