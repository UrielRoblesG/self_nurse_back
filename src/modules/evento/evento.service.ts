import { Injectable } from '@nestjs/common';
import { CreateEventoDto } from './dto/create-evento.dto';
import { UpdateEventoDto } from './dto/update-evento.dto';
import { InjectRepository } from '@nestjs/typeorm';
import {
  EventoEntity,
  NurseEntity,
  PatientEntity,
  UserEntity,
} from 'src/database/entities';
import { Between, MoreThan, Repository } from 'typeorm';
import { Response } from 'src/common/responses/response';
import { ViewGetPacienteEventos } from 'src/database/views';
import { endOfDay, parseISO, startOfDay } from 'date-fns';
import { Evento } from 'src/models';
import { UserService } from '../user/user.service';

@Injectable()
export class EventoService {
  constructor(
    @InjectRepository(EventoEntity)
    private readonly eventoRepository: Repository<EventoEntity>,
    @InjectRepository(PatientEntity)
    private readonly patientRepository: Repository<PatientEntity>,
    @InjectRepository(NurseEntity)
    private readonly nurseRepository: Repository<NurseEntity>,
    @InjectRepository(ViewGetPacienteEventos)
    private readonly viewGetEventoPaciente: Repository<ViewGetPacienteEventos>,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async create(
    createEventoDto: CreateEventoDto,
    id: number,
  ): Promise<Response> {
    const user = await this.userRepository.findOneBy({ id: id });

    const { pacienteId, nurseId } = createEventoDto;

    const patient = await this.patientRepository.findOneBy({ id: pacienteId });

    const nurse = await this.nurseRepository.findOneBy({ id: nurseId });

    if (patient == null || nurse == null) {
      new Response('Error', 'No existen un paciente o el enfermer@ requeridos');
    }
    const evento = await this.eventoRepository.create();
    evento.alerta = createEventoDto.alerta;
    evento.fecha = new Date(createEventoDto.fecha);
    evento.nurse = nurse;
    evento.paciente = patient;

    try {
      await this.eventoRepository.save(evento);
      return new Response('Ok', 'Operación exitosa', evento);
    } catch (error) {
      return new Response('Error', 'Error al guardar el evento');
    }
  }

  async findAllPatientEvents(id: number, day: Date): Promise<Evento[]> {
    const date = parseISO(day.toString());
    const start = startOfDay(date);
    const end = endOfDay(date);
    const eventos = await this.viewGetEventoPaciente.findAndCount({
      where: {
        pacienteId: id,
        fecha: Between(start, end),
      },
    });

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
