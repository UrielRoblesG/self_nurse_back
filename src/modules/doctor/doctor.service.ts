import { Injectable } from '@nestjs/common';
import { CreateDoctorDto } from './dto/create-doctor.dto';
import { UpdateDoctorDto } from './dto/update-doctor.dto';
import { PatientEntity, UserEntity } from 'src/database/entities';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm/repository/Repository';
import { User } from 'src/models/user';

@Injectable()
export class DoctorService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  create(createDoctorDto: CreateDoctorDto) {
    return 'This action adds a new doctor';
  }

  async vicularPacienteADoctor(user: any, codigo: string): Promise<any> {
    const paciente = await this.userRepository.findOne({
      where: {
        idType: 1,
        deletedAt: null,
        paciente: { codigo: codigo, doctor: null },
      },
      relations: {
        paciente: true,
      },
    });

    if (paciente == null) {
      return { estatus: false, codigo: 4 };
    }

    const doctor = await this.userRepository.findOne({
      where: {
        idType: 3,
        deletedAt: null,
        id: user.id,
        email: user.email,
      },
      relations: {
        doctor: true,
      },
    });

    if (doctor == null) {
      return { estatus: false, codigo: 3 };
    }

    paciente.paciente.doctor = doctor.doctor;

    const userUpdated = await this.userRepository.save(paciente);

    if (userUpdated == null) {
      return { estatus: false, codigo: 2 };
    }

    return { estatus: true, codigo: 0 };
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

  // private _getPacientes(pacientes: PatientEntity[]): Promise<User[]> {
  //   let list: User[] = [];
  //   pacientes.map(async (p) => {
  //     const user = await this.userRepository.findOne({
  //       where: {
  //         deletedAt: null,
  //         idType: 1,
  //         paciente: {
  //           id: p.id,
  //         },
  //       },
  //       relations: {
  //         paciente: true,
  //       },
  //     });

  //     list.push(new User(user));
  //   });

  //   return list;
  // }

  update(id: number, updateDoctorDto: UpdateDoctorDto) {
    return `This action updates a #${id} doctor`;
  }

  remove(id: number) {
    return `This action removes a #${id} doctor`;
  }
}
