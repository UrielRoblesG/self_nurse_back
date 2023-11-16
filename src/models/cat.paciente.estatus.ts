import { CatPatientStatusEntity } from '../database/entities/cat.patient.status.entity';

export class CatPacienteEstatus {
  id: number;
  name: string;
  description: string;

  constructor(id: number, name: string, description: string) {
    this.id = id;
    this.name = name;
    this.description = description;
  }

  static FromPatientEntity(entity: CatPatientStatusEntity): CatPacienteEstatus {
    return new CatPacienteEstatus(entity.id, entity.name, entity.description);
  }
}
