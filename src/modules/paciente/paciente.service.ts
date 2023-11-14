import { Injectable, Logger } from '@nestjs/common';
import { CreatePacienteDto } from './dto/create-paciente.dto';
import { UpdatePacienteDto } from './dto/update-paciente.dto';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import { AlertEntity, PatientEntity, UserEntity } from '../../database/entities';
import { EntityManager, Repository } from 'typeorm';
import { DoctorService } from '../doctor/doctor.service';
import { Response as Resp } from '../../common/responses/response';
import { Length } from 'class-validator';
import { Alerta } from 'src/models';

@Injectable()
export class PacienteService {
  private readonly _looger = new Logger(PacienteService.name);
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private readonly doctorService: DoctorService,
    @InjectRepository(PatientEntity)
    private readonly patientRepository : Repository<PatientEntity>,
    @InjectRepository(AlertEntity)
    private readonly alertReporitory : Repository<AlertEntity>,
    @InjectEntityManager()
    private entityManager: EntityManager,
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

  async getMonthlyAlerts(user : any, mes : number, year: number) : Promise<Resp> {
    const {id} = user;

    const paciente = await this.userRepository.findOne({
      where: {
        deletedAt: null,
        idType: 1,
        id: id
      },
      relations: {
        paciente: true
      }
    });

    if (paciente == null) {
      return new Resp('404', 'Paciente no encontrado');
    }

    const query = `SELECT
                        T0.id,
                        T0.type,
                        T0.patientId,
                        T0.lecturaId,
                        T1.fecha,
                        T1.oxigenacion spO2,
                        T1.ritmo bpm,
                        T1.temperatura temp
                      FROM alert T0
                      INNER JOIN vital_signs T1 on T0.lecturaId = T1.id
                      WHERE T0.patientId = ${paciente.paciente.id} and T0.deleted_at is null
                      AND MONTH( T1.fecha) = ${mes} and YEAR(T1.fecha) = ${year}`;

    const alertas = await this.entityManager.query(query);
    

    if (alertas.Length <= 0) {
      return new Resp('NOT_FOUND', 'No se encontraron alertas');
    }

    let oAlertas = new Array();

    for (let i = 0; i < alertas.length; i++) {
      oAlertas.push(Alerta.fromEntityModel(alertas[i]));
    }

    return new Resp('200', 'Operación exitosa', oAlertas);
  }
}
