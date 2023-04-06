import { Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { CatRelationshipEntity } from './cat.relationship.enity';

@Entity({ name: 'cuidador' })
export class CaregiverEntity {
  @PrimaryGeneratedColumn('identity')
  id: number;

  @ManyToOne(() => CatRelationshipEntity)
  relationship: CatRelationshipEntity;
}
