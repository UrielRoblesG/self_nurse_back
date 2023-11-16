import { CatRelationshipEntity } from '../database/entities/cat.relationship.enity';

export class CatRelationship {
  id: number;
  name: string;

  constructor(relationship: CatRelationshipEntity) {
    this.id = relationship.id;
    this.name = relationship.name;
  }
}
