import { Injectable, Logger } from '@nestjs/common';
import {  UserEntity } from '../../database/entities';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm/repository/Repository';
import { User } from '../../models/user';
import { Response as Resp } from '../../common/responses/response';
import { EntityManager } from 'typeorm/entity-manager/EntityManager';

@Injectable()
export class DoctorService {
  private readonly _logger = new Logger(DoctorService.name);

  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectEntityManager()
    private entityManager: EntityManager,
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

    return {
      status: 'OK',
      codigo: 0,
      user: new User(userUpdated),
      type: user.idType,
    };
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

  async getPatientsMonthlyAlerts(user: any, mes: number, year : number) : Promise<Resp>{

    try {
      const {id} = user;
      const doctor = await this.userRepository.findOne({
        where:{
          deletedAt: null,
          idType: 3,
          id: id
        },
        relations: {
          doctor: true
        }
      });


      if (doctor == null) {
        return new Resp('404', 'Doctor no encontrado');
      }

      let query = '';

      query = `select  p.id as pacienteID from usuario u
                  join paciente p on u.pacienteId = p.id
                  join doctor d on p.doctorId = d.id
                  where u.deleted_at is null and u.idTypeId = 1 and p.doctorId = ${doctor.doctor.id}`; 

      const pacientes = await this.entityManager.query(query);

      if (pacientes.lenght > 0) {
        return new Resp('404', 'El doctor no tiene pacientes registrados');
      }
      let ids = new Array();
      for (let i = 0; i < pacientes.length; i++) {
        const {pacienteID} = pacientes[i];
        ids.push(pacienteID);
      }

      let oIds= ids.join(',');

      query = `
        SELECT T0.id,
        T0.type,
        T0.patientId,
        T0.lecturaId,
        T1.fecha,
        CONCAT(u.nombre, ' ', u.apellidoPaterno) as nombre,
        T1.oxigenacion spO2,
        T1.ritmo       bpm,
        T1.temperatura temp
        FROM alert T0
                INNER JOIN vital_signs T1 on T0.lecturaId = T1.id
        inner join paciente p on T0.patientId = p.id
        inner join usuario u on p.id = u.pacienteId
        WHERE T0.patientId in (${oIds})
         and T0.deleted_at is null
         AND MONTH(T1.fecha) = ${mes}
         and YEAR(T1.fecha) = ${year}`;


      this._logger.debug(query);

      const alertas = await this.entityManager.query(query);


      if (alertas.lenght > 0) {
        new Resp('404', 'Este mes no tienes alertas disponibles');
      }


      return new Resp('200', 'Operación exitosa', alertas);
    } catch (error) {
      this._logger.error(error);
      return new Resp('500', 'Bad request');
    }
  }
  async getPatientMonthlyAlerts(user: any, mes: number, year : number, pacienteID: number) : Promise<Resp>{

    try {
      const {id} = user;
      const doctor = await this.userRepository.findOne({
        where:{
          deletedAt: null,
          idType: 3,
          id: id
        },
        relations: {
          doctor: true
        }
      });


      if (doctor == null) {
        return new Resp('404', 'Doctor no encontrado');
      }

      let query = '';

      query = `select  p.id as pacienteID from usuario u
                join paciente p on u.pacienteId = p.id
                join doctor d on p.doctorId = d.id
                where u.deleted_at is null and u.idTypeId = 1 and 
                p.doctorId = ${doctor.doctor.id} and p.id = ${pacienteID} `; 

      const paciente = await this.entityManager.query(query);

      query = `
        SELECT T0.id,
        T0.type,
        T0.patientId,
        T0.lecturaId,
        T1.fecha,
        CONCAT(u.nombre, ' ', u.apellidoPaterno) as nombre,
        T1.oxigenacion spO2,
        T1.ritmo       bpm,
        T1.temperatura temp
        FROM alert T0
                INNER JOIN vital_signs T1 on T0.lecturaId = T1.id
        inner join paciente p on T0.patientId = p.id
        inner join usuario u on p.id = u.pacienteId
        WHERE T0.patientId in (${paciente[0].pacienteID})
         and T0.deleted_at is null
         AND MONTH(T1.fecha) = ${mes}
         and YEAR(T1.fecha) = ${year}`;


      this._logger.debug(query);

      const alertas = await this.entityManager.query(query);


      if (alertas.lenght > 0) {
        new Resp('404', 'Este mes no tienes alertas disponibles');
      }


      return new Resp('200', 'Operación exitosa', alertas);
    } catch (error) {
      this._logger.error(error);
      return new Resp('500', 'Bad request');
    }
  }
}
