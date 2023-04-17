import { CatRelationshipEntity } from 'src/database/entities/cat.relationship.enity';

export class CatRelationship {
  id: number;
  relation: string;

  constructor(id: number, relation: string) {
    this.id = id;
    this.relation = relation;
  }

  static fromCatRelationshipEntity(
    entity: CatRelationshipEntity,
  ): CatRelationship {
    return new CatRelationship(entity.id, entity.name);
  }
}
