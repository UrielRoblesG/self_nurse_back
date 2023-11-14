import { Injectable, Logger } from '@nestjs/common';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../../database/entities';
import { Repository } from 'typeorm/repository/Repository';
import { User } from '../../models/user';
import {Response as Resp} from '../../common/responses/response';
import { EntityManager } from 'typeorm';
import { Alerta } from 'src/models';
@Injectable()
export class NurseService {
  private readonly _logger = new Logger(NurseService.name);

  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectEntityManager()
    private entityManager: EntityManager,
  ) {}

  async getPatientNurse(data: any): Promise<UserEntity> {
    const user = await this.userRepository.findOne({
      where: { deletedAt: null, id: data.id },
      relations: { paciente: { nurse: true } },
    });

    if (user.paciente.nurse == null) {
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

    return {
      status: 'OK',
      codigo: 0,
      user: new User(resp),
      type: oNurse.idType,
    };
  }

  async getPatientMonthlyAlerts(user : any, mes : number, year : number) : Promise<Resp> {
    const {id} = user;

    const nurse = await this.userRepository.findOne({
      where: {
        deletedAt: null,
        idType: 2,
        id: id
      },
      relations: {
        caregiver: true
      }
    });

    if (nurse == null) {
      return new Resp('404', 'Enfermer@ no encontrado');
    }
    let query = `
          SELECT COUNT(*) as exist ,p.id as pacienteId from usuario U 
          join paciente p on U.pacienteId = p.id
          where p.nurseId = ${nurse.caregiver.id} and deleted_at is null and idTypeId = 1`;
    const paciente = await this.entityManager.query(query);

    const {exist, pacienteId} = paciente[0];
    if (exist == 0) {
      return new Resp('404', 'No tienes registrado un paciente');
    }


    query = `SELECT
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
                      WHERE T0.patientId = ${pacienteId} and T0.deleted_at is null
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
