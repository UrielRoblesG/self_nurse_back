import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  EventoEntity,
  UserEntity,
} from 'apps/self-nurse/src/database/entities/';
import { ViewGetPacienteEventos } from 'apps/self-nurse/src/database/views';
import { Between, Repository, In } from 'typeorm';

@Injectable()
export class NotificationService {
  private readonly _logger = new Logger();

  constructor(
    @InjectRepository(EventoEntity)
    private readonly eventoRepository: Repository<EventoEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(ViewGetPacienteEventos)
    private readonly vGetEventos: Repository<ViewGetPacienteEventos>,
  ) {}

  async obtenerUsuariosDeEventosProximos(date: Date): Promise<UserEntity[]> {
    try {
      const startDate = date.getTime();
      const endDate = startDate + 1000 * 60 * 5;

      const parsedStartDate = new Date(startDate);
      const parsedEndDate = new Date(endDate);

      // 1. Obtener los eventos próximos
      // TODO: No obtiene ningun evento
      const [eventos, count] = await this.eventoRepository.findAndCount({
        relations: ['paciente', 'nurse'],
        where: {
          deletedAt: null,
          fecha: Between(parsedStartDate, parsedEndDate),
          recordar: true,
        },
      });

      // Prueba
      // TODO: Algo provisional que hice
      const proximos = await this.vGetEventos.find({});

      this._logger.debug(`Cantidad de eventos próximos: ${count}`);

      if (proximos.length <= 0) {
        this._logger.log('No hay recordatorios pendientes');
        return [];
      }

      // 2. Extraer los ID de los pacientes y nurses
      // TODO: Cambie esto
      const patientIds = proximos.map((evento) => evento.pacienteId);
      const nurseIds = proximos.map((evento) => evento.nurseId);

      // 3. Consultar el repositorio de UserEntity para encontrar usuarios relacionados
      const users = await this.userRepository
        .createQueryBuilder('user')
        .where('user.paciente IN (:...patientIds)', { patientIds })
        .orWhere('user.caregiver IN (:...nurseIds)', { nurseIds })
        .getMany();

      return users;
    } catch (error) {
      this._logger.error('Error en servicio al buscar usuarios:', error);
      return [];
    }
  }
}
