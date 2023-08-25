export class Evento {
  id: number;
  alerta: string;
  fecha: Date;
  pacienteId: number;
  nurseId: number;
  recordar: boolean;

  constructor(
    id: number,
    alerta: string,
    fecha: Date,
    paciente: number,
    nurse: number,
    recordar: boolean,
  ) {
    this.id = id;
    this.alerta = alerta;
    this.fecha = fecha;
    this.pacienteId = paciente;
    this.nurseId = nurse;
    this.recordar = recordar;
  }
}
