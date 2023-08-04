import { CatRelationship } from './cat.relationship';
import { NurseEntity } from 'src/database/entities/nurse.entity';

export class Cuidador {
  id?: number;

  constructor(caregiver: NurseEntity) {
    this.id = caregiver.id;
  }
}
