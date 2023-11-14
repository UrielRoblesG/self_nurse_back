import { da } from "date-fns/locale";
import { AlertEntity } from "src/database/entities";



export class Alerta {

    id: number;
    type: number;
    patientId: number;
    lecturaId: number;
    fecha: Date;
    spO2: number;
    bpm: number;
    temp: number;



    constructor(id: number, type: number, patient: number,
         lectura: number, fecha: Date, spO2: number,
        bpm: number, temp: number) {
        this.id = id;
        this.type = type;
        this.patientId = patient;
        this.lecturaId = lectura;
        this.fecha = fecha;
        this.spO2 = spO2;
        this.bpm = bpm;
        this.temp = temp;
    }

    static fromEntityModel(data : any): Alerta {
        return new Alerta(data.id, data.type, data.patientId, data.lecturaId, data.fecha, data.spO2, data.bpm, data.temp);
    }
}