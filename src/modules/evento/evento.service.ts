import { Injectable } from '@nestjs/common';
import { CreateEventoDto } from './dto/create-evento.dto';
import { UpdateEventoDto } from './dto/update-evento.dto';
import { InjectRepository } from '@nestjs/typeorm';
import {
  EventoEntity,
  NurseEntity,
  PatientEntity,
} from 'src/database/entities';
import { Repository } from 'typeorm';
import { Response } from 'src/common/responses/response';

@Injectable()
export class EventoService {
  constructor(
    @InjectRepository(EventoEntity)
    private readonly eventoRepository: Repository<EventoEntity>,
    @InjectRepository(PatientEntity)
    private readonly patientRepository: Repository<PatientEntity>,
    @InjectRepository(NurseEntity)
    private readonly nurseRepository: Repository<NurseEntity>,
  ) {}

  async create(createEventoDto: CreateEventoDto): Promise<Response> {
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
    evento.valor = createEventoDto.valor;
    evento.signoVital = createEventoDto.signoVital;

    try {
      await this.eventoRepository.save(evento);
      return new Response('Ok', 'Operación exitosa', evento);
    } catch (error) {
      return new Response('Error', 'Error al guardar el evento');
    }
  }

  findAll() {
    return `This action returns all evento`;
  }

  findOne(id: number) {
    return `This action returns a #${id} evento`;
  }

  update(id: number, updateEventoDto: UpdateEventoDto) {
    return `This action updates a #${id} evento`;
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
