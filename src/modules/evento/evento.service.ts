import { Injectable } from '@nestjs/common';
import { CreateEventoDto } from './dto/create-evento.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { EventoEntity, UserEntity } from 'src/database/entities';
import { Between, Repository } from 'typeorm';
import { Response } from 'src/common/responses/response';
import { ViewGetPacienteEventos } from 'src/database/views';
import { endOfDay, parseISO, startOfDay } from 'date-fns';
import { Evento } from 'src/models';

@Injectable()
export class EventoService {
  constructor(
    @InjectRepository(EventoEntity)
    private readonly eventoRepository: Repository<EventoEntity>,
    @InjectRepository(ViewGetPacienteEventos)
    private readonly viewGetEventoPaciente: Repository<ViewGetPacienteEventos>,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async create(createEventoDto: CreateEventoDto, userAuth: any) {
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
        evento = await this.eventoRepository.create();
        evento.alerta = createEventoDto.alerta;
        evento.fecha = new Date(createEventoDto.fecha);
        evento.nurse = paciente.paciente.nurse;
        evento.paciente = paciente.paciente;
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
        evento = await this.eventoRepository.create();
        evento.alerta = createEventoDto.alerta;
        evento.fecha = new Date(createEventoDto.fecha);
        evento.nurse = nurse.caregiver;
        evento.paciente = nurse.caregiver.paciente;
        break;
      default:
        throw new Error('Rol no valido');
    }

    try {
      await this.eventoRepository.save(evento);
      return new Response('Ok', 'Operación exitosa', evento);
    } catch (error) {
      return new Response('Error', 'Error al guardar el evento');
    }
  }

  async findAllEvents(user: any, day: Date): Promise<Evento[]> {
    const date = parseISO(day.toString());
    const start = startOfDay(date);
    const end = endOfDay(date);
    let eventos: [ViewGetPacienteEventos[], number] = [[], 0];

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
        eventos = await this.viewGetEventoPaciente.findAndCount({
          where: {
            pacienteId: paciente.paciente.id,
            fecha: Between(start, end),
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
        eventos = await this.viewGetEventoPaciente.findAndCount({
          where: {
            nurseId: nurse.caregiver.id,
            fecha: Between(start, end),
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
      let evento = new Evento(
        e.id,
        e.alerta,
        e.fecha,
        e.pacienteId,
        e.nurseId,
        e.recordar,
      );

      items.push(evento);
    });

    return items;
  }

  async findAllNurseEvents(id: number, day: Date): Promise<Evento[]> {
    const date = parseISO(day.toString());

    const items = await this.viewGetEventoPaciente.findAndCount({
      where: {
        nurseId: id,
        fecha: Between(startOfDay(date), endOfDay(date)),
      },
    });

    if (items[1] <= 0) {
      return [];
    }
    let eventos: Evento[] = [];

    items[0].map((e) => {
      let evento = new Evento(
        e.id,
        e.alerta,
        e.fecha,
        e.pacienteId,
        e.nurseId,
        e.recordar,
      );

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
}
