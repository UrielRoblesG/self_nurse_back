import { CatRelationship } from './cat.relationship';
import { CaregiverEntity } from 'src/database/entities/caregiver.entity';

export class Cuidador {
  id?: number;
  relation: CatRelationship;

  constructor(caregiver: CaregiverEntity) {
    this.id = caregiver.id;
    this.relation = new CatRelationship(caregiver.relationship);
  }
}
