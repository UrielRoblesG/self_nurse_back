import { Injectable } from '@nestjs/common';
import { CreateNurseDto } from './dto/create-nurse.dto';
import { UpdateNurseDto } from './dto/update-nurse.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { NurseEntity, UserEntity } from 'src/database/entities';
import { Repository } from 'typeorm/repository/Repository';
import { User } from 'src/models/user';
import { getManager } from 'typeorm';

@Injectable()
export class NurseService {
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

  update(id: number, updateNurseDto: UpdateNurseDto) {
    return `This action updates a #${id} nurse`;
  }

  remove(id: number) {
    return `This action removes a #${id} nurse`;
  }
}
