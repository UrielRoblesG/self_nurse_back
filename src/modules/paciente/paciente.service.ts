import { Injectable, Logger } from '@nestjs/common';
import { CreatePacienteDto } from './dto/create-paciente.dto';
import { UpdatePacienteDto } from './dto/update-paciente.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { PatientEntity, UserEntity } from '../../database/entities';
import { Repository } from 'typeorm';
import { DoctorService } from '../doctor/doctor.service';

@Injectable()
export class PacienteService {
  private readonly _looger = new Logger(PacienteService.name);
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private readonly doctorService: DoctorService,
    @InjectRepository(PatientEntity)
    private readonly patientRepository : Repository<PatientEntity>
  ) {}

  async findDoctor(user: any): Promise<UserEntity> {
    const { id } = user;
    let paciente: UserEntity;
    switch (user.role) {
      case 'patient':
        paciente = await this.userRepository.findOne({
          where: {
            deletedAt: null,
            idType: 1,
            id: id,
          },
          relations: {
            paciente: {
              doctor: true,
            },
          },
        });
        break;
      case 'caregiver':
        const nurse = await this.userRepository.findOne({
          where: {
            idType: 2,
            deletedAt: null,
            id: id,
          },
          relations: {
            caregiver: {
              paciente: true,
            },
          },
        });
        this._looger.debug(nurse.caregiver.paciente);
        paciente = await this.userRepository.findOne({
          where: {
            deletedAt: null,
            idType: 1,
            paciente: {
              id: nurse.caregiver.paciente.id,
            },
          },
          relations: {
            paciente: {
              doctor: true,
            },
          },
        });

        break;
      default:
        break;
    }

    if (paciente == null) {
      throw new Error('El paciente no existe');
    }

    const doctorId = paciente.paciente.doctor;
    if (doctorId == null) {
      throw new Error('Aun no tienes registrado un doctor');
    }

    const doctor = await this.doctorService.findOne(doctorId.id);

    return doctor;
  }

  async findPatientNurse(id: number): Promise<UserEntity> {
    const paciente = await this.userRepository.findOne({
      where: { deletedAt: null, id: id, idType: 1 },
      relations: {
        paciente: { nurse: true },
      },
    });

    if (paciente == null) {
      return null;
    }

    const nurse = await this.userRepository.findOne({
      where: {
        deletedAt: null,
        idType: 2,
        caregiver: {
          id: paciente.paciente.nurse.id,
        },
      },
      relations: {
        caregiver: true,
      },
    });

    if (nurse == null) {
      return null;
    }

    return nurse;
  }

  findOne(id: number) {
    return `This action returns a #${id} paciente`;
  }

  async updateHistorialMedico(updatePacienteDto: UpdatePacienteDto, user: any) {
    const {id} = user;
    const { historialMedico }=  updatePacienteDto;
    try {
      
    const exist = await this.userRepository.findOne({
      where: {
        deletedAt: null,
        id: id,
      },
      relations: {
        paciente: true
      }
    });

    if (exist == null) {
      return false;
    }

    exist.paciente.historialMedico = historialMedico;

    await this.patientRepository.save(exist.paciente);

    return true;
    } catch(e) {
      this._looger.error(e);
      return false;
    }
  }

  remove(id: number) {
    return `This action removes a #${id} paciente`;
  }
}
