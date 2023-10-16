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
      .where('evento.recordar = true')
      .where(
        "evento.fecha BETWEEN CURRENT_TIMESTAMP() and ADDTIME(CURRENT_TIMESTAMP(), '00:05:00')",
      )
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
