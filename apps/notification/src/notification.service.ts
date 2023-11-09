import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  EventoEntity,
  NurseEntity,
  PatientEntity,
  UserEntity,
} from 'apps/self-nurse/src/database/entities/';
import { ViewGetPacienteEventos } from 'apps/self-nurse/src/database/views';
import { Between, Repository, In } from 'typeorm';
import { addDays } from 'date-fns'; 
import { Notificacion } from '../model/notificacion';

@Injectable()
export class NotificationService {
  private readonly _logger = new Logger(NotificationService.name);

  constructor(
    @InjectRepository(EventoEntity)
    private readonly eventoRepository: Repository<EventoEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(ViewGetPacienteEventos)
    private readonly vGetEventos: Repository<ViewGetPacienteEventos>,
  ) {}

  async obtenerNotificacionesProximas(date: Date): Promise<Notificacion[]> {
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

      // TODO: Prueba
      // TODO: Algo provisional que hice
      const proximos = await this.vGetEventos.find({});

      const eventosSemanales = proximos.filter((evento) => evento.frecuencia === "S");
      try {
        // Agregar una semana (7 días) a la fecha de los eventos semanales
        eventosSemanales.forEach((evento) => {
          evento.fecha = addDays(evento.fecha, 7);
        });

        this.eventoRepository.save(eventosSemanales);
        /*
        const eventosOriginales = await this.vGetEventos.findByIds(
          eventosSemanales.map((evento) => evento.id)
        );

        
        eventosOriginales.forEach((eventoOriginal) => {
          const eventoModificado = eventosSemanales.find((e) => e.id === eventoOriginal.id);
          if (eventoModificado) {
            eventoOriginal.fecha = eventoModificado.fecha;
          }
        });

        
        await this.vGetEventos.save(eventosOriginales);*/
      } catch (error) {
        this._logger.log(error+' No se pudo actualizar la fecha de los eventos semanales');
      } 

      this._logger.debug(`Cantidad de eventos próximos: ${proximos.length}`);

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
        .leftJoinAndSelect('user.paciente', 'paciente')
        .leftJoinAndSelect('user.caregiver', 'cuidador')
        .getMany();

      // 4. Crear la notificacion para cada usuario
      let notificaciones : Notificacion[]= [];
      users.forEach((u) => {
        let n = new Notificacion();
        let e: ViewGetPacienteEventos;

        if (u.idType == 1)
          e = proximos.find((e) => e.pacienteId == u.paciente.id);
        else if (u.idType == 2)
          e = proximos.find((e) => e.nurseId == u.caregiver.id);

        if (e.tipo == 1) n.title = 'Medicamento';
        else if (e.tipo == 2) n.title = 'Cita medica';
        n.body = e.alerta;
        n.data = {
          dispositivo: u.deviceToken,
          fecha: e.fecha.toISOString(),
          tipo: `${e.tipo}`,
        };
        notificaciones.push(n);
      });

      // 5. Revisar la frecuencia y actualizar en caso de ser semanal
      let ids: number[] = [];
      proximos.forEach((e) => ids.push(e.id));

      // await this.eventoRepository
      //   .createQueryBuilder()
      //   .update()
      //   .set({ fecha: () => 'Date(fecha, INTERVAL 7 DAY)' })
      //   .where('id IN (:...ids)', { ids })
      //   .andWhere('estatus = :estatus', { estatus: 'A' })
      //   .andWhere('frecuencia = :frecuencia', { frecuencia: 'A' })
      //   .execute();

      await this.eventoRepository
        .createQueryBuilder()
        .update()
        .set({ estatus: 'I' })
        .where('estatus = :estatus', { estatus: 'A' })
        .where('id IN (:...ids)', { ids })
        .andWhere('frecuencia = :f', { f: 'U' })
        .execute();

      return notificaciones;
    } catch (error) {
      this._logger.error('Error en servicio al buscar usuarios:', error);
      return [];
    }
  }
}
