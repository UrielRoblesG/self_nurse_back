import { CatPatientStatusEntity } from 'src/database/entities/cat.patient.status.entity';

export class CatPacienteEstatus {
  id: number;
  nombre: string;
  descripcion: string;

  constructor(id: number, name: string, description: string) {
    this.id = id;
    this.nombre = name;
    this.descripcion = description;
  }

  static FromPatientEntity(entity: CatPatientStatusEntity): CatPacienteEstatus {
    return new CatPacienteEstatus(entity.id, entity.name, entity.description);
  }
}
