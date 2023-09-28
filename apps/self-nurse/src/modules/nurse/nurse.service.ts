import { Injectable, Logger } from '@nestjs/common';
import { CreateNurseDto } from './dto/create-nurse.dto';
import { UpdateNurseDto } from './dto/update-nurse.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { NurseEntity, UserEntity } from '../../database/entities';
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
    nurse: UserEntity,
    paciente: UserEntity,
  ): Promise<any> {}
}
