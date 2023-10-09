import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EventoEntity } from 'apps/self-nurse/src/database/entities/evento.entity';
import { UserEntity } from 'apps/self-nurse/src/database/entities/user.entity';
import { Between, Repository, In } from 'typeorm';

@Injectable()
export class EventoService {
  private readonly _logger = new Logger();

  constructor(
    @InjectRepository(EventoEntity)
    private readonly eventoRepository: Repository<EventoEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async obtenerUsuariosDeEventosProximos(date: Date): Promise<UserEntity[]> {
    try {
        const startDate = date.getTime();
        const endDate = date.getTime() + 1000 * 60 * 5;

        this._logger.debug(endDate);
        const parsedStartDate = new Date(startDate);
        const parsedEndDate = new Date(endDate);

        // Obtener los eventos próximos
        const [eventos, count] = await this.eventoRepository.findAndCount({
            relations: ['paciente', 'nurse'],
            where: {
                deletedAt: null,
                fecha: Between(parsedStartDate, parsedEndDate),
                recordar: true,
            },
        });

        this._logger.debug(
            `======================== Cantidad de eventos proximos ======================== \n========================     ${count}    ========================`
        );

        if (count <= 0) {
            this._logger.log('No hay recordatorios pendientes');
            return [];
        }

        // Extraer los ID de los pacientes y nurses
        const patientIds = eventos.map(evento => evento.paciente.id);
        const nurseIds = eventos.map(evento => evento.nurse.id);

        // Consultar el repositorio de UserEntity para encontrar usuarios relacionados
        const users = await this.userRepository.find({
            where: [
                { paciente: In(patientIds) },
                { caregiver: In(nurseIds) }
            ],
        });

        return users;
    } catch (error) {
        this._logger.error(error);
        return null;
    }
}
}
