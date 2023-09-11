import { EventoEntity } from 'apps/self-nurse/src/database/entities/evento.entity';

export class Evento {
  id: number;
  alerta: string;
  fecha: Date;
  pacienteId: number;
  nurseId: number;
  recordar: boolean;
  tipo: number;
  frecuencia: string;

  constructor(data: EventoEntity) {
    this.id = data.id;
    this.alerta = data.alerta;
    this.fecha = data.fecha;
    this.pacienteId = data.paciente.id;
    this.nurseId = data.nurse.id;
    this.recordar = data.recordar;
    this.tipo = data.tipo;
    this.frecuencia = data.frecuencia;
  }
}
