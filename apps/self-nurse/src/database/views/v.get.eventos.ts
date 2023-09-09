import { DataSource, ViewColumn, ViewEntity } from 'typeorm';
import { EventoEntity } from '../entities';

@ViewEntity({
  expression: (dataSource: DataSource) =>
    dataSource
      .createQueryBuilder()
      .select('evento.id', 'id')
      .addSelect('evento.alerta', 'alerta')
      .addSelect('evento.fecha', 'fecha')
      .addSelect('evento.pacienteId', 'pacienteId')
      .addSelect('evento.nurseId', 'nurseId')
      .addSelect('evento.recordar', 'recordar')
      .from(EventoEntity, 'evento')
      .where('evento.deleted_at is null')
      .orderBy('fecha', 'DESC'),
})
export class ViewGetPacienteEventos {
  @ViewColumn()
  id: number;

  @ViewColumn()
  alerta: string;

  @ViewColumn()
  fecha: Date;

  @ViewColumn()
  pacienteId: number;

  @ViewColumn()
  nurseId: number;

  @ViewColumn()
  recordar: boolean;
}
