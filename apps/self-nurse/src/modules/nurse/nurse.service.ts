import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../../database/entities';
import { Repository } from 'typeorm/repository/Repository';
import { User } from '../../models/user';

@Injectable()
export class NurseService {
  private readonly _logger = new Logger(NurseService.name);

  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async getPatientNurse(data: any): Promise<UserEntity> {
    const user = await this.userRepository.findOne({
      where: { deletedAt: null, id: data.id },
      relations: { paciente: { nurse: true } },
    });

    if (user.paciente.nurse.id == null) {
      return null;
    }
    const nurse = await this.userRepository.findOne({
      where: { deletedAt: null, caregiver: { id: user.paciente.nurse.id } },
      relations: { caregiver: true },
    });

    return nurse;
  }

  async getPaciente(user: any): Promise<User> {
    const { id } = user;

    const nurse = await this.userRepository.findOne({
      where: {
        idType: 2,
        deletedAt: null,
        id: id,
      },
      relations: {
        caregiver: true,
      },
    });

    const paciente = await this.userRepository.findOne({
      where: {
        idType: 1,
        deletedAt: null,
        paciente: {
          nurse: {
            id: nurse.caregiver.id,
          },
        },
      },
      relations: {
        paciente: {
          doctor: true,
        },
      },
    });

    if (paciente == null) {
      return null;
    }

    return new User(paciente);
  }

  async registrarPaciente(
    oNurse: UserEntity,
    oPaciente: UserEntity,
  ): Promise<any> {
    if (oNurse == null) {
      return { status: 'Enfermer@ no encontrado', codigo: 1 };
    }

    if (oPaciente == null) {
      return { status: 'Paciente no encontrado', codigo: 2 };
    }

    oPaciente.paciente.nurse = oNurse.caregiver;

    const resp = await this.userRepository.save(oPaciente);

    return { status: 'OK', codigo: 0 };
  }
}
