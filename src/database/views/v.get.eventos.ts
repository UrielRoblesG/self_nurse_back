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
      .addSelect('evento.tipo', 'tipo')
      .addSelect('evento.frecuencia', 'frecuencia')
      .addSelect('evento.estatus', 'estatus')
      .from(EventoEntity, 'evento')
      .where('evento.deleted_at is null')
      .andWhere('evento.recordar = true')
      .andWhere('evento.estatus = \'A\'')
      .andWhere(
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

  @ViewColumn()
  frecuencia: string;

  @ViewColumn()
  estatus: string;

  @ViewColumn()
  tipo: number;
}
