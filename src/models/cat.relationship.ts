import { CatRelationshipEntity } from 'src/database/entities/cat.relationship.enity';

export class CatRelationship {
  id: number;
  relation: string;

  constructor(relationship: CatRelationshipEntity) {
    this.id = relationship.id;
    this.relation = relationship.name;
  }
}
