import { Injectable, Logger } from '@nestjs/common';
import { CreateDoctorDto } from './dto/create-doctor.dto';
import { UpdateDoctorDto } from './dto/update-doctor.dto';
import { PatientEntity, UserEntity } from '../../database/entities';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm/repository/Repository';
import { User } from '../../models/user';

@Injectable()
export class DoctorService {
  private readonly _logger = new Logger(DoctorService.name);

  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async vicularPacienteADoctor(
    user: UserEntity,
    paciente: UserEntity,
  ): Promise<any> {
    paciente.paciente.doctor = user.doctor;

    const userUpdated = await this.userRepository.save(paciente);

    if (userUpdated == null) {
      return { estatus: false, codigo: 2 };
    }

    return { estatus: true, codigo: 0, paciente: userUpdated };
  }

  async findOne(id: number) {
    const doctor = await this.userRepository.findOne({
      where: {
        deletedAt: null,
        idType: 3,
        doctor: {
          id: id,
        },
      },
      relations: {
        doctor: true,
      },
    });

    return doctor;
  }

  async findAll(user: any): Promise<User[]> {
    const { email, id } = user;

    const doctor = await this.userRepository.findOne({
      where: {
        idType: 3,
        deletedAt: null,
        email: email,
        id: id,
      },
      relations: {
        doctor: true,
      },
    });

    if (doctor == null) {
      return null;
    }

    const resp = await this.userRepository.findAndCount({
      where: {
        deletedAt: null,
        idType: 1,
        paciente: {
          doctor: {
            id: doctor.doctor.id,
          },
        },
      },
      relations: {
        paciente: true,
      },
    });
    const pacientes = resp[0];
    let list: User[] = [];

    pacientes.map((p) => {
      list.push(new User(p));
    });
    return list;
  }

  update(id: number, updateDoctorDto: UpdateDoctorDto) {
    return `This action updates a #${id} doctor`;
  }

  remove(id: number) {
    return `This action removes a #${id} doctor`;
  }
}
