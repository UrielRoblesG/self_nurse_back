import { Injectable, Logger } from '@nestjs/common';
import { CreateEventoDto } from './dto/create-evento.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { EventoEntity, UserEntity } from '../../database/entities';
import { Between, Repository } from 'typeorm';
import { Response } from '../../common/responses/response';
import { ViewGetPacienteEventos } from '../../database/views';
import { endOfDay, parseISO, startOfDay } from 'date-fns';
import { Evento } from '../../models';
import { utcToZonedTime } from 'date-fns-tz';
@Injectable()
export class EventoService {
  private readonly _logger = new Logger();

  constructor(
    @InjectRepository(EventoEntity)
    private readonly eventoRepository: Repository<EventoEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async create(
    createEventoDto: CreateEventoDto,
    userAuth: any,
  ): Promise<EventoEntity> {
    let evento: EventoEntity;
    switch (userAuth.role) {
      case 'patient':
        const paciente = await this.userRepository.findOne({
          where: { id: userAuth.id, deletedAt: null },
          relations: {
            paciente: {
              doctor: true,
              nurse: true,
            },
          },
        });
        evento = this.eventoRepository.create();
        evento.alerta = createEventoDto.alerta;
        evento.fecha = createEventoDto.fecha;
        evento.nurse = paciente.paciente.nurse;
        evento.paciente = paciente.paciente;
        evento.tipo = createEventoDto.tipo;
        evento.recordar = createEventoDto.recordar;
        evento.frecuencia = createEventoDto.frecuencia;
        break;
      case 'caregiver':
        const nurse = await this.userRepository.findOne({
          where: { id: userAuth.id, deletedAt: null },
          relations: {
            caregiver: {
              paciente: true,
            },
          },
        });
        evento = this.eventoRepository.create();
        evento.alerta = createEventoDto.alerta;
        evento.fecha = createEventoDto.fecha;
        evento.nurse = nurse.caregiver;
        evento.paciente = nurse.caregiver.paciente;
        evento.tipo = createEventoDto.tipo;
        evento.recordar = createEventoDto.recordar;
        evento.frecuencia = createEventoDto.frecuencia;
        break;
      default:
        throw new Error('Rol no valido');
    }

    try {
      const e = await this.eventoRepository.save(evento);
      return e;
    } catch (error) {
      return null;
    }
  }

  async findAllEvents(user: any, day: Date): Promise<Evento[]> {
    const date = parseISO(day.toString());
    const start = startOfDay(date);
    const end = endOfDay(date);
    let eventos: [EventoEntity[], number] = [[], 0];

    switch (user.role) {
      case 'patient':
        const paciente = await this.userRepository.findOne({
          where: {
            deletedAt: null,
            id: user.id,
          },
          relations: {
            paciente: true,
          },
        });
        eventos = await this.eventoRepository.findAndCount({
          where: {
            paciente: {
              id: paciente.paciente.id,
            },
            deletedAt: null,
            fecha: Between(start, end),
          },
          relations: {
            paciente: true,
            nurse: true,
          },
        });
        break;
      case 'caregiver':
        const nurse = await this.userRepository.findOne({
          where: {
            deletedAt: null,
            id: user.id,
          },
          relations: {
            caregiver: true,
          },
        });
        eventos = await this.eventoRepository.findAndCount({
          where: {
            nurse: {
              id: nurse.caregiver.id,
            },
            fecha: Between(start, end),
            deletedAt: null,
          },
          relations: {
            nurse: true,
            paciente: true,
          },
        });

        break;
      default:
        break;
    }

    if (eventos[1] <= 0) {
      return [];
    }

    let items: Evento[] = [];

    eventos[0].map((e) => {
      let evento = new Evento(e);

      items.push(evento);
    });

    return items;
  }

  async findAllNurseEvents(id: number, day: Date): Promise<Evento[]> {
    const date = parseISO(day.toString());

    const items = await this.eventoRepository.findAndCount({
      where: {
        nurse: {
          id: id,
        },
        fecha: Between(startOfDay(date), endOfDay(date)),
        deletedAt: null,
      },
    });

    if (items[1] <= 0) {
      return [];
    }
    let eventos: Evento[] = [];

    items[0].map((e) => {
      let evento = new Evento(e);

      eventos.push(evento);
    });

    return eventos;
  }

  async remove(id: number) {
    try {
      const evento = await this.eventoRepository.findOneByOrFail({ id: id });

      if (evento == null) {
        throw new Error('No se encontro el evento');
      }

      const resp = await this.eventoRepository.softDelete(id);

      return resp;
    } catch (error) {
      return new Response('Error', error);
    }
  }

  async obtenerEventosProximos(date: Date): Promise<EventoEntity[]> {
    try {
      try {
        const startDate = date.getTime();
        const endDate = date.getTime() + 1000 * 60 * 5;

        this._logger.debug(endDate);
        const parsedStartDate = new Date(startDate);
        const parsedEndDate = new Date(endDate);
        const eventos = await this.eventoRepository.findAndCount({
          relations: {
            paciente: true,
            nurse: true,
          },
          where: {
            deletedAt: null,
            fecha: Between(parsedStartDate, parsedEndDate),
            recordar: true,
          },
        });

        this._logger.debug(
          `======================== Cantidad de eventos proximos ======================== \n========================     ${eventos[1]}    ========================`,
        );

        if (eventos[1] <= 0) {
          this._logger.log('No hay recordatorios pendientes');
          return [];
        }

        return eventos[0];
      } catch (error) {
        this._logger.error(error);
        return null;
      }
    } catch (error) {
      this._logger.error(error);
      return null;
    }
  }
}
