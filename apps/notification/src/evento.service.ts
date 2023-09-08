import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EventoEntity } from './database/evento.entity';
import { Between, Repository } from 'typeorm';

@Injectable()
export class EventoService {
  private readonly _logger = new Logger();

  constructor(
    @InjectRepository(EventoEntity)
    private readonly eventoRepository: Repository<EventoEntity>,
  ) {}

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
